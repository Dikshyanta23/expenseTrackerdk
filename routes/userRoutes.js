const express = require("express");
const {
  registerUser,
  loginUser,
  profile,
  changePassword,
  updateUser,
} = require("../controllers/userController");

const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", isAuthenticated, profile);
router.put("/change-password", isAuthenticated, changePassword);
router.put("/update-profile", isAuthenticated, updateUser);

module.exports = router;
