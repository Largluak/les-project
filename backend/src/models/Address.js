const databaseConfig = require("../config/database");

const prisma = databaseConfig.getClient();

class AddressModel {
  // Criar endereço
  async create(clientId, addressData) {
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

  // Buscar endereços por cliente
  async findByClientId(clientId) {
    return await prisma.address.findMany({
      where: { clientId: parseInt(clientId) },
      orderBy: { createdAt: "desc" },
    });
  }

  // Buscar endereço por ID
  async findById(id) {
    const address = await prisma.address.findUnique({
      where: { id: parseInt(id) },
      include: { client: true },
    });

    if (!address) {
      throw new Error("Endereço não encontrado");
    }

    return address;
  }

  // Atualizar endereço
  async update(id, addressData) {
    return await prisma.address.update({
      where: { id: parseInt(id) },
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

  // Deletar endereço
  async delete(id, clientId) {
    return await prisma.address.delete({
      where: {
        id: parseInt(id),
        clientId: parseInt(clientId),
      },
    });
  }

  // Verificar se cliente tem endereços obrigatórios
  async validateRequiredAddresses(clientId) {
    const addresses = await this.findByClientId(clientId);

    const hasBilling = addresses.some((a) => a.isBilling);
    const hasDelivery = addresses.some((a) => a.isDelivery);

    return { hasBilling, hasDelivery };
  }
}

module.exports = new AddressModel();
