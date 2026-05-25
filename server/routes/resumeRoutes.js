const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadResume,
  getResumes,
  getResume,
  deleteResume,
  analyzeResume,
  matchJob,
} = require("../controllers/resumeController");

router.get("/", protect, getResumes);
router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/:id", protect, getResume);
router.delete("/:id", protect, deleteResume);
router.post("/:id/analyze", protect, analyzeResume);
router.post("/:id/match", protect, matchJob);
module.exports = router;