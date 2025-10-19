const CouponModel = require("../models/Coupon");

class CouponController {
  // Criar cupom promocional (admin)
  async createPromotional(req, res) {
    try {
      const { value, expiresAt } = req.body;

      if (!value || value <= 0) {
        return res.status(400).json({
          success: false,
          message: "Valor deve ser maior que zero",
        });
      }

      const coupon = await CouponModel.create({
        type: "promotional",
        value: parseFloat(value),
        expiresAt,
      });

      res.status(201).json({
        success: true,
        message: "Cupom promocional criado com sucesso",
        data: { coupon },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar cupom por código
  async findByCode(req, res) {
    try {
      const { code } = req.params;

      const coupon = await CouponModel.findByCode(code);

      res.json({
        success: true,
        data: { coupon },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Buscar cupons do cliente
  async findByClientId(req, res) {
    try {
      const { clientId } = req.params;
      const { type, used, expired } = req.query;

      const coupons = await CouponModel.findByClientId(clientId, {
        type,
        used,
        expired,
      });

      res.json({
        success: true,
        data: { coupons },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Validar cupom
  async validateCoupon(req, res) {
    try {
      const { code } = req.params;
      const { clientId, orderAmount } = req.query;

      if (!clientId || !orderAmount) {
        return res.status(400).json({
          success: false,
          message: "ID do cliente e valor do pedido são obrigatórios",
        });
      }

      const coupon = await CouponModel.validateCoupon(
        code,
        clientId,
        parseFloat(orderAmount)
      );

      res.json({
        success: true,
        message: "Cupom válido",
        data: {
          coupon,
          discountValue: coupon.value,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Calcular valor máximo de cupons para um pedido
  async calculateMaxCouponValue(req, res) {
    try {
      const { clientId } = req.params;
      const { orderAmount } = req.query;

      if (!orderAmount) {
        return res.status(400).json({
          success: false,
          message: "Valor do pedido é obrigatório",
        });
      }

      const result = await CouponModel.calculateMaxCouponValue(
        parseFloat(orderAmount),
        clientId
      );

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

  // Buscar cupons promocionais ativos
  async findActivePromotional(req, res) {
    try {
      const coupons = await CouponModel.findActivePromotionalCoupons();

      res.json({
        success: true,
        data: { coupons },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Estatísticas de cupons
  async getStats(req, res) {
    try {
      const stats = await CouponModel.getStats();

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

module.exports = new CouponController();
