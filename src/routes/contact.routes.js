const express = require("express");
const {
  addContactMessage,
  getContactMessages,
} = require("../controllers/contact.controller");
const verifyJWT = require("../middlewares/verifyJWT");
const { verifyAdmin } = require("../middlewares/verifyAdmin");

const router = express.Router();

// Create contact message (public)
router.post("/", addContactMessage);

// Get all contact messages (admin only)
router.get("/", verifyJWT, verifyAdmin, getContactMessages);

module.exports = router;
