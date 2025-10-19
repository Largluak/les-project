const databaseConfig = require("../config/database");

const prisma = databaseConfig.getClient();

class OrderModel {
  // Gerar número do pedido
  async generateOrderNumber() {
    const { nanoid } = await import("nanoid");
    let orderNumber;
    let exists = true;

    while (exists) {
      orderNumber = `PED-${nanoid(10).toUpperCase()}`;
      const existing = await prisma.order.findUnique({
        where: { orderNumber },
      });
      exists = !!existing;
    }

    return orderNumber;
  }

  // Criar pedido
  async create(orderData) {
    const {
      clientId,
      items,
      deliveryAddress,
      shippingAmount = 0,
      discountAmount = 0,
    } = orderData;

    const orderNumber = await this.generateOrderNumber();

    // Calcular totais
    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const finalAmount = totalAmount + shippingAmount - discountAmount;

    return await prisma.order.create({
      data: {
        orderNumber,
        clientId: parseInt(clientId),
        status: "OPEN",
        totalAmount,
        shippingAmount,
        discountAmount,
        finalAmount,
        deliveryAddress: JSON.stringify(deliveryAddress),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        client: true,
      },
    });
  }

  // Buscar pedido por ID
  async findById(id) {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        client: true,
        payments: {
          include: {
            card: true,
            coupons: {
              include: {
                coupon: true,
              },
            },
          },
        },
        exchanges: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    return order;
  }

  // Buscar pedido por número
  async findByOrderNumber(orderNumber) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        client: true,
        payments: {
          include: {
            card: true,
            coupons: {
              include: {
                coupon: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    return order;
  }

  // Buscar pedidos do cliente
  async findByClientId(clientId, filters = {}) {
    const { status, page = 1, limit = 20 } = filters;

    const where = {
      clientId: parseInt(clientId),
    };

    if (status) where.status = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar todos os pedidos (admin)
  async findAll(filters = {}) {
    const {
      status,
      clientId,
      orderNumber,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = filters;

    const where = {};

    if (status) where.status = status;
    if (clientId) where.clientId = parseInt(clientId);
    if (orderNumber)
      where.orderNumber = { contains: orderNumber, mode: "insensitive" };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: true,
            },
          },
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Atualizar status do pedido
  async updateStatus(id, status) {
    const validStatuses = [
      "OPEN",
      "PROCESSING",
      "APPROVED",
      "REJECTED",
      "IN_TRANSIT",
      "DELIVERED",
      "EXCHANGE_REQUESTED",
      "EXCHANGE_AUTHORIZED",
      "EXCHANGED",
    ];

    if (!validStatuses.includes(status)) {
      throw new Error("Status inválido");
    }

    return await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        client: true,
      },
    });
  }

  // Processar pagamento do pedido
  async processPayment(orderId, paymentData) {
    const { cardId, cards = [], couponCodes = [], amount } = paymentData;

    const order = await this.findById(orderId);

    if (order.status !== "OPEN") {
      throw new Error("Pedido não está em aberto para pagamento");
    }

    // Criar pagamento
    const payment = await prisma.payment.create({
      data: {
        orderId: parseInt(orderId),
        cardId: cardId ? parseInt(cardId) : null,
        amount: parseFloat(amount),
        type: cardId || cards.length > 0 ? "credit_card" : "coupon",
        status: "PENDING",
      },
    });

    // Processar múltiplos cartões (RN0034)
    if (cards.length > 0) {
      for (const cardData of cards) {
        await prisma.paymentCard.create({
          data: {
            paymentId: payment.id,
            cardId: parseInt(cardData.cardId),
            amount: parseFloat(cardData.amount),
            status: "PENDING",
          },
        });
      }
    }

    // Processar cupons se houver
    if (couponCodes.length > 0) {
      for (const couponCode of couponCodes) {
        // Aqui seria feita a validação do cupom
        // Por simplicidade, vamos assumir que o cupom é válido
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode },
        });

        if (coupon && !coupon.used) {
          await prisma.paymentCoupon.create({
            data: {
              paymentId: payment.id,
              couponId: coupon.id,
              amount: coupon.value,
            },
          });

          // Marcar cupom como usado
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: {
              used: true,
              usedAt: new Date(),
            },
          });
        }
      }
    }

    // Simular validação de pagamento
    const paymentApproved = await this.validatePayment(payment);

    if (paymentApproved) {
      // ✅ Manter status OPEN após pagamento - aguardar aprovação manual
      // await this.updateStatus(orderId, "APPROVED");

      // Dar baixa no estoque
      await this.updateStock(orderId, "subtract");
    } else {
      await this.updateStatus(orderId, "REJECTED");
    }

    return payment;
  }

  // Validar pagamento (simulação)
  async validatePayment(payment) {
    // Simular validação de cartão de crédito
    if (payment.type === "credit_card") {
      // Simular aprovação baseada em regras simples
      return payment.amount >= 10; // Mínimo de R$ 10,00
    }

    // Cupons sempre aprovados se válidos
    return true;
  }

  // Atualizar estoque após pedido
  async updateStock(orderId, operation) {
    const order = await this.findById(orderId);

    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            [operation === "add" ? "increment" : "decrement"]: item.quantity,
          },
        },
      });
    }
  }

  // Solicitar troca
  async requestExchange(orderId, exchangeData) {
    const { productId, quantity, reason } = exchangeData;

    const order = await this.findById(orderId);

    if (order.status !== "DELIVERED") {
      throw new Error("Apenas pedidos entregues podem ser trocados");
    }

    // Verificar se o produto existe no pedido
    const orderItem = order.items.find(
      (item) => item.productId === parseInt(productId)
    );
    if (!orderItem) {
      throw new Error("Produto não encontrado no pedido");
    }

    if (quantity > orderItem.quantity) {
      throw new Error("Quantidade solicitada excede a quantidade comprada");
    }

    // Criar solicitação de troca
    const exchange = await prisma.exchange.create({
      data: {
        orderId: parseInt(orderId),
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        reason,
        status: "PENDING",
      },
    });

    // Atualizar status do pedido
    await this.updateStatus(orderId, "EXCHANGE_REQUESTED");

    return exchange;
  }

  // Autorizar troca (admin)
  async authorizeExchange(exchangeId) {
    const exchange = await prisma.exchange.findUnique({
      where: { id: parseInt(exchangeId) },
      include: { order: true },
    });

    if (!exchange) {
      throw new Error("Solicitação de troca não encontrada");
    }

    // Atualizar status da troca
    await prisma.exchange.update({
      where: { id: parseInt(exchangeId) },
      data: { status: "AUTHORIZED" },
    });

    // Atualizar status do pedido
    await this.updateStatus(exchange.orderId, "EXCHANGE_AUTHORIZED");

    return exchange;
  }

  // Confirmar recebimento de troca (admin)
  async confirmExchangeReceipt(exchangeId, returnToStock = true) {
    const exchange = await prisma.exchange.findUnique({
      where: { id: parseInt(exchangeId) },
      include: { order: true, product: true },
    });

    if (!exchange) {
      throw new Error("Solicitação de troca não encontrada");
    }

    // Atualizar status da troca
    await prisma.exchange.update({
      where: { id: parseInt(exchangeId) },
      data: { status: "RECEIVED" },
    });

    // Retornar produto ao estoque se solicitado
    if (returnToStock) {
      await prisma.product.update({
        where: { id: exchange.productId },
        data: {
          stock: { increment: exchange.quantity },
        },
      });
    }

    // Gerar cupom de troca
    const couponValue = exchange.quantity * exchange.product.price;
    const coupon = await prisma.coupon.create({
      data: {
        code: `TROCA-${Date.now()}`,
        type: "exchange",
        value: couponValue,
        clientId: exchange.order.clientId,
        orderId: exchange.orderId,
      },
    });

    // Atualizar status do pedido
    await this.updateStatus(exchange.orderId, "EXCHANGED");

    return { exchange, coupon };
  }

  // Estatísticas de pedidos
  async getStats() {
    const [
      totalOrders,
      openOrders,
      processingOrders,
      approvedOrders,
      deliveredOrders,
      totalRevenue,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "OPEN" } }),
      prisma.order.count({ where: { status: "PROCESSING" } }),
      prisma.order.count({ where: { status: "APPROVED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.aggregate({
        where: { status: "APPROVED" },
        _sum: { finalAmount: true },
      }),
    ]);

    return {
      totalOrders,
      openOrders,
      processingOrders,
      approvedOrders,
      deliveredOrders,
      totalRevenue: totalRevenue._sum.finalAmount || 0,
    };
  }
}

module.exports = new OrderModel();
