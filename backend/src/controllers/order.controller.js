const OrderModel = require("../models/Order");
const CartModel = require("../models/Cart");
const CouponModel = require("../models/Coupon");
const StockBlockModel = require("../models/StockBlock");
const AddressModel = require("../models/Address");
const CardModel = require("../models/Card");

class OrderController {
  // Criar pedido a partir do carrinho
  async createFromCart(req, res) {
    try {
      const { clientId } = req.params;
      const { deliveryAddressId, saveAddress = false } = req.body;

      // Validar carrinho
      const cart = await CartModel.findByClientId(clientId);
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrinho não encontrado",
        });
      }

      // Verificar se carrinho expirou
      if (await CartModel.isExpired(cart.id)) {
        return res.status(400).json({
          success: false,
          message: "Carrinho expirado",
        });
      }

      // Validar disponibilidade dos itens
      const issues = await CartModel.validateItemsAvailability(cart.id);
      if (issues.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Itens com problemas de disponibilidade",
          data: { issues },
        });
      }

      // Buscar endereço de entrega
      let deliveryAddress;
      if (deliveryAddressId) {
        const address = await AddressModel.findById(deliveryAddressId);
        deliveryAddress = {
          id: address.id,
          name: address.name,
          street: `${address.streetType} ${address.street}, ${address.number}`,
          district: address.district,
          city: address.city,
          state: address.state,
          cep: address.cep,
          country: address.country,
          observations: address.observations,
        };
      } else {
        return res.status(400).json({
          success: false,
          message: "Endereço de entrega é obrigatório",
        });
      }

      // Preparar itens do pedido
      const items = cart.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      // Calcular frete (simulação)
      const shippingAmount = OrderController.calculateShipping(
        items,
        deliveryAddress
      );

      // Criar pedido
      const order = await OrderModel.create({
        clientId,
        items,
        deliveryAddress,
        shippingAmount,
      });

      // Converter bloqueios de carrinho para pedido
      await OrderController.convertCartBlocksToOrder(cart.id, order.id);

      // Limpar carrinho
      await CartModel.clearCart(cart.id);

      res.json({
        success: true,
        message: "Pedido criado com sucesso",
        data: { order },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Processar pagamento do pedido
  async processPayment(req, res) {
    try {
      const { orderId } = req.params;
      const {
        cardId,
        cards = [], // Array de cartões com valores (RN0034)
        couponCodes = [],
        newCard = null,
        saveCard = false,
      } = req.body;

      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Pedido não encontrado",
        });
      }

      if (order.status !== "OPEN") {
        return res.status(400).json({
          success: false,
          message: "Pedido não está em aberto para pagamento",
        });
      }

      let finalCardId = cardId;

      // Se novo cartão foi fornecido, cadastrá-lo
      if (newCard) {
        const card = await CardModel.create(order.clientId, {
          ...newCard,
          isPreferred: !cardId, // Se não há cartão selecionado, tornar preferencial
        });
        finalCardId = card.id;
      }

      // Validar cupons se fornecidos
      const couponValidation = await OrderController.validateCoupons(
        couponCodes,
        order.clientId,
        order.totalAmount
      );
      if (!couponValidation.valid) {
        return res.status(400).json({
          success: false,
          message: couponValidation.message,
        });
      }

      // Calcular valor do pagamento (após cupons)
      const paymentAmount = OrderController.calculatePaymentAmount(
        order.finalAmount,
        couponValidation.coupons
      );

      // Validar múltiplos cartões (RN0034) - usar valor após cupons
      if (cards.length > 0) {
        const cardValidation = OrderController.validateMultipleCards(
          cards,
          paymentAmount // ✅ Usar valor após cupons, não order.finalAmount
        );
        if (!cardValidation.valid) {
          return res.status(400).json({
            success: false,
            message: cardValidation.message,
          });
        }
      }

      // Processar pagamento
      const payment = await OrderModel.processPayment(orderId, {
        cardId: finalCardId,
        cards: cards, // Múltiplos cartões (RN0034)
        couponCodes,
        amount: paymentAmount,
      });

      // Gerar cupom de troca se necessário
      if (couponValidation.exchangeValue > 0) {
        await CouponModel.generateExchangeCoupon(
          orderId,
          couponValidation.exchangeValue
        );
      }

      res.json({
        success: true,
        message: "Pagamento processado com sucesso",
        data: {
          order: await OrderModel.findById(orderId),
          payment,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar pedido por ID
  async getOrderById(req, res) {
    try {
      const { orderId } = req.params;

      const order = await OrderModel.findById(orderId);

      res.json({
        success: true,
        data: { order },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar pedido por número
  async getOrderByNumber(req, res) {
    try {
      const { orderNumber } = req.params;

      const order = await OrderModel.findByOrderNumber(orderNumber);

      res.json({
        success: true,
        data: { order },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar pedidos do cliente
  async getClientOrders(req, res) {
    try {
      const { clientId } = req.params;
      const { status, page = 1, limit = 20 } = req.query;

      const result = await OrderModel.findByClientId(clientId, {
        status,
        page: parseInt(page),
        limit: parseInt(limit),
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar todos os pedidos (admin)
  async getAllOrders(req, res) {
    try {
      const {
        status,
        clientId,
        orderNumber,
        startDate,
        endDate,
        page = 1,
        limit = 50,
      } = req.query;

      const result = await OrderModel.findAll({
        status,
        clientId,
        orderNumber,
        startDate,
        endDate,
        page: parseInt(page),
        limit: parseInt(limit),
      });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Atualizar status do pedido (admin)
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const order = await OrderModel.updateStatus(orderId, status);

      res.json({
        success: true,
        message: "Status do pedido atualizado",
        data: { order },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Solicitar troca
  async requestExchange(req, res) {
    try {
      const { orderId } = req.params;
      const { productId, quantity, reason } = req.body;

      if (!productId || !quantity || !reason) {
        return res.status(400).json({
          success: false,
          message: "Produto, quantidade e motivo são obrigatórios",
        });
      }

      const exchange = await OrderModel.requestExchange(orderId, {
        productId,
        quantity,
        reason,
      });

      res.json({
        success: true,
        message: "Solicitação de troca enviada",
        data: { exchange },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Autorizar troca (admin)
  async authorizeExchange(req, res) {
    try {
      const { exchangeId } = req.params;

      const exchange = await OrderModel.authorizeExchange(exchangeId);

      res.json({
        success: true,
        message: "Troca autorizada",
        data: { exchange },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Confirmar recebimento de troca (admin)
  async confirmExchangeReceipt(req, res) {
    try {
      const { exchangeId } = req.params;
      const { returnToStock = true } = req.body;

      const result = await OrderModel.confirmExchangeReceipt(
        exchangeId,
        returnToStock
      );

      res.json({
        success: true,
        message: "Recebimento de troca confirmado",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar solicitações de troca (admin)
  async getExchangeRequests(req, res) {
    try {
      const { status = "PENDING" } = req.query;

      const exchanges = await prisma.exchange.findMany({
        where: { status },
        include: {
          order: {
            include: {
              client: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          product: true,
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: true,
        data: { exchanges },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Estatísticas de pedidos
  async getOrderStats(req, res) {
    try {
      const stats = await OrderModel.getStats();

      res.json({
        success: true,
        data: { stats },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Métodos auxiliares
  static calculateShipping(items, deliveryAddress) {
    // Simulação de cálculo de frete
    const totalWeight = items.reduce(
      (sum, item) => sum + item.quantity * 0.5,
      0
    ); // 0.5kg por item
    const baseRate = 10; // R$ 10,00 base
    const weightRate = totalWeight * 2; // R$ 2,00 por kg
    const distanceRate = 5; // R$ 5,00 por distância (simulado)

    return baseRate + weightRate + distanceRate;
  }

  static async validateCoupons(couponCodes, clientId, orderAmount) {
    if (couponCodes.length === 0) {
      return { valid: true, coupons: [], exchangeValue: 0 };
    }

    const coupons = [];
    let totalCouponValue = 0;
    let promotionalCouponUsed = false;

    for (const code of couponCodes) {
      try {
        const coupon = await CouponModel.validateCoupon(
          code,
          clientId,
          orderAmount
        );

        if (coupon.type === "promotional" && promotionalCouponUsed) {
          return {
            valid: false,
            message: "Apenas um cupom promocional pode ser usado por compra",
          };
        }

        if (coupon.type === "promotional") {
          promotionalCouponUsed = true;
        }

        coupons.push(coupon);
        totalCouponValue += coupon.value;
      } catch (error) {
        return { valid: false, message: error.message };
      }
    }

    // Verificar se valor dos cupons não excede o valor do pedido
    if (totalCouponValue > orderAmount) {
      return {
        valid: false,
        message: "Valor dos cupons excede o valor do pedido",
      };
    }

    // Calcular valor de troca se necessário
    const exchangeValue =
      totalCouponValue > orderAmount ? totalCouponValue - orderAmount : 0;

    return { valid: true, coupons, exchangeValue };
  }

  static calculatePaymentAmount(orderAmount, coupons) {
    const totalCouponValue = coupons.reduce(
      (sum, coupon) => sum + coupon.value,
      0
    );
    return Math.max(0, orderAmount - totalCouponValue);
  }

  // Validar múltiplos cartões (RN0034)
  static validateMultipleCards(cards, orderAmount) {
    const MIN_CARD_AMOUNT = 10.0; // R$ 10,00 mínimo por cartão
    const ROUNDING_TOLERANCE = 0.05; // Tolerância de R$ 0,05 para diferenças de arredondamento

    console.log("=== VALIDAÇÃO MÚLTIPLOS CARTÕES ===");
    console.log("Cartões recebidos:", JSON.stringify(cards, null, 2));
    console.log("Valor do pagamento (após cupons):", orderAmount);
    console.log("Tipo do orderAmount:", typeof orderAmount);

    if (!Array.isArray(cards) || cards.length === 0) {
      return { valid: false, message: "Nenhum cartão fornecido" };
    }

    // Validar estrutura dos cartões
    for (const card of cards) {
      console.log("Validando cartão:", card);
      if (!card.cardId || !card.amount) {
        return { valid: false, message: "Cartão deve ter ID e valor" };
      }

      if (card.amount < MIN_CARD_AMOUNT) {
        return {
          valid: false,
          message: `Valor mínimo por cartão é R$ ${MIN_CARD_AMOUNT.toFixed(
            2
          ).replace(".", ",")}`,
        };
      }
    }

    // Calcular total dos cartões
    const totalCardsAmount = cards.reduce((sum, card) => {
      const cardAmount = parseFloat(card.amount) || 0;
      console.log(`Cartão ${card.cardId}: R$ ${cardAmount}`);
      return sum + cardAmount;
    }, 0);

    console.log("Total dos cartões calculado:", totalCardsAmount);
    console.log(
      "Diferença absoluta:",
      Math.abs(totalCardsAmount - orderAmount)
    );
    console.log("Tolerância permitida:", ROUNDING_TOLERANCE);
    console.log(
      "Valor do pedido - tolerância:",
      orderAmount - ROUNDING_TOLERANCE
    );
    console.log(
      "Valor do pedido + tolerância:",
      orderAmount + ROUNDING_TOLERANCE
    );

    // Verificar se o total dos cartões não excede o valor do pedido (com tolerância)
    if (totalCardsAmount > orderAmount + ROUNDING_TOLERANCE) {
      console.log("❌ REJEITADO: Total dos cartões excede o valor do pedido");
      return {
        valid: false,
        message: "Valor total dos cartões excede o valor do pedido",
      };
    }

    // Verificar se o total dos cartões é suficiente para cobrir o pedido (com tolerância)
    if (totalCardsAmount < orderAmount - ROUNDING_TOLERANCE) {
      console.log("❌ REJEITADO: Total dos cartões é insuficiente");
      return {
        valid: false,
        message: "Valor total dos cartões é insuficiente para cobrir o pedido",
      };
    }

    console.log("✅ VALIDAÇÃO APROVADA!");
    return { valid: true, cards, totalAmount: totalCardsAmount };
  }

  static async convertCartBlocksToOrder(cartId, orderId) {
    const blocks = await StockBlockModel.findByCart(cartId);

    for (const block of blocks) {
      await StockBlockModel.unblockStock(block.id);
      await StockBlockModel.blockStock(
        block.productId,
        block.quantity,
        "ORDER",
        orderId
      );
    }
  }
}

module.exports = new OrderController();
