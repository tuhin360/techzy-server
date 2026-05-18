const express = require("express");
const router = express.Router();
const { 
  subscribeNewsletter,
  getAllSubscribers,
  deleteSubscriber 
} = require("../controllers/newsletter.controller");

const verifyJWT = require("../middlewares/verifyJWT");
const { verifyAdmin } = require("../middlewares/verifyAdmin");

// Public subscription endpoint
router.post("/subscribe", subscribeNewsletter);

// Protected admin endpoints
router.get("/subscribers", verifyJWT, verifyAdmin, getAllSubscribers);
router.delete("/subscribers/:id", verifyJWT, verifyAdmin, deleteSubscriber);

module.exports = router;
