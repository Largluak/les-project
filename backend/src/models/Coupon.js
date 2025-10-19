const databaseConfig = require("../config/database");

const prisma = databaseConfig.getClient();

class CouponModel {
  // Gerar código único para cupom
  async generateCode() {
    const { nanoid } = await import("nanoid");
    let code;
    let exists = true;

    while (exists) {
      code = `CUP-${nanoid(8).toUpperCase()}`;
      const existing = await prisma.coupon.findUnique({
        where: { code },
      });
      exists = !!existing;
    }

    return code;
  }

  // Criar cupom
  async create(couponData) {
    const {
      type, // "exchange" ou "promotional"
      value,
      clientId,
      orderId,
      expiresAt,
    } = couponData;

    const code = await this.generateCode();

    return await prisma.coupon.create({
      data: {
        code,
        type,
        value: parseFloat(value),
        clientId: clientId ? parseInt(clientId) : null,
        orderId: orderId ? parseInt(orderId) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
  }

  // Buscar cupom por código
  async findByCode(code) {
    const coupon = await prisma.coupon.findUnique({
      where: { code },
      include: {
        client: true,
        order: true,
      },
    });

    if (!coupon) {
      throw new Error("Cupom não encontrado");
    }

    return coupon;
  }

  // Buscar cupons do cliente
  async findByClientId(clientId, filters = {}) {
    const { type, used, expired } = filters;

    const where = {
      clientId: parseInt(clientId),
    };

    if (type) where.type = type;
    if (used !== undefined) where.used = used === "true";
    if (expired === "false") {
      where.OR = [{ expiresAt: null }, { expiresAt: { gt: new Date() } }];
    }

    return await prisma.coupon.findMany({
      where,
      include: {
        order: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Validar cupom
  async validateCoupon(code, clientId, orderAmount) {
    const coupon = await this.findByCode(code);

    // Verificar se cupom está ativo
    if (coupon.used) {
      throw new Error("Cupom já foi utilizado");
    }

    // Verificar se cupom não expirou
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new Error("Cupom expirado");
    }

    // Verificar se cupom é específico do cliente
    if (coupon.clientId && coupon.clientId !== parseInt(clientId)) {
      throw new Error("Cupom não é válido para este cliente");
    }

    // Verificar se cupom promocional não excede o valor do pedido
    if (coupon.type === "promotional" && coupon.value > orderAmount) {
      throw new Error("Valor do cupom excede o valor do pedido");
    }

    return coupon;
  }

  // Usar cupom
  async useCoupon(code, paymentId, amount) {
    const coupon = await this.findByCode(code);

    if (coupon.used) {
      throw new Error("Cupom já foi utilizado");
    }

    // Atualizar cupom como usado
    await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    // Criar relação com pagamento
    return await prisma.paymentCoupon.create({
      data: {
        paymentId: parseInt(paymentId),
        couponId: coupon.id,
        amount: parseFloat(amount),
      },
    });
  }

  // Gerar cupom de troca
  async generateExchangeCoupon(orderId, amount) {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(orderId) },
      include: { client: true },
    });

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    // Verificar se já existe cupom para este pedido
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        orderId: parseInt(orderId),
        type: "exchange",
      },
    });

    if (existingCoupon) {
      return existingCoupon;
    }

    return await this.create({
      type: "exchange",
      value: parseFloat(amount),
      clientId: order.clientId,
      orderId: parseInt(orderId),
    });
  }

  // Buscar cupons promocionais ativos
  async findActivePromotionalCoupons() {
    return await prisma.coupon.findMany({
      where: {
        type: "promotional",
        used: false,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Calcular valor máximo de cupons para um pedido
  async calculateMaxCouponValue(orderAmount, clientId) {
    // Buscar cupons de troca do cliente
    const exchangeCoupons = await prisma.coupon.findMany({
      where: {
        clientId: parseInt(clientId),
        type: "exchange",
        used: false,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    // Buscar cupons promocionais ativos
    const promotionalCoupons = await this.findActivePromotionalCoupons();

    const totalExchangeValue = exchangeCoupons.reduce(
      (sum, coupon) => sum + coupon.value,
      0
    );
    const maxPromotionalValue =
      promotionalCoupons.length > 0 ? promotionalCoupons[0].value : 0;

    // Retornar o menor valor entre: valor total dos cupons de troca + cupom promocional, ou valor do pedido
    const maxValue = Math.min(
      totalExchangeValue + maxPromotionalValue,
      orderAmount
    );

    return {
      maxValue,
      exchangeCoupons: exchangeCoupons.length,
      promotionalCoupons: promotionalCoupons.length,
    };
  }

  // Estatísticas de cupons
  async getStats() {
    const [totalCoupons, usedCoupons, expiredCoupons, activeCoupons] =
      await Promise.all([
        prisma.coupon.count(),
        prisma.coupon.count({ where: { used: true } }),
        prisma.coupon.count({
          where: {
            expiresAt: { lte: new Date() },
            used: false,
          },
        }),
        prisma.coupon.count({
          where: {
            used: false,
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
          },
        }),
      ]);

    return {
      totalCoupons,
      usedCoupons,
      expiredCoupons,
      activeCoupons,
    };
  }
}

module.exports = new CouponModel();








