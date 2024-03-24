const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  registerUser,
  loginUser,
  getUser,
  validateAccount,
} = require("../controllers/userController");
const { authentication } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", authentication, getUser);

router.put("/validate-account", authentication, validateAccount);

module.exports = router;
