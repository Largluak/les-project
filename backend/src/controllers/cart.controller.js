const CartModel = require("../models/Cart");
const ProductModel = require("../models/Product");
const StockBlockModel = require("../models/StockBlock");

class CartController {
  // Obter carrinho do cliente
  async getCart(req, res) {
    try {
      const { clientId } = req.params;

      let cart = await CartModel.findByClientId(clientId);

      // Se não existe carrinho ativo, criar um novo
      if (!cart) {
        cart = await CartModel.create(clientId);
      }

      // Verificar se carrinho expirou
      if (await CartModel.isExpired(cart.id)) {
        // Remover itens expirados
        await CartModel.clearCart(cart.id);
        cart = await CartModel.create(clientId);
      }

      // Calcular totais
      const totals = await CartModel.calculateTotal(cart.id);

      res.json({
        success: true,
        data: {
          cart,
          totals,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Adicionar item ao carrinho
  async addItem(req, res) {
    try {
      const { clientId } = req.params;
      const { productId, quantity } = req.body;

      if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Produto e quantidade são obrigatórios",
        });
      }

      // Verificar disponibilidade no estoque
      const isAvailable = await ProductModel.checkAvailability(
        productId,
        quantity
      );
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: "Produto não disponível em estoque",
        });
      }

      // Buscar ou criar carrinho
      let cart = await CartModel.findByClientId(clientId);
      if (!cart) {
        cart = await CartModel.create(clientId);
      }

      // Verificar se carrinho expirou
      if (await CartModel.isExpired(cart.id)) {
        await CartModel.clearCart(cart.id);
        cart = await CartModel.create(clientId);
      }

      // Adicionar item ao carrinho
      const cartItem = await CartModel.addItem(cart.id, productId, quantity);

      // Bloquear estoque
      await StockBlockModel.blockStock(productId, quantity, "CART", cart.id);

      // Renovar carrinho
      await CartModel.renewCart(cart.id);

      // Calcular totais
      const totals = await CartModel.calculateTotal(cart.id);

      res.json({
        success: true,
        message: "Item adicionado ao carrinho",
        data: {
          cartItem,
          totals,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Atualizar quantidade de item no carrinho
  async updateItemQuantity(req, res) {
    try {
      const { clientId } = req.params;
      const { productId, quantity } = req.body;

      if (!productId || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Produto e quantidade válida são obrigatórios",
        });
      }

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

      if (quantity === 0) {
        // Remover item
        await CartModel.removeItem(cart.id, productId);
        await StockBlockModel.unblockByReference("CART", cart.id);
      } else {
        // Verificar disponibilidade no estoque
        const isAvailable = await ProductModel.checkAvailability(
          productId,
          quantity
        );
        if (!isAvailable) {
          return res.status(400).json({
            success: false,
            message: "Estoque insuficiente",
          });
        }

        // Atualizar quantidade
        await CartModel.updateItemQuantity(cart.id, productId, quantity);

        // Atualizar bloqueio de estoque
        await StockBlockModel.unblockByReference("CART", cart.id);
        await StockBlockModel.blockStock(productId, quantity, "CART", cart.id);
      }

      // Renovar carrinho
      await CartModel.renewCart(cart.id);

      // Calcular totais
      const totals = await CartModel.calculateTotal(cart.id);

      res.json({
        success: true,
        message: "Carrinho atualizado",
        data: { totals },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Remover item do carrinho
  async removeItem(req, res) {
    try {
      const { clientId, productId } = req.params;

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

      // Remover item
      await CartModel.removeItem(cart.id, productId);

      // Desbloquear estoque
      await StockBlockModel.unblockByReference("CART", cart.id);

      // Renovar carrinho
      await CartModel.renewCart(cart.id);

      // Calcular totais
      const totals = await CartModel.calculateTotal(cart.id);

      res.json({
        success: true,
        message: "Item removido do carrinho",
        data: { totals },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Limpar carrinho
  async clearCart(req, res) {
    try {
      const { clientId } = req.params;

      const cart = await CartModel.findByClientId(clientId);
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrinho não encontrado",
        });
      }

      // Desbloquear estoque
      await StockBlockModel.unblockByReference("CART", cart.id);

      // Limpar carrinho
      await CartModel.clearCart(cart.id);

      res.json({
        success: true,
        message: "Carrinho limpo",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Validar carrinho
  async validateCart(req, res) {
    try {
      const { clientId } = req.params;

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

      // Calcular totais
      const totals = await CartModel.calculateTotal(cart.id);

      res.json({
        success: true,
        message: "Carrinho válido",
        data: {
          cart,
          totals,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Renovar carrinho
  async renewCart(req, res) {
    try {
      const { clientId } = req.params;

      const cart = await CartModel.findByClientId(clientId);
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: "Carrinho não encontrado",
        });
      }

      // Renovar carrinho
      await CartModel.renewCart(cart.id);

      // Renovar bloqueios de estoque
      await StockBlockModel.renewCartBlocks(cart.id);

      res.json({
        success: true,
        message: "Carrinho renovado",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Obter itens que vão expirar
  async getExpiringItems(req, res) {
    try {
      const expiringBlocks = await StockBlockModel.getExpiringBlocks(5); // 5 minutos

      const items = expiringBlocks.map((block) => ({
        productId: block.productId,
        productName: block.product.name,
        quantity: block.quantity,
        expiresAt: block.expiresAt,
        timeLeft: Math.max(
          0,
          Math.floor((block.expiresAt - new Date()) / 1000 / 60)
        ),
      }));

      res.json({
        success: true,
        data: { items },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Limpar carrinhos expirados (admin)
  async cleanupExpiredCarts(req, res) {
    try {
      const removedCount = await CartModel.removeExpiredCarts();
      const unblockedCount = await StockBlockModel.removeExpiredBlocks();

      res.json({
        success: true,
        message: "Limpeza concluída",
        data: {
          removedCarts: removedCount,
          unblockedItems: unblockedCount,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CartController();








