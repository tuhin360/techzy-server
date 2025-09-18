const express = require("express");
const {
  addReviews,
  getReviews,
} = require("../controllers/review.controller");

const router = express.Router();

// create review
router.post("/", addReviews);

// get all reviews
router.get("/", getReviews);

module.exports = router;
