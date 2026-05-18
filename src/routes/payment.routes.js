// routes/payment.routes.js
const express = require("express");
const router = express.Router();
const { 
  payment, 
  savePayment, 
  getAllPaymentsByEmail,
  getAllPayments,
  updatePaymentStatus,
  deletePayment,
  initiateSSLPayment,
  handleSSLSuccess,
  handleSSLFail,
  handleSSLCancel
} = require("../controllers/payment.controller");
const verifyJWT = require("../middlewares/verifyJWT");

// create Stripe payment intent
router.post("/create-payment-intent", payment);

// save Stripe payment info to DB
router.post("/", savePayment);

// SSLCommerz payment endpoints
router.post("/ssl-initiate", initiateSSLPayment);
router.post("/ssl-success/:tranId", handleSSLSuccess);
router.post("/ssl-fail/:tranId", handleSSLFail);
router.post("/ssl-cancel/:tranId", handleSSLCancel);

// get all payments by email
router.get("/user/:email", verifyJWT, getAllPaymentsByEmail);

// get all payments (for admin - manage orders)
router.get("/", verifyJWT, getAllPayments);

// update payment status
router.put("/:id", verifyJWT, updatePaymentStatus);

// delete payment
router.delete("/:id", verifyJWT, deletePayment);

module.exports = router;
