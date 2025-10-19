const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

class ProductModel {
  // Buscar todos os produtos
  static async findAll(filters = {}) {
    try {
      const {
        page = 1,
        limit = 12,
        search = "",
        minPrice,
        maxPrice,
        stockFilter,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = filters;

      const skip = (page - 1) * limit;

      // Construir filtros
      const where = {
        active: true,
      };

      // Filtro de busca
      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      // Filtro de preço
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }

      // Filtro de estoque
      if (stockFilter !== undefined) {
        if (stockFilter === "true") {
          where.stock = { gt: 0 };
        } else if (stockFilter === "false") {
          where.stock = { lte: 0 };
        }
      }

      // Buscar produtos
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
        }),
        prisma.product.count({ where }),
      ]);

      return {
        products,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          limit,
          total,
        },
      };
    } catch (error) {
      throw new Error(`Erro ao buscar produtos: ${error.message}`);
    }
  }

  // Buscar produto por ID
  static async findById(id) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
      });

      if (!product) {
        throw new Error("Produto não encontrado");
      }

      return product;
    } catch (error) {
      throw new Error(`Erro ao buscar produto: ${error.message}`);
    }
  }

  // Criar produto
  static async create(productData) {
    try {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock) || 0,
          active: productData.active !== undefined ? productData.active : true,
        },
      });

      return product;
    } catch (error) {
      throw new Error(`Erro ao criar produto: ${error.message}`);
    }
  }

  // Atualizar produto
  static async update(id, productData) {
    try {
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: {
          name: productData.name,
          description: productData.description,
          price: parseFloat(productData.price),
          stock: parseInt(productData.stock),
          active: productData.active,
        },
      });

      return product;
    } catch (error) {
      throw new Error(`Erro ao atualizar produto: ${error.message}`);
    }
  }

  // Deletar produto
  static async delete(id) {
    try {
      await prisma.product.delete({
        where: { id: parseInt(id) },
      });

      return true;
    } catch (error) {
      throw new Error(`Erro ao deletar produto: ${error.message}`);
    }
  }

  // Verificar disponibilidade no estoque
  static async checkAvailability(productId, quantity) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
      });

      if (!product) {
        return false;
      }

      // Verificar se produto está ativo
      if (!product.active) {
        return false;
      }

      // Verificar estoque disponível
      const availableStock = await this.getAvailableStock(productId);
      return availableStock >= quantity;
    } catch (error) {
      throw new Error(`Erro ao verificar disponibilidade: ${error.message}`);
    }
  }

  // Obter estoque disponível (considerando bloqueios)
  static async getAvailableStock(productId) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
      });

      if (!product) {
        return 0;
      }

      // Calcular estoque bloqueado
      const blockedStock = await prisma.stockBlock.aggregate({
        where: {
          productId: parseInt(productId),
          expiresAt: { gt: new Date() },
        },
        _sum: { quantity: true },
      });

      const blockedQuantity = blockedStock._sum.quantity || 0;
      const availableStock = Math.max(0, product.stock - blockedQuantity);

      return availableStock;
    } catch (error) {
      throw new Error(`Erro ao calcular estoque disponível: ${error.message}`);
    }
  }

  // Atualizar estoque
  static async updateStock(productId, quantity, operation = "decrease") {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
      });

      if (!product) {
        throw new Error("Produto não encontrado");
      }

      let newStock;
      if (operation === "decrease") {
        newStock = Math.max(0, product.stock - quantity);
      } else if (operation === "increase") {
        newStock = product.stock + quantity;
      } else {
        throw new Error("Operação inválida");
      }

      const updatedProduct = await prisma.product.update({
        where: { id: parseInt(productId) },
        data: { stock: newStock },
      });

      return updatedProduct;
    } catch (error) {
      throw new Error(`Erro ao atualizar estoque: ${error.message}`);
    }
  }

  // Buscar produtos por categoria (se implementado)
  static async findByCategory(categoryId) {
    try {
      const products = await prisma.product.findMany({
        where: {
          active: true,
          // Adicionar filtro de categoria quando implementado
        },
      });

      return products;
    } catch (error) {
      throw new Error(`Erro ao buscar produtos por categoria: ${error.message}`);
    }
  }

  // Buscar produtos em promoção (se implementado)
  static async findOnSale() {
    try {
      const products = await prisma.product.findMany({
        where: {
          active: true,
          stock: { gt: 0 },
          // Adicionar filtro de promoção quando implementado
        },
      });

      return products;
    } catch (error) {
      throw new Error(`Erro ao buscar produtos em promoção: ${error.message}`);
    }
  }

  // Obter estatísticas de produtos
  static async getStats() {
    try {
      const [total, active, outOfStock, lowStock] = await Promise.all([
        prisma.product.count(),
        prisma.product.count({ where: { active: true } }),
        prisma.product.count({ where: { stock: 0 } }),
        prisma.product.count({ where: { stock: { lte: 10, gt: 0 } } }),
      ]);

      return {
        total,
        active,
        outOfStock,
        lowStock,
      };
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }

  // Buscar produtos similares
  static async findSimilar(productId, limit = 4) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(productId) },
      });

      if (!product) {
        return [];
      }

      // Buscar produtos com preço similar
      const priceRange = product.price * 0.2; // 20% de variação
      const similarProducts = await prisma.product.findMany({
        where: {
          id: { not: parseInt(productId) },
          active: true,
          stock: { gt: 0 },
          price: {
            gte: product.price - priceRange,
            lte: product.price + priceRange,
          },
        },
        take: limit,
      });

      return similarProducts;
    } catch (error) {
      throw new Error(`Erro ao buscar produtos similares: ${error.message}`);
    }
  }
}

module.exports = ProductModel;


