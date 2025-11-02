const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./src/config/db");

const productRoutes = require("./src/routes/product.routes");
const cartRoutes = require("./src/routes/cart.routes");
const userRoutes = require("./src/routes/user.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const reviewRoutes = require("./src/routes/review.routes");
const wishListRoutes = require("./src/routes/wishlist.routes");
const jwtRoutes = require("./src/routes/jwt.routes");

const app = express();
app.use(express.json());

// ✅ CORS
app.use(cors({
  origin: [
    "https://techzy-client.vercel.app",
    "https://techzy-8ef5b.web.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));

// ✅ Root route
app.get("/", (req, res) => {
  res.send("✅ Techzy Server is running!");
});

// ✅ Routes registration
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/jwt", jwtRoutes);
app.use("/payments", paymentRoutes);
app.use("/reviews", reviewRoutes);
app.use("/wishlist", wishListRoutes);

// ✅ Initialize controllers with DB
(async () => {
  try {
    const db = await connectDB();
    require("./src/controllers/product.controller").init(db);
    require("./src/controllers/cart.controller").init(db);
    require("./src/controllers/user.controller").init(db);
    require("./src/controllers/payment.controller").init(db);
    require("./src/controllers/review.controller").init(db);
    require("./src/controllers/wishlist.controller").init(db);
    console.log("✅ Controllers initialized with DB");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }
})();

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found!" });
});

// ✅ Local dev
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;