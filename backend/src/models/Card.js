const databaseConfig = require("../config/database");

const prisma = databaseConfig.getClient();

class CardModel {
  // Criar cartão
  async create(clientId, cardData) {
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

  // Buscar cartões por cliente
  async findByClientId(clientId) {
    return await prisma.card.findMany({
      where: { clientId: parseInt(clientId) },
      orderBy: [{ isPreferred: "desc" }, { createdAt: "desc" }],
    });
  }

  // Buscar cartão por ID
  async findById(id) {
    const card = await prisma.card.findUnique({
      where: { id: parseInt(id) },
      include: { client: true },
    });

    if (!card) {
      throw new Error("Cartão não encontrado");
    }

    return card;
  }

  // Atualizar cartão
  async update(id, clientId, cardData) {
    // Se está definindo como preferencial, remove preferência dos outros
    if (cardData.isPreferred) {
      await prisma.card.updateMany({
        where: { clientId: parseInt(clientId) },
        data: { isPreferred: false },
      });
    }

    return await prisma.card.update({
      where: { id: parseInt(id) },
      data: {
        cardNumber: cardData.cardNumber,
        cardName: cardData.cardName,
        brand: cardData.brand,
        securityCode: cardData.securityCode,
        isPreferred: !!cardData.isPreferred,
      },
    });
  }

  // Definir cartão preferencial
  async setPreferred(clientId, cardId) {
    // Remove preferência de todos os cartões do cliente
    await prisma.card.updateMany({
      where: { clientId: parseInt(clientId) },
      data: { isPreferred: false },
    });

    // Define o cartão especificado como preferencial
    return await prisma.card.update({
      where: { id: parseInt(cardId) },
      data: { isPreferred: true },
    });
  }

  // Deletar cartão
  async delete(id, clientId) {
    return await prisma.card.delete({
      where: {
        id: parseInt(id),
        clientId: parseInt(clientId),
      },
    });
  }

  // Buscar cartão preferencial do cliente
  async findPreferredByClientId(clientId) {
    return await prisma.card.findFirst({
      where: {
        clientId: parseInt(clientId),
        isPreferred: true,
      },
    });
  }
}

module.exports = new CardModel();
