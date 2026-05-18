const express = require("express");
const {
  createUser,
  getAllUsers,
  deleteUser,
  updateUserRole,
  verifyAdmin,
} = require("../controllers/user.controller");
const verifyJWT = require("../middlewares/verifyJWT");
const verifyAdminMiddleware = require("../middlewares/verifyAdmin").verifyAdmin;

const router = express.Router();

// create user
router.post("/", createUser);

// get all users
router.get("/", verifyJWT, verifyAdminMiddleware, getAllUsers);

// delete user
router.delete("/:id", verifyJWT, verifyAdminMiddleware, deleteUser);

// update user role
router.patch("/role/:id", verifyJWT, verifyAdminMiddleware, updateUserRole);

router.get("/admin/:email", verifyJWT, verifyAdmin);

module.exports = router;
