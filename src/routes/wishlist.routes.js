const express = require("express");
const {
  getWishList,
  addToWishList,
  removeFromWishList,
} = require("../controllers/wishlist.controller");

const router = express.Router();

router.get("/:email", getWishList);     // GET wishlist by email
router.post("/", addToWishList);        // Add to wishlist
router.delete("/", removeFromWishList); // Remove from wishlist

module.exports = router;
