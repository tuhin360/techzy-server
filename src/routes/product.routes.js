const express = require("express");
const {
  getProducts,
  getProductsByTag,
  deleteProduct,
  addProduct,
  getProductById,
  updateProductById,
  getProductsBulk,
  getProductsByCategory,
} = require("../controllers/product.controller");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyAdmin } = require("../controllers/user.controller");

const router = express.Router();

// Public routes
// Get all products
router.get("/", getProducts);

// Get product by id
router.get("/:id", getProductById);

// Get products by tag (ex: /products/filter?tag=new)
router.get("/filter", getProductsByTag);

// Admin Routes (optional - protect with JWT + Admin middleware later)
// Delete product
router.delete("/:id", deleteProduct);

// Post product
router.post("/", addProduct);

// Update product
router.patch("/:id", updateProductById);

// Get multiple products by IDs
router.post("/bulk", getProductsBulk);

// Get products by category
router.get("/category/:category", getProductsByCategory);

module.exports = router;
