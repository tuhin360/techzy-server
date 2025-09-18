// routes/payment.routes.js
const express = require("express");
const router = express.Router();
const { 
  payment, 
  savePayment, 
  getAllPaymentsByEmail,
  getAllPayments,
  updatePaymentStatus,
  deletePayment 
} = require("../controllers/payment.controller");
const verifyJWT = require("../middlewares/verifyJWT");

// create payment intent
router.post("/create-payment-intent", payment);

// save payment info to DB
router.post("/", savePayment);

// get all payments by email
router.get("/user/:email", verifyJWT, getAllPaymentsByEmail);

// get all payments (for admin - manage orders)
router.get("/", verifyJWT, getAllPayments);

// update payment status
router.put("/:id", verifyJWT, updatePaymentStatus);

// delete payment
router.delete("/:id", verifyJWT, deletePayment);

module.exports = router;
