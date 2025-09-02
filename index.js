const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const productRoutes = require("./routes/product.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

(async () => {
  const db = await connectDB();

  // Initialize controllers with DB
  const productController = require("./controllers/product.controller");
  productController.init(db);

  // Routes
  app.use("/products", productRoutes);

  // Test route
  app.get("/", (req, res) => {
    res.send("Techzy Server is running...");
  });

  app.listen(PORT, () => {
    console.log(`Techzy Server running on port ${PORT}`);
  });
})();
