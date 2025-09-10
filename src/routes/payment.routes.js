const express = require("express");
const router = express.Router();
const { payment, savePayment } = require("../controllers/payment.controller");

// create payment intent
router.post("/create-payment-intent", payment);

// save payment info to DB
router.post("/", savePayment);

module.exports = router;
