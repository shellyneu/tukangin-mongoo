const express = require("express");
const router = express.Router();
const { authentication } = require("../middleware/authMiddleware");
const uploadPhoto = require("../middleware/imageMiddleware");
const {
  createPostJob,
  getPostJobs,
  getPostJobById,
  updatePostJob,
  deletePostJob,
  getPostJobsByCategory,
} = require("../controllers/postJobController");

// Routes
router.post(
  "/",
  authentication,
  uploadPhoto("photo").single("photo"),
  createPostJob
);
router.get("/", authentication, getPostJobs);
router.get("/:id", authentication, getPostJobById);
router.put("/:id", authentication, updatePostJob);
router.delete("/:id", authentication, deletePostJob);
router.get("/category/:category", authentication, getPostJobsByCategory);

module.exports = router;
