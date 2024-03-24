const express = require("express");
const router = express.Router();
const multer = require("multer");
const { validateTukangAccount } = require("../controllers/tukangController");
const { authentication } = require("../middleware/authMiddleware");
const uploadPhoto = require("../middleware/imageMiddleware");

router.post(
  "/validate-account",
  authentication,
  uploadPhoto("ktp").single("ktp"),
  validateTukangAccount
);

module.exports = router;
