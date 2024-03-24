const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/authMiddleware");
const uploadPhoto = require("../middleware/imageMiddleware");
const {
  createTransaction,
  getTransactions,
} = require("../controllers/transactionController");

// Routes
router.post(
  "/:jobId",
  authentication,
  uploadPhoto("bukti").single("bukti"),
  createTransaction
);
router.get("/", authentication, getTransactions);

module.exports = router;
