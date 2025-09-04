const express = require("express");

const {  createUser, getAllUsers, deleteUser, updateUserRole } = require("../controllers/user.controller");

const router = express.Router();

// create user
router.post("/", createUser);

// get all users
router.get("/", getAllUsers);

router.delete("/:id", deleteUser);

router.patch("/admin/:id", updateUserRole);

module.exports = router;
