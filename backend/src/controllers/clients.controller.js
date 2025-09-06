const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { nanoid } = require("nanoid");
const {
  clientSchema,
  passwordSchema,
  addressSchema,
  cardSchema,
} = require("../utils/validators");

const SALT_ROUNDS = 10;

module.exports = {
  async createClient(req, res, next) {
    try {
      const payload = req.body;
      await clientSchema.validateAsync(payload, { abortEarly: false });

      const hasBilling = (payload.addresses || []).some((a) => a.isBilling);
      const hasDelivery = (payload.addresses || []).some((a) => a.isDelivery);
      if (!hasBilling || !hasDelivery) {
        return res
          .status(400)
          .json({
            message:
              "É obrigatório ao menos 1 endereço de cobrança e 1 de entrega.",
          });
      }

      const passwordHash = await bcrypt.hash(payload.password, SALT_ROUNDS);
      const clientCode = `C-${nanoid(8)}`;

      const client = await prisma.client.create({
        data: {
          clientCode,
          gender: payload.gender,
          name: payload.name,
          birthDate: new Date(payload.birthDate),
          cpf: payload.cpf,
          email: payload.email,
          phoneType: payload.phone.type,
          phoneDDD: payload.phone.ddd,
          phoneNumber: payload.phone.number,
          passwordHash,
          ranking: payload.ranking ?? 0,
          addresses: {
            create: (payload.addresses || []).map((a) => ({
              name: a.name,
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
            create: (payload.cards || []).map((c) => ({
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

      return res.status(201).json(client);
    } catch (err) {
      if (err.code === "P2002") {
        return res
          .status(409)
          .json({ message: "CPF ou e-mail já cadastrado." });
      }
      if (err.isJoi)
        return res
          .status(400)
          .json({ message: "Validation error", details: err.details });
      next(err);
    }
  },

  async listClients(req, res, next) {
    try {
      const { name, cpf, email, clientCode, active } = req.query;
      const where = {};
      if (name) where.name = { contains: name, mode: "insensitive" };
      if (cpf) where.cpf = cpf;
      if (email) where.email = email;
      if (clientCode) where.clientCode = clientCode;
      if (active !== undefined) where.active = active === "true";

      const clients = await prisma.client.findMany({
        where,
        include: { addresses: true, cards: true },
      });
      res.json(clients);
    } catch (err) {
      next(err);
    }
  },

  async getClientById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const client = await prisma.client.findUnique({
        where: { id },
        include: { addresses: true, cards: true, transactions: true },
      });
      if (!client)
        return res.status(404).json({ message: "Cliente não encontrado" });
      res.json(client);
    } catch (err) {
      next(err);
    }
  },

  async updateClient(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const payload = req.body;

      // Basic allowed updates — avoid password here
      const data = {
        gender: payload.gender,
        name: payload.name,
        birthDate: payload.birthDate ? new Date(payload.birthDate) : undefined,
        cpf: payload.cpf,
        email: payload.email,
        phoneType: payload.phone?.type,
        phoneDDD: payload.phone?.ddd,
        phoneNumber: payload.phone?.number,
        ranking: payload.ranking,
      };

      const updated = await prisma.client.update({
        where: { id },
        data,
      });

      res.json(updated);
    } catch (err) {
      if (err.code === "P2002")
        return res
          .status(409)
          .json({ message: "CPF ou e-mail já cadastrado." });
      next(err);
    }
  },

  async changePassword(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      const { oldPassword, newPassword, newPasswordConfirm } = req.body;
      await passwordSchema.validateAsync({
        oldPassword,
        newPassword,
        newPasswordConfirm,
      });

      const client = await prisma.client.findUnique({ where: { id } });
      if (!client)
        return res.status(404).json({ message: "Cliente não encontrado" });

      const match = await bcrypt.compare(oldPassword, client.passwordHash);
      if (!match)
        return res.status(401).json({ message: "Senha atual incorreta" });

      const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
      await prisma.client.update({
        where: { id },
        data: { passwordHash: newHash },
      });
      res.json({ message: "Senha alterada com sucesso" });
    } catch (err) {
      if (err.isJoi)
        return res
          .status(400)
          .json({ message: "Validation error", details: err.details });
      next(err);
    }
  },

  async inactivateClient(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      await prisma.client.update({ where: { id }, data: { active: false } });
      res.json({ message: "Cliente inativado" });
    } catch (err) {
      next(err);
    }
  },

  async addAddress(req, res, next) {
    try {
      const clientId = parseInt(req.params.id);
      const payload = req.body;
      await addressSchema.validateAsync(payload);

      const address = await prisma.address.create({
        data: {
          clientId,
          name: payload.name,
          residenceType: payload.residenceType,
          streetType: payload.streetType,
          street: payload.street,
          number: payload.number,
          district: payload.district,
          cep: payload.cep,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          observations: payload.observations,
          isBilling: !!payload.isBilling,
          isDelivery: !!payload.isDelivery,
        },
      });

      res.status(201).json(address);
    } catch (err) {
      if (err.isJoi)
        return res
          .status(400)
          .json({ message: "Validation error", details: err.details });
      next(err);
    }
  },

  async updateAddress(req, res, next) {
    try {
      const addrId = parseInt(req.params.addrId);
      const payload = req.body;
      await addressSchema.validateAsync(payload);

      const updated = await prisma.address.update({
        where: { id: addrId },
        data: {
          name: payload.name,
          residenceType: payload.residenceType,
          streetType: payload.streetType,
          street: payload.street,
          number: payload.number,
          district: payload.district,
          cep: payload.cep,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          observations: payload.observations,
          isBilling: !!payload.isBilling,
          isDelivery: !!payload.isDelivery,
        },
      });

      res.json(updated);
    } catch (err) {
      if (err.isJoi)
        return res
          .status(400)
          .json({ message: "Validation error", details: err.details });
      next(err);
    }
  },

  async addCard(req, res, next) {
    try {
      const clientId = parseInt(req.params.id);
      const payload = req.body;
      await cardSchema.validateAsync(payload);

      if (payload.isPreferred) {
        await prisma.card.updateMany({
          where: { clientId },
          data: { isPreferred: false },
        });
      }

      const card = await prisma.card.create({
        data: {
          clientId,
          cardNumber: payload.cardNumber,
          cardName: payload.cardName,
          brand: payload.brand,
          securityCode: payload.securityCode,
          isPreferred: !!payload.isPreferred,
        },
      });

      res.status(201).json(card);
    } catch (err) {
      if (err.isJoi)
        return res
          .status(400)
          .json({ message: "Validation error", details: err.details });
      next(err);
    }
  },

  async setPreferredCard(req, res, next) {
    try {
      const clientId = parseInt(req.params.id);
      const cardId = parseInt(req.params.cardId);
      await prisma.card.updateMany({
        where: { clientId },
        data: { isPreferred: false },
      });
      const updated = await prisma.card.update({
        where: { id: cardId },
        data: { isPreferred: true },
      });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async listTransactions(req, res, next) {
    try {
      const clientId = parseInt(req.params.id);
      const transactions = await prisma.transaction.findMany({
        where: { clientId },
      });
      res.json(transactions);
    } catch (err) {
      next(err);
    }
  },
};
