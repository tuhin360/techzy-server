const express = require("express");
const {
  getProducts,
  getProductsByTag,
} = require("../controllers/product.controller");

const router = express.Router();


// Get all products
router.get("/", getProducts);

// Get products by tag (ex: /products/filter?tag=new)
router.get("/filter", getProductsByTag);


 
module.exports = router;
