const express = require("express");
const CartController = require("../controllers/cart.controller");

const router = express.Router();

// Rotas específicas primeiro (sem parâmetros)
router.get("/expiring-items", CartController.getExpiringItems);
router.post("/cleanup", CartController.cleanupExpiredCarts);

// Rotas com parâmetros depois
router.get("/:clientId", CartController.getCart);
router.post("/:clientId/items", CartController.addItem);
router.put("/:clientId/items", CartController.updateItemQuantity);
router.delete("/:clientId/items/:productId", CartController.removeItem);
router.delete("/:clientId", CartController.clearCart);
router.get("/:clientId/validate", CartController.validateCart);
router.post("/:clientId/renew", CartController.renewCart);

module.exports = router;
