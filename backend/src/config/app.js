const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

class AppConfig {
  constructor() {
    this.app = express();
    this.setupMiddleware();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());

    // CORS configuration - Permitir múltiplas origens para desenvolvimento
    const allowedOrigins = [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://localhost:60160",
      "http://127.0.0.1:60160",
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      process.env.FRONTEND_URL,
    ].filter(Boolean); // Remove valores undefined/null

    this.app.use(
      cors({
        origin: function (origin, callback) {
          // Permitir requisições sem origin (ex: mobile apps, Postman)
          if (!origin) return callback(null, true);

          // Verificar se a origin está na lista de permitidas
          if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
          } else {
            // Em desenvolvimento, permitir qualquer origin localhost/127.0.0.1
            if (
              process.env.NODE_ENV === "development" &&
              (origin.includes("localhost") || origin.includes("127.0.0.1"))
            ) {
              callback(null, true);
            } else {
              callback(new Error("Não permitido pelo CORS"));
            }
          }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      })
    );

    // Logging middleware
    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    }

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  getApp() {
    return this.app;
  }
}

module.exports = new AppConfig();
