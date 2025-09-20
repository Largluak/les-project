require("dotenv").config();
const appConfig = require("./config/app");
const databaseConfig = require("./config/database");
const RoutesConfig = require("./config/routes");
const errorHandler = require("./middlewares/errorHandler");

class Server {
  constructor() {
    this.app = appConfig.getApp();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupRoutes() {
    new RoutesConfig(this.app);
  }

  setupErrorHandling() {
    this.app.use(errorHandler);
  }

  async start() {
    try {
      // Connect to database
      await databaseConfig.connect();

      // Start server
      const PORT = process.env.PORT || 4000;
      this.app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      process.exit(1);
    }
  }

  async stop() {
    try {
      await databaseConfig.disconnect();
      console.log("🛑 Server stopped gracefully");
    } catch (error) {
      console.error("❌ Error stopping server:", error);
    }
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT, shutting down gracefully...");
  await databaseConfig.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  await databaseConfig.disconnect();
  process.exit(0);
});

// Start server
const server = new Server();
server.start();
