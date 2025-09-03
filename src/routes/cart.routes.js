const express = require("express");
const { addToCart, getUserCart } = require("../controllers/cart.controller");

const router = express.Router();

// Add product to cart
router.post("/", addToCart);



module.exports = router;
