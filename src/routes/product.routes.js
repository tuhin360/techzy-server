const express = require("express");
const {
  getProducts,
  getProductsByTag,
  deleteProduct,
  addProduct,
  getProductById,
  updateProductById,
  getProductsBulk,
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

// Delete product
router.delete("/:id", deleteProduct);

// Post product
router.post("/", addProduct);

// // Update product
router.patch("/:id", updateProductById);

router.post("/bulk", getProductsBulk);

module.exports = router;
