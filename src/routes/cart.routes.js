const express = require("express");
const {
  addToCart,
  getUserCart,
  deleteCart,
} = require("../controllers/cart.controller");

const router = express.Router();

// Add product to cart
router.post("/", addToCart);

// Get cart items for a user → /carts?email=user@gmail.com
router.get("/", getUserCart);

// Delete cart item
router.delete("/:id", deleteCart);

module.exports = router;
