const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  generateQuestions,
  getQuestions,
  reviewInterviewAnswer,
} = require("../controllers/interviewController");

router.get("/:resumeId", protect, getQuestions);
router.post("/:resumeId/generate", protect, generateQuestions);
router.post("/review/answer", protect, reviewInterviewAnswer);

module.exports = router;