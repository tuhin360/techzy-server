const express = require("express");
const router = express.Router();
const {
  validateCoupon,
  getAllCoupons,
  createCoupon,
  deleteCoupon,
} = require("../controllers/coupon.controller");

// public validate coupon route (used in checkout)
router.post("/validate", validateCoupon);

// admin/user routes for listing, creating, and deleting coupons
router.get("/", getAllCoupons);
router.post("/", createCoupon);
router.delete("/:id", deleteCoupon);

module.exports = router;
