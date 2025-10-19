const ProductModel = require("../models/Product");

class ProductController {
  // Criar produto
  async create(req, res) {
    try {
      const { name, description, price, stock, active = true } = req.body;

      if (!name || !price) {
        return res.status(400).json({
          success: false,
          message: "Nome e preço são obrigatórios",
        });
      }

      const product = await ProductModel.create({
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        active,
      });

      res.status(201).json({
        success: true,
        message: "Produto criado com sucesso",
        data: { product },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar todos os produtos
  async findAll(req, res) {
    try {
      const {
        name,
        active,
        minPrice,
        maxPrice,
        inStock,
        page = 1,
        limit = 50,
      } = req.query;

      const result = await ProductModel.findAll({
        name,
        active,
        minPrice,
        maxPrice,
        inStock,
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

  // Buscar produto por ID
  async findById(req, res) {
    try {
      const { productId } = req.params;

      const product = await ProductModel.findById(productId);

      res.json({
        success: true,
        data: { product },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Atualizar produto
  async update(req, res) {
    try {
      const { productId } = req.params;
      const updateData = req.body;

      const product = await ProductModel.update(productId, updateData);

      res.json({
        success: true,
        message: "Produto atualizado com sucesso",
        data: { product },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Deletar produto (soft delete)
  async delete(req, res) {
    try {
      const { productId } = req.params;

      const product = await ProductModel.delete(productId);

      res.json({
        success: true,
        message: "Produto desativado com sucesso",
        data: { product },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Atualizar estoque
  async updateStock(req, res) {
    try {
      const { productId } = req.params;
      const { quantity, operation = "add" } = req.body;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantidade deve ser maior que zero",
        });
      }

      const product = await ProductModel.updateStock(
        productId,
        quantity,
        operation
      );

      res.json({
        success: true,
        message: "Estoque atualizado com sucesso",
        data: { product },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Verificar disponibilidade
  async checkAvailability(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.query;

      if (!quantity) {
        return res.status(400).json({
          success: false,
          message: "Quantidade é obrigatória",
        });
      }

      const isAvailable = await ProductModel.checkAvailability(
        productId,
        quantity
      );

      res.json({
        success: true,
        data: { isAvailable },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar produtos com estoque baixo
  async findLowStock(req, res) {
    try {
      const { threshold = 10 } = req.query;

      const products = await ProductModel.findLowStock(parseInt(threshold));

      res.json({
        success: true,
        data: { products },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Estatísticas de produtos
  async getStats(req, res) {
    try {
      const stats = await ProductModel.getStats();

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
}

module.exports = new ProductController();








