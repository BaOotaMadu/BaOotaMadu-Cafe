const express = require("express");
const {
  getUser,
  updateUser,
  resetPassword,
  deleteUser,
  login,
  signup,
  logout,
} = require("../controller/authController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);
router.post("/register", signup); // public
router.get("/me", auth, getUser); // protected
router.put("/update", auth, updateUser); // protected
router.post("/reset-password", resetPassword); // public
router.delete("/:id", auth, deleteUser); // admin or user only
router.get("/logout", auth,  logout); // protected 

module.exports = router;
