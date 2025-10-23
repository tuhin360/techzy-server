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
  searchProducts,
} = require("../controllers/product.controller");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyAdmin } = require("../controllers/user.controller");

const router = express.Router();

// ============================================
// ⚠️ CRITICAL: SPECIFIC ROUTES MUST COME FIRST
// ============================================

// 1. Search products - MUST be before /:id
// GET /products/search?query=phone
router.get("/search", searchProducts);

// 2. Filter by tag - MUST be before /:id
// GET /products/filter?tag=new
router.get("/filter", getProductsByTag);

// 3. Get products by category - MUST be before /:id
// GET /products/category/Audio
router.get("/category/:category", getProductsByCategory);

// 4. Get all products
// GET /products
router.get("/", getProducts);

// 5. Bulk operations (POST - won't conflict with GET)
// POST /products/bulk
router.post("/bulk", getProductsBulk);

// 6. Add new product (POST - won't conflict with GET)
// POST /products
router.post("/", addProduct);

// ============================================
// ⚠️ DYNAMIC :id ROUTES MUST COME LAST
// ============================================

// 7. Get product by id - MUST be after all specific routes
// GET /products/123abc
router.get("/:id", getProductById);

// 8. Update product by id
// PATCH /products/123abc
router.patch("/:id", updateProductById);

// 9. Delete product by id
// DELETE /products/123abc
router.delete("/:id", deleteProduct);

module.exports = router;