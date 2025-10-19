const express = require("express");
const ProductController = require("../controllers/product.controller");

const router = express.Router();

// Rotas de produtos
router.post("/", ProductController.create);
router.get("/", ProductController.findAll);
router.get("/:productId", ProductController.findById);
router.put("/:productId", ProductController.update);
router.delete("/:productId", ProductController.delete);
router.put("/:productId/stock", ProductController.updateStock);
router.get("/:productId/availability", ProductController.checkAvailability);
router.get("/low-stock", ProductController.findLowStock);
router.get("/stats/overview", ProductController.getStats);

module.exports = router;






