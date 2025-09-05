const express = require("express");
const {
  getProducts,
  getProductsByTag,
  deleteProduct,
} = require("../controllers/product.controller");

const router = express.Router();

// Public routes
// Get all products
router.get("/", getProducts);

// Get products by tag (ex: /products/filter?tag=new)
router.get("/filter", getProductsByTag);

// Delete product
router.delete("/:id", deleteProduct);

// // Update product
// router.patch("/:id", updateProduct);



module.exports = router;
