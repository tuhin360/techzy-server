const express = require("express");
const { generateToken, verifyToken } = require("../controllers/jwt.controller");

const router = express.Router();

// generate jwt
router.post("/", generateToken);

// verify jwt (optional if you want endpoint testing)
router.post("/verify", verifyToken);

module.exports = router;
