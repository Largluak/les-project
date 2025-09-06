const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

class ClientsService {
  // Criar cliente
  async createClient(clientData) {
    const { password, addresses = [], cards = [], ...otherData } = clientData;

    // Validar endereços obrigatórios
    const hasBilling = addresses.some((a) => a.isBilling);
    const hasDelivery = addresses.some((a) => a.isDelivery);

    if (!hasBilling || !hasDelivery) {
      throw new Error(
        "É obrigatório ao menos 1 endereço de cobrança e 1 de entrega."
      );
    }

    // Hash da senha e geração do código
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const clientCode = `C-${nanoid(8)}`;

    // Calcular ranking inicial baseado nos dados
    const ranking = this.calculateInitialRanking(otherData);

    return await prisma.client.create({
      data: {
        ...otherData,
        clientCode,
        passwordHash,
        ranking,
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

  // Listar clientes com filtros
  async listClients(filters = {}) {
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
        orderBy: { ranking: "desc" },
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
  async getClientById(id) {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: {
        addresses: true,
        cards: true,
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10, // Últimas 10 transações
        },
      },
    });

    if (!client) {
      throw new Error("Cliente não encontrado");
    }

    return client;
  }

  // Atualizar cliente
  async updateClient(id, updateData) {
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

  // Inativar/ativar cliente
  async toggleClientStatus(id) {
    const client = await this.getClientById(id);

    return await prisma.client.update({
      where: { id: parseInt(id) },
      data: { active: !client.active },
    });
  }

  // Adicionar endereço
  async addAddress(clientId, addressData) {
    return await prisma.address.create({
      data: {
        clientId: parseInt(clientId),
        name:
          addressData.name ||
          `${addressData.residenceType} - ${addressData.street}`,
        residenceType: addressData.residenceType,
        streetType: addressData.streetType,
        street: addressData.street,
        number: addressData.number,
        district: addressData.district,
        cep: addressData.cep,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        observations: addressData.observations,
        isBilling: !!addressData.isBilling,
        isDelivery: !!addressData.isDelivery,
      },
    });
  }

  // Atualizar endereço
  async updateAddress(addressId, addressData) {
    return await prisma.address.update({
      where: { id: parseInt(addressId) },
      data: {
        name: addressData.name,
        residenceType: addressData.residenceType,
        streetType: addressData.streetType,
        street: addressData.street,
        number: addressData.number,
        district: addressData.district,
        cep: addressData.cep,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country,
        observations: addressData.observations,
        isBilling: !!addressData.isBilling,
        isDelivery: !!addressData.isDelivery,
      },
    });
  }

  // Remover endereço
  async removeAddress(addressId) {
    return await prisma.address.delete({
      where: { id: parseInt(addressId) },
    });
  }

  // Adicionar cartão
  async addCard(clientId, cardData) {
    // Se é preferencial, remove preferência dos outros
    if (cardData.isPreferred) {
      await prisma.card.updateMany({
        where: { clientId: parseInt(clientId) },
        data: { isPreferred: false },
      });
    }

    return await prisma.card.create({
      data: {
        clientId: parseInt(clientId),
        cardNumber: cardData.cardNumber,
        cardName: cardData.cardName,
        brand: cardData.brand,
        securityCode: cardData.securityCode,
        isPreferred: !!cardData.isPreferred,
      },
    });
  }

  // Definir cartão preferencial
  async setPreferredCard(clientId, cardId) {
    await prisma.card.updateMany({
      where: { clientId: parseInt(clientId) },
      data: { isPreferred: false },
    });

    return await prisma.card.update({
      where: { id: parseInt(cardId) },
      data: { isPreferred: true },
    });
  }

  // Remover cartão
  async removeCard(cardId) {
    return await prisma.card.delete({
      where: { id: parseInt(cardId) },
    });
  }

  // Buscar transações do cliente
  async getClientTransactions(clientId, page = 1, limit = 20) {
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

  // Calcular ranking inicial (pode ser melhorado com mais lógica)
  calculateInitialRanking(clientData) {
    let ranking = 0;

    // Pontuação baseada em dados completos
    if (clientData.name) ranking += 10;
    if (clientData.email) ranking += 10;
    if (clientData.cpf) ranking += 10;

    // Pode adicionar mais lógica aqui baseada no perfil
    return Math.min(ranking, 100);
  }

  // Atualizar ranking baseado em compras (chamado após transações)
  async updateRanking(clientId) {
    const transactions = await prisma.transaction.findMany({
      where: {
        clientId: parseInt(clientId),
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
      where: { id: parseInt(clientId) },
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
      where: { id: parseInt(clientId) },
      data: { ranking },
    });

    return ranking;
  }

  // Estatísticas do dashboard
  async getDashboardStats() {
    const [totalClients, activeClients, inactiveClients, topClient] =
      await Promise.all([
        prisma.client.count(),
        prisma.client.count({ where: { active: true } }),
        prisma.client.count({ where: { active: false } }),
        prisma.client.findFirst({
          orderBy: { ranking: "desc" },
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

module.exports = new ClientsService();
