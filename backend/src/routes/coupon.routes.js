const express = require("express");
const CouponController = require("../controllers/coupon.controller");

const router = express.Router();

// Rotas de cupons
router.post("/promotional", CouponController.createPromotional);
router.get("/code/:code", CouponController.findByCode);
router.get("/client/:clientId", CouponController.findByClientId);
router.get("/validate/:code", CouponController.validateCoupon);
router.get("/max-value/:clientId", CouponController.calculateMaxCouponValue);
router.get("/promotional/active", CouponController.findActivePromotional);
router.get("/stats/overview", CouponController.getStats);

module.exports = router;






