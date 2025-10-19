const databaseConfig = require("../config/database");

const prisma = databaseConfig.getClient();

class CartModel {
  // Criar carrinho para cliente
  async create(clientId) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // 30 minutos para expirar

    return await prisma.cart.create({
      data: {
        clientId: parseInt(clientId),
        expiresAt,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  // Buscar carrinho ativo do cliente
  async findByClientId(clientId) {
    try {
      const cart = await prisma.cart.findFirst({
        where: {
          clientId: parseInt(clientId),
          expiresAt: { gt: new Date() },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return cart;
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      throw error;
    }
  }

  // Buscar carrinho por ID
  async findById(id) {
    const cart = await prisma.cart.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        client: true,
      },
    });

    if (!cart) {
      throw new Error("Carrinho não encontrado");
    }

    return cart;
  }

  // Adicionar item ao carrinho
  async addItem(cartId, productId, quantity) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    if (!product.active) {
      throw new Error("Produto não está ativo");
    }

    if (product.stock < quantity) {
      throw new Error("Estoque insuficiente");
    }

    // Verificar se item já existe no carrinho
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: parseInt(cartId),
        productId: parseInt(productId),
      },
    });

    if (existingItem) {
      // Atualizar quantidade
      const newQuantity = existingItem.quantity + quantity;
      if (product.stock < newQuantity) {
        throw new Error("Estoque insuficiente para a quantidade solicitada");
      }

      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    } else {
      // Criar novo item
      return await prisma.cartItem.create({
        data: {
          cartId: parseInt(cartId),
          productId: parseInt(productId),
          quantity,
          price: product.price,
        },
        include: { product: true },
      });
    }
  }

  // Atualizar quantidade de item no carrinho
  async updateItemQuantity(cartId, productId, quantity) {
    if (quantity <= 0) {
      return await this.removeItem(cartId, productId);
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    if (product.stock < quantity) {
      throw new Error("Estoque insuficiente");
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        cartId: parseInt(cartId),
        productId: parseInt(productId),
      },
    });

    if (!item) {
      throw new Error("Item não encontrado no carrinho");
    }

    return await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
      include: { product: true },
    });
  }

  // Remover item do carrinho
  async removeItem(cartId, productId) {
    const item = await prisma.cartItem.findFirst({
      where: {
        cartId: parseInt(cartId),
        productId: parseInt(productId),
      },
    });

    if (!item) {
      throw new Error("Item não encontrado no carrinho");
    }

    return await prisma.cartItem.delete({
      where: { id: item.id },
    });
  }

  // Limpar carrinho
  async clearCart(cartId) {
    return await prisma.cartItem.deleteMany({
      where: { cartId: parseInt(cartId) },
    });
  }

  // Calcular total do carrinho
  async calculateTotal(cartId) {
    const cart = await this.findById(cartId);

    const total = cart.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return {
      subtotal: total,
      total,
      itemCount: cart.items.length,
      totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  // Verificar se carrinho expirou
  async isExpired(cartId) {
    const cart = await prisma.cart.findUnique({
      where: { id: parseInt(cartId) },
      select: { expiresAt: true },
    });

    if (!cart) {
      return true;
    }

    return new Date() > cart.expiresAt;
  }

  // Renovar carrinho (estender expiração)
  async renewCart(cartId) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    return await prisma.cart.update({
      where: { id: parseInt(cartId) },
      data: { expiresAt },
    });
  }

  // Remover carrinhos expirados
  async removeExpiredCarts() {
    const expiredCarts = await prisma.cart.findMany({
      where: {
        expiresAt: { lte: new Date() },
      },
    });

    for (const cart of expiredCarts) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      await prisma.cart.delete({
        where: { id: cart.id },
      });
    }

    return expiredCarts.length;
  }

  // Verificar disponibilidade de todos os itens
  async validateItemsAvailability(cartId) {
    const cart = await this.findById(cartId);
    const issues = [];

    for (const item of cart.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product || !product.active) {
        issues.push({
          itemId: item.id,
          productId: item.productId,
          productName: item.product.name,
          issue: "Produto não disponível",
        });
      } else if (product.stock < item.quantity) {
        issues.push({
          itemId: item.id,
          productId: item.productId,
          productName: item.product.name,
          issue: `Estoque insuficiente. Disponível: ${product.stock}`,
        });
      }
    }

    return issues;
  }
}

module.exports = new CartModel();
