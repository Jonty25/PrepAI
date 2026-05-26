const Resume = require("../models/Resume");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { analyzeResumeATS, matchJobDescription } = require("../utils/gemini");

// Upload Resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // With memoryStorage, file is in req.file.buffer
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length < 10) {
      return res.status(400).json({
        message: "Could not extract text from PDF",
      });
    }

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: req.file.originalname, // store filename only
      extractedText,
      status: "uploaded",
    });

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume: {
        _id: resume._id,
        fileName: resume.fileName,
        status: resume.status,
        createdAt: resume.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Resumes
const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select("-extractedText")
      .sort({ createdAt: -1 });

    res.json({ resumes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Resume
const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.json({ resume });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    await resume.deleteOne();

    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analyze Resume with Gemini AI
const analyzeResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (!resume.extractedText) {
      return res.status(400).json({ message: "No text found in resume" });
    }

    const analysis = await analyzeResumeATS(resume.extractedText);

    resume.atsAnalysis = analysis;
    resume.status = "analyzed";
    await resume.save();

    res.json({
      message: "Resume analyzed successfully",
      atsAnalysis: resume.atsAnalysis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Match Resume with Job Description
const matchJob = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (!resume.extractedText) {
      return res.status(400).json({ message: "No text found in resume" });
    }

    const matchResult = await matchJobDescription(
      resume.extractedText,
      jobDescription
    );

    res.json({
      message: "Job match analysis complete",
      matchResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { uploadResume, getResumes, getResume, deleteResume, analyzeResume, matchJob };