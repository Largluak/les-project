const express = require("express");
const clientsRoutes = require("../routes/clients.routes");
const cartRoutes = require("../routes/cart.routes");
const orderRoutes = require("../routes/order.routes");
const productRoutes = require("../routes/product.routes");
const couponRoutes = require("../routes/coupon.routes");

class RoutesConfig {
  constructor(app) {
    this.app = app;
    this.setupRoutes();
  }

  setupRoutes() {
    // Health check
    this.app.get("/health", (req, res) =>
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
      })
    );

    // API routes
    this.app.use("/api/clients", clientsRoutes);
    this.app.use("/api/cart", cartRoutes);
    this.app.use("/api/orders", orderRoutes);
    this.app.use("/api/products", productRoutes);
    this.app.use("/api/coupons", couponRoutes);

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        error: "Route not found",
        path: req.originalUrl,
        method: req.method,
      });
    });
  }
}

module.exports = RoutesConfig;
