const express = require("express");
const {
  createUser,
  getAllUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/user.controller");
const verifyJWT = require("../middlewares/verifyJWT");

const router = express.Router();

// create user
router.post("/", createUser);

// get all users
router.get("/", verifyJWT, getAllUsers);

router.delete("/:id", deleteUser);

router.patch("/admin/:id", updateUserRole);

module.exports = router;
