const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/product.routes");
const cartRoutes = require("./src/routes/cart.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

(async () => {
  const db = await connectDB();

  // Initialize controllers with DB
  const productController = require("./src/controllers/product.controller");
  const cartController = require("./src/controllers/cart.controller");

  productController.init(db);
  cartController.init(db);

  // Routes
  app.use("/products", productRoutes);
  app.use("/carts", cartRoutes);

  // Test route
  app.get("/", (req, res) => {
    res.send("Techzy Server is running...");
  });

  app.listen(PORT, () => {
    console.log(`Techzy Server running on port ${PORT}`);
  });
})();
