const express = require("express");
const {
  addToCart,
  getUserCart,
  updateCartQuantity,  // Add this
  deleteCart,
} = require("../controllers/cart.controller");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

// Add product to cart
router.post("/", addToCart);

// Get cart items for a user → /carts?email=user@gmail.com
router.get("/", getUserCart);

// Update cart item quantity
router.patch("/:id", updateCartQuantity);

// Delete cart item
router.delete("/:id", deleteCart);

module.exports = router;