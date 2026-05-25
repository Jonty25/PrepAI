const Resume = require("../models/Resume");
const { generateInterviewQuestions, reviewAnswer } = require("../utils/gemini");

// Generate Interview Questions
const generateQuestions = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (!resume.extractedText) {
      return res.status(400).json({ message: "No text found in resume" });
    }

    const questions = await generateInterviewQuestions(resume.extractedText);

    resume.interviewQuestions = questions;
    resume.status = "interview_ready";
    await resume.save();

    res.json({
      message: "Interview questions generated successfully",
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Interview Questions
const getQuestions = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.resumeId,
      user: req.user._id,
    }).select("interviewQuestions fileName");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({
      questions: resume.interviewQuestions,
      fileName: resume.fileName,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Review Answer
const reviewInterviewAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const review = await reviewAnswer(question, answer);

    res.json({
      message: "Answer reviewed successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQuestions, getQuestions, reviewInterviewAnswer };