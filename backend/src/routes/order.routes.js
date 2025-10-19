const express = require("express");
const OrderController = require("../controllers/order.controller");

const router = express.Router();

// Rotas de pedidos
router.post("/:clientId/create-from-cart", OrderController.createFromCart);
router.post("/:orderId/payment", OrderController.processPayment);
router.get("/:orderId", OrderController.getOrderById);
router.get("/number/:orderNumber", OrderController.getOrderByNumber);
router.get("/client/:clientId", OrderController.getClientOrders);
router.get("/", OrderController.getAllOrders);
router.put("/:orderId/status", OrderController.updateOrderStatus);

// Rotas de troca
router.post("/:orderId/exchange", OrderController.requestExchange);
router.put(
  "/exchange/:exchangeId/authorize",
  OrderController.authorizeExchange
);
router.put(
  "/exchange/:exchangeId/confirm",
  OrderController.confirmExchangeReceipt
);
router.get("/exchanges", OrderController.getExchangeRequests);

// Estatísticas
router.get("/stats/overview", OrderController.getOrderStats);

module.exports = router;








