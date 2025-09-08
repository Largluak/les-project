const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients.controller");

// Dashboard
router.get("/dashboard/stats", clientsController.getDashboardStats);

// CRUD principal
router.post("/", clientsController.createClient);
router.get("/", clientsController.listClients);
router.get("/:id", clientsController.getClientById);
router.put("/:id", clientsController.updateClient);
router.delete("/:id", clientsController.deleteClient);
router.patch("/:id/password", clientsController.changePassword);
router.patch("/:id/toggle-status", clientsController.toggleClientStatus);
router.patch("/:id/update-ranking", clientsController.updateRanking);

// Endereços
router.post("/:id/addresses", clientsController.addAddress);
router.put("/:id/addresses/:addrId", clientsController.updateAddress);
router.delete("/:id/addresses/:addrId", clientsController.removeAddress);

// Cartões
router.post("/:id/cards", clientsController.addCard);
router.put("/:id/cards/:cardId", clientsController.updateCard);
router.patch("/:id/cards/:cardId/prefer", clientsController.setPreferredCard);
router.delete("/:id/cards/:cardId", clientsController.removeCard);

// Transações
router.get("/:id/transactions", clientsController.listTransactions);

module.exports = router;
