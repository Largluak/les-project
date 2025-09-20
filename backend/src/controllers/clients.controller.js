const {
  clientSchema,
  passwordSchema,
  addressSchema,
  cardSchema,
} = require("../utils/validator.js");
const ClientModel = require("../models/Client");
const AddressModel = require("../models/Address");
const CardModel = require("../models/Card");
const TransactionModel = require("../models/Transaction");

module.exports = {
  async createClient(req, res, next) {
    try {
      const payload = req.body;
      await clientSchema.validateAsync(payload, { abortEarly: false });

      // Validar endereços obrigatórios
      if (payload.addresses && payload.addresses.length > 0) {
        const hasBilling = payload.addresses.some((a) => a.isBilling);
        const hasDelivery = payload.addresses.some((a) => a.isDelivery);

        if (!hasBilling || !hasDelivery) {
          return res.status(400).json({
            message:
              "Quando há endereços, é obrigatório ao menos 1 de cobrança e 1 de entrega.",
          });
        }
      }

      const client = await ClientModel.create(payload);
      return res.status(201).json(client);
    } catch (err) {
      console.log("Erro de validação:", err.details || err.message);
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
      const filters = req.query;
      const result = await ClientModel.findAll(filters);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getClientById(req, res, next) {
    try {
      const id = req.params.id;
      const client = await ClientModel.findById(id);
      res.json(client);
    } catch (err) {
      if (err.message === "Cliente não encontrado") {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  },

  async updateClient(req, res, next) {
    try {
      const id = req.params.id;
      const payload = req.body;

      const updated = await ClientModel.update(id, payload);
      res.json(updated);
    } catch (err) {
      if (err.code === "P2002")
        return res
          .status(409)
          .json({ message: "CPF ou e-mail já cadastrado." });
      if (err.message === "Cliente não encontrado") {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  },

  async changePassword(req, res, next) {
    try {
      const id = req.params.id;
      const { oldPassword, newPassword, newPasswordConfirm } = req.body;

      await passwordSchema.validateAsync({
        oldPassword,
        newPassword,
        newPasswordConfirm,
      });

      const result = await ClientModel.changePassword(
        id,
        oldPassword,
        newPassword
      );
      res.json(result);
    } catch (err) {
      if (err.isJoi)
        return res
          .status(400)
          .json({ message: "Validation error", details: err.details });
      if (err.message === "Cliente não encontrado") {
        return res.status(404).json({ message: err.message });
      }
      if (err.message === "Senha atual incorreta") {
        return res.status(401).json({ message: err.message });
      }
      next(err);
    }
  },

  async inactivateClient(req, res, next) {
    try {
      const id = req.params.id;
      await ClientModel.toggleStatus(id);
      res.json({ message: "Cliente inativado" });
    } catch (err) {
      if (err.message === "Cliente não encontrado") {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  },

  async deleteClient(req, res, next) {
    try {
      const clientId = req.params.id;
      const removedData = await ClientModel.delete(clientId);

      res.json({
        message: "Cliente removido com sucesso",
        removedData,
      });
    } catch (err) {
      console.error("Erro ao remover cliente:", err);

      if (err.code === "P2025") {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }

      if (err.code === "P2003") {
        return res.status(400).json({
          message:
            "Não é possível remover este cliente pois possui dados relacionados",
        });
      }

      if (err.message === "Cliente não encontrado") {
        return res.status(404).json({ message: err.message });
      }

      next(err);
    }
  },

  async addAddress(req, res, next) {
    try {
      const clientId = req.params.id;
      const payload = req.body;
      await addressSchema.validateAsync(payload);

      const address = await AddressModel.create(clientId, payload);
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
      const addrId = req.params.addrId;
      const payload = req.body;
      await addressSchema.validateAsync(payload);

      const updated = await AddressModel.update(addrId, payload);
      res.json(updated);
    } catch (err) {
      if (err.isJoi)
        return res
          .status(400)
          .json({ message: "Validation error", details: err.details });
      if (err.message === "Endereço não encontrado") {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  },

  async addCard(req, res, next) {
    try {
      const clientId = req.params.id;
      const payload = req.body;
      await cardSchema.validateAsync(payload);

      const card = await CardModel.create(clientId, payload);
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
      const clientId = req.params.id;
      const cardId = req.params.cardId;
      const updated = await CardModel.setPreferred(clientId, cardId);
      res.json(updated);
    } catch (err) {
      if (err.message === "Cartão não encontrado") {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  },

  async updateCard(req, res, next) {
    try {
      const clientId = req.params.id;
      const cardId = req.params.cardId;
      const payload = req.body;

      await cardSchema.validateAsync(payload);

      const updated = await CardModel.update(cardId, clientId, payload);
      res.json(updated);
    } catch (err) {
      if (err.isJoi)
        return res
          .status(400)
          .json({ message: "Validation error", details: err.details });
      if (err.message === "Cartão não encontrado") {
        return res.status(404).json({ message: err.message });
      }
      next(err);
    }
  },

  async listTransactions(req, res, next) {
    try {
      const clientId = req.params.id;
      const { page = 1, limit = 20 } = req.query;
      const result = await TransactionModel.findByClientId(
        clientId,
        page,
        limit
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async getDashboardStats(req, res) {
    try {
      const stats = await ClientModel.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Erro ao buscar estatísticas do dashboard:", error);
      res.status(500).json({
        error: "Erro interno do servidor ao buscar estatísticas",
      });
    }
  },
  async toggleClientStatus(req, res) {
    try {
      const { id } = req.params;
      const updatedClient = await ClientModel.toggleStatus(id);

      res.json({
        message: `Cliente ${
          updatedClient.active ? "ativado" : "desativado"
        } com sucesso`,
        client: updatedClient,
      });
    } catch (error) {
      console.error("Erro ao alternar status do cliente:", error);

      if (error.message === "Cliente não encontrado") {
        return res.status(404).json({ error: error.message });
      }

      res.status(500).json({
        error: "Erro interno do servidor ao alternar status do cliente",
      });
    }
  },
  async updateRanking(req, res) {
    try {
      const { id } = req.params;
      const newRanking = await ClientModel.updateRanking(id);

      res.json({
        message: "Ranking atualizado com sucesso",
        clientId: id,
        newRanking: newRanking,
      });
    } catch (error) {
      console.error("Erro ao atualizar ranking do cliente:", error);

      if (error.message === "Cliente não encontrado") {
        return res.status(404).json({ error: error.message });
      }

      res.status(500).json({
        error: "Erro interno do servidor ao atualizar ranking",
      });
    }
  },
  async removeAddress(req, res) {
    try {
      const { id, addrId } = req.params;
      await AddressModel.delete(addrId, id);
      res.json({ message: "Endereço removido com sucesso" });
    } catch (error) {
      console.error("Erro ao remover endereço:", error);
      if (error.message === "Endereço não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
  async removeCard(req, res) {
    try {
      const { id, cardId } = req.params;
      await CardModel.delete(cardId, id);
      res.json({ message: "Cartão removido com sucesso" });
    } catch (error) {
      console.error("Erro ao remover cartão:", error);
      if (error.message === "Cartão não encontrado") {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
