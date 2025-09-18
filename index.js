const express = require("express");
const cors = require("cors");
require("dotenv").config();


const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/product.routes");
const cartRoutes = require("./src/routes/cart.routes");
const userRoutes = require("./src/routes/user.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const reviewRoutes = require("./src/routes/review.routes");

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
  const userController = require("./src/controllers/user.controller");
  const jwtRoutes = require("./src/routes/jwt.routes");
  const paymentController = require("./src/controllers/payment.controller");
  const reviewController = require("./src/controllers/review.controller")

  productController.init(db);
  cartController.init(db);
  userController.init(db);
  paymentController.init(db);
  reviewController.init(db);

  // Routes
  app.use("/products", productRoutes);
  app.use("/carts", cartRoutes);
  app.use("/users", userRoutes);
  app.use("/jwt", jwtRoutes);
  app.use("/payments", paymentRoutes);
  app.use("/reviews", reviewRoutes)

  // Test route
  app.get("/", (req, res) => {
    res.send("Techzy Server is running...");
  });

  app.listen(PORT, () => {
    console.log(`Techzy Server running on port ${PORT}`);
  });
})();
