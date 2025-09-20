const bcrypt = require("bcrypt");
const databaseConfig = require("../config/database");

const prisma = databaseConfig.getClient();
const SALT_ROUNDS = 10;

class ClientModel {
  // Criar cliente
  async create(clientData) {
    const {
      password,
      passwordConfirm, // Remover este campo - não existe no banco
      addresses = [],
      cards = [],
      phone,
      ...otherData
    } = clientData;

    // Hash da senha e geração do código
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const { nanoid } = await import("nanoid");
    const clientCode = `C-${nanoid(8)}`;

    // Mapear campos do telefone
    const phoneData = {
      phoneType: phone?.type || "mobile",
      phoneDDD: phone?.ddd || "",
      phoneNumber: phone?.number || "",
    };

    return await prisma.client.create({
      data: {
        ...otherData,
        ...phoneData,
        clientCode,
        passwordHash,
        birthDate: new Date(otherData.birthDate),
        addresses: {
          create: addresses.map((a) => ({
            name: a.name || `${a.residenceType} - ${a.street}`,
            residenceType: a.residenceType,
            streetType: a.streetType,
            street: a.street,
            number: a.number,
            district: a.district,
            cep: a.cep,
            city: a.city,
            state: a.state,
            country: a.country,
            observations: a.observations,
            isBilling: !!a.isBilling,
            isDelivery: !!a.isDelivery,
          })),
        },
        cards: {
          create: cards.map((c) => ({
            cardNumber: c.cardNumber,
            cardName: c.cardName,
            brand: c.brand,
            securityCode: c.securityCode,
            isPreferred: !!c.isPreferred,
          })),
        },
      },
      include: { addresses: true, cards: true },
    });
  }

  // Buscar todos os clientes com filtros
  async findAll(filters = {}) {
    const {
      name,
      cpf,
      email,
      clientCode,
      active,
      page = 1,
      limit = 50,
    } = filters;

    const where = {};
    if (name) where.name = { contains: name, mode: "insensitive" };
    if (cpf) where.cpf = cpf;
    if (email) where.email = { contains: email, mode: "insensitive" };
    if (clientCode) where.clientCode = clientCode;
    if (active !== undefined) where.active = active === "true";

    const skip = (page - 1) * limit;

    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        include: { addresses: true, cards: true },
        skip,
        take: parseInt(limit),
        orderBy: { ranking: "asc" }, // ✅ Menor número = melhor ranking (asc)
      }),
      prisma.client.count({ where }),
    ]);

    return {
      clients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Buscar cliente por ID
  async findById(id) {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        addresses: true,
        cards: true,
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    return client;
  }

  // Atualizar cliente
  async update(id, updateData) {
    const { phone, birthDate, ...otherData } = updateData;

    const data = {
      ...otherData,
      phoneType: phone?.type,
      phoneDDD: phone?.ddd,
      phoneNumber: phone?.number,
      birthDate: birthDate ? new Date(birthDate) : undefined,
    };

    // Remover campos undefined
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) delete data[key];
    });

    return await prisma.client.update({
      where: { id: parseInt(id) },
      data,
      include: { addresses: true, cards: true },
    });
  }

  // Deletar cliente
  async delete(id) {
    const clientId = parseInt(id);

    // Buscar cliente com dados relacionados
    const cliente = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        addresses: true,
        cards: true,
        transactions: true,
      },
    });

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    // Remover em cascata usando transação
    await prisma.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: { clientId },
      });

      await tx.card.deleteMany({
        where: { clientId },
      });

      await tx.address.deleteMany({
        where: { clientId },
      });

      await tx.client.delete({
        where: { id: clientId },
      });
    });

    return {
      cliente: cliente.name,
      enderecos: cliente.addresses.length,
      cartoes: cliente.cards.length,
      transacoes: cliente.transactions.length,
    };
  }

  // Alterar senha
  async changePassword(id, oldPassword, newPassword) {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });

    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    const isValidPassword = await bcrypt.compare(
      oldPassword,
      client.passwordHash
    );
    if (!isValidPassword) {
      throw new Error("Senha atual incorreta");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.client.update({
      where: { id: parseInt(id) },
      data: { passwordHash: newPasswordHash },
    });

    return { message: "Senha alterada com sucesso" };
  }

  // Alternar status do cliente
  async toggleStatus(id) {
    const client = await this.findById(id);

    return await prisma.client.update({
      where: { id: parseInt(id) },
      data: { active: !client.active },
    });
  }

  // Atualizar ranking
  async updateRanking(id) {
    const transactions = await prisma.transaction.findMany({
      where: {
        clientId: parseInt(id),
        status: "APPROVED",
      },
    });

    let ranking = 0;
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = transactions.length;

    // Lógica de ranking baseada em compras
    if (totalSpent > 10000) ranking += 50;
    else if (totalSpent > 5000) ranking += 30;
    else if (totalSpent > 1000) ranking += 20;
    else if (totalSpent > 500) ranking += 10;

    if (transactionCount > 50) ranking += 30;
    else if (transactionCount > 20) ranking += 20;
    else if (transactionCount > 10) ranking += 10;
    else if (transactionCount > 5) ranking += 5;

    // Cliente ativo há muito tempo
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
    });

    if (client) {
      const monthsActive = Math.floor(
        (new Date() - client.createdAt) / (1000 * 60 * 60 * 24 * 30)
      );
      if (monthsActive > 12) ranking += 20;
      else if (monthsActive > 6) ranking += 10;
    }

    ranking = Math.min(ranking, 100);

    await prisma.client.update({
      where: { id: parseInt(id) },
      data: { ranking },
    });

    return ranking;
  }

  // Estatísticas do dashboard
  async getStats() {
    const [totalClients, activeClients, inactiveClients, topClient] =
      await Promise.all([
        prisma.client.count(),
        prisma.client.count({ where: { active: true } }),
        prisma.client.count({ where: { active: false } }),
        prisma.client.findFirst({
          where: { active: true }, // ✅ Filtrar apenas clientes ativos
          orderBy: { ranking: "asc" }, // ✅ Menor número = melhor ranking (asc)
          select: { name: true, ranking: true },
        }),
      ]);

    return {
      totalClients,
      activeClients,
      inactiveClients,
      topClient: topClient
        ? `${topClient.name} (${topClient.ranking})`
        : "Nenhum",
    };
  }
}

module.exports = new ClientModel();
