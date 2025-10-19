const databaseConfig = require("../config/database");

const prisma = databaseConfig.getClient();

class StockBlockModel {
  // Bloquear estoque
  async blockStock(productId, quantity, reason, reference) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    if (product.stock < quantity) {
      throw new Error("Estoque insuficiente para bloqueio");
    }

    // Calcular data de expiração (30 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Criar bloqueio
    const block = await prisma.stockBlock.create({
      data: {
        productId: parseInt(productId),
        quantity: parseInt(quantity),
        reason,
        reference: parseInt(reference),
        expiresAt,
      },
    });

    // Atualizar estoque disponível
    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: {
        stock: { decrement: parseInt(quantity) },
      },
    });

    return block;
  }

  // Desbloquear estoque
  async unblockStock(blockId) {
    const block = await prisma.stockBlock.findUnique({
      where: { id: parseInt(blockId) },
      include: { product: true },
    });

    if (!block) {
      throw new Error("Bloqueio não encontrado");
    }

    // Retornar estoque
    await prisma.product.update({
      where: { id: block.productId },
      data: {
        stock: { increment: block.quantity },
      },
    });

    // Remover bloqueio
    await prisma.stockBlock.delete({
      where: { id: parseInt(blockId) },
    });

    return block;
  }

  // Desbloquear estoque por referência (carrinho ou pedido)
  async unblockByReference(reason, reference) {
    const blocks = await prisma.stockBlock.findMany({
      where: {
        reason,
        reference: parseInt(reference),
      },
      include: { product: true },
    });

    for (const block of blocks) {
      await this.unblockStock(block.id);
    }

    return blocks.length;
  }

  // Verificar se produto está bloqueado
  async isProductBlocked(productId) {
    const blocks = await prisma.stockBlock.findMany({
      where: {
        productId: parseInt(productId),
        expiresAt: { gt: new Date() },
      },
    });

    const totalBlocked = blocks.reduce((sum, block) => sum + block.quantity, 0);

    return {
      isBlocked: totalBlocked > 0,
      totalBlocked,
      blocks,
    };
  }

  // Renovar bloqueio (estender expiração)
  async renewBlock(blockId) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    return await prisma.stockBlock.update({
      where: { id: parseInt(blockId) },
      data: { expiresAt },
    });
  }

  // Renovar todos os bloqueios de um carrinho
  async renewCartBlocks(cartId) {
    const blocks = await prisma.stockBlock.findMany({
      where: {
        reason: "CART",
        reference: parseInt(cartId),
        expiresAt: { gt: new Date() },
      },
    });

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    for (const block of blocks) {
      await prisma.stockBlock.update({
        where: { id: block.id },
        data: { expiresAt },
      });
    }

    return blocks.length;
  }

  // Remover bloqueios expirados
  async removeExpiredBlocks() {
    const expiredBlocks = await prisma.stockBlock.findMany({
      where: {
        expiresAt: { lte: new Date() },
      },
      include: { product: true },
    });

    for (const block of expiredBlocks) {
      // Retornar estoque
      await prisma.product.update({
        where: { id: block.productId },
        data: {
          stock: { increment: block.quantity },
        },
      });

      // Remover bloqueio
      await prisma.stockBlock.delete({
        where: { id: block.id },
      });
    }

    return expiredBlocks.length;
  }

  // Buscar bloqueios por produto
  async findByProduct(productId) {
    return await prisma.stockBlock.findMany({
      where: {
        productId: parseInt(productId),
        expiresAt: { gt: new Date() },
      },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Buscar bloqueios por carrinho
  async findByCart(cartId) {
    return await prisma.stockBlock.findMany({
      where: {
        reason: "CART",
        reference: parseInt(cartId),
      },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Buscar bloqueios por pedido
  async findByOrder(orderId) {
    return await prisma.stockBlock.findMany({
      where: {
        reason: "ORDER",
        reference: parseInt(orderId),
      },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Calcular estoque disponível (estoque total - bloqueios)
  async getAvailableStock(productId) {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    const blocks = await prisma.stockBlock.findMany({
      where: {
        productId: parseInt(productId),
        expiresAt: { gt: new Date() },
      },
    });

    const totalBlocked = blocks.reduce((sum, block) => sum + block.quantity, 0);
    const availableStock = product.stock - totalBlocked;

    return {
      totalStock: product.stock,
      blockedStock: totalBlocked,
      availableStock: Math.max(0, availableStock),
    };
  }

  // Notificar sobre bloqueios que vão expirar (5 minutos)
  async getExpiringBlocks(minutes = 5) {
    const threshold = new Date();
    threshold.setMinutes(threshold.getMinutes() + minutes);

    return await prisma.stockBlock.findMany({
      where: {
        expiresAt: {
          lte: threshold,
          gt: new Date(),
        },
      },
      include: { product: true },
      orderBy: { expiresAt: "asc" },
    });
  }

  // Estatísticas de bloqueios
  async getStats() {
    const [totalBlocks, activeBlocks, expiredBlocks, cartBlocks, orderBlocks] =
      await Promise.all([
        prisma.stockBlock.count(),
        prisma.stockBlock.count({
          where: { expiresAt: { gt: new Date() } },
        }),
        prisma.stockBlock.count({
          where: { expiresAt: { lte: new Date() } },
        }),
        prisma.stockBlock.count({
          where: { reason: "CART" },
        }),
        prisma.stockBlock.count({
          where: { reason: "ORDER" },
        }),
      ]);

    return {
      totalBlocks,
      activeBlocks,
      expiredBlocks,
      cartBlocks,
      orderBlocks,
    };
  }
}

module.exports = new StockBlockModel();








