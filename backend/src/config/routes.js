const express = require("express");
const clientsRoutes = require("../routes/clients.routes");

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


