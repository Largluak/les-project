require("dotenv").config();
const express = require("express");
const cors = require("cors");
const clientsRoutes = require("./routes/clients.routes");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors());

app.use(express.json());

// rotas
app.use("/api/clients", clientsRoutes);

// health
app.get("/health", (req, res) => res.json({ status: "ok" }));

// middleware de erro
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
