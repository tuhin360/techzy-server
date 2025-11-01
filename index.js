// Import required modules
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import database connection
const connectDB = require("./src/config/db");

// Import routes
const productRoutes = require("./src/routes/product.routes");
const cartRoutes = require("./src/routes/cart.routes");
const userRoutes = require("./src/routes/user.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const reviewRoutes = require("./src/routes/review.routes");
const wishListRoutes = require("./src/routes/wishlist.routes");

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(express.json());
app.use(cors());

// Root route to check if the server is running
app.get("/", (req, res) => {
  res.send("Techzy Server is running...");
});

// Connect to the database and initialize controllers
(async () => {
  const db = await connectDB();

  // Import and initialize controllers
  const productController = require("./src/controllers/product.controller");
  const cartController = require("./src/controllers/cart.controller");
  const userController = require("./src/controllers/user.controller");
  const jwtRoutes = require("./src/routes/jwt.routes");
  const paymentController = require("./src/controllers/payment.controller");
  const reviewController = require("./src/controllers/review.controller");
  const wishListController = require("./src/controllers/wishlist.controller");

  // Initialize controllers with database connection
  productController.init(db);
  cartController.init(db);
  userController.init(db);
  paymentController.init(db);
  reviewController.init(db);
  wishListController.init(db);

  // Use all routes
  app.use("/products", productRoutes);
  app.use("/carts", cartRoutes);
  app.use("/users", userRoutes);
  app.use("/jwt", jwtRoutes);
  app.use("/payments", paymentRoutes);
  app.use("/reviews", reviewRoutes);
  app.use("/wishlist", wishListRoutes);
})();

// Run only when executed locally (not in Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Techzy Server running locally on port ${PORT}`);
  });
}

// Export the app for Vercel serverless function
module.exports = app;
