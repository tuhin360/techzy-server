const express = require("express");
const {
  addToCart,
  getUserCart,
  deleteCart,
  // getUsersAllCarts,
  // updateCartStatus,  
} = require("../controllers/cart.controller");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

// Add product to cart
router.post("/", addToCart);

// Get cart items for a user → /carts?email=user@gmail.com
router.get("/", getUserCart);

// Delete cart item
router.delete("/:id", deleteCart);

// // Get all users carts (for admin/orders management)
// router.get("/orders", getUsersAllCarts);

// // Update cart item status (for order management)
// router.patch("/:id", updateCartStatus);

module.exports = router;