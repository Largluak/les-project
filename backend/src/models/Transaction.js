const databaseConfig = require("../config/database");

const prisma = databaseConfig.getClient();

class TransactionModel {
  // Criar transação
  async create(clientId, transactionData) {
    return await prisma.transaction.create({
      data: {
        clientId: parseInt(clientId),
        amount: transactionData.amount,
        status: transactionData.status || "PENDING",
      },
    });
  }

  // Buscar transações por cliente
  async findByClientId(clientId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { clientId: parseInt(clientId) },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.transaction.count({
        where: { clientId: parseInt(clientId) },
      }),
    ]);

    return {
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar transação por ID
  async findById(id) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: { client: true },
    });

    if (!transaction) {
      throw new Error("Transação não encontrada");
    }

    return transaction;
  }

  // Atualizar status da transação
  async updateStatus(id, status) {
    return await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: { status },
    });
  }

  // Buscar estatísticas de transações por cliente
  async getClientStats(clientId) {
    const transactions = await prisma.transaction.findMany({
      where: { clientId: parseInt(clientId) },
    });

    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    const approvedTransactions = transactions.filter(
      (t) => t.status === "APPROVED"
    );
    const totalApprovedAmount = approvedTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );

    return {
      totalTransactions: transactions.length,
      totalAmount,
      approvedTransactions: approvedTransactions.length,
      totalApprovedAmount,
      averageTransactionValue:
        transactions.length > 0 ? totalAmount / transactions.length : 0,
    };
  }

  // Buscar todas as transações com filtros
  async findAll(filters = {}) {
    const {
      clientId,
      status,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = filters;

    const where = {};
    if (clientId) where.clientId = parseInt(clientId);
    if (status) where.status = status;
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount.gte = parseFloat(minAmount);
      if (maxAmount) where.amount.lte = parseFloat(maxAmount);
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: { client: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

    return {
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = new TransactionModel();
