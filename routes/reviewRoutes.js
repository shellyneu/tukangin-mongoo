const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/authMiddleware");
const {
  createReview,
  getAllReviews,
  getReviewById,
} = require("../controllers/reviewController");

router.post("/:jobId", authentication, createReview);
router.get("/", getAllReviews);
router.get("/:id", getReviewById);

module.exports = router;
