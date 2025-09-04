const express = require("express");

const {  createUser, getAllUsers } = require("../controllers/user.controller");

const router = express.Router();

// create user
router.post("/", createUser);

// get all users
router.get("/", getAllUsers);

module.exports = router;
