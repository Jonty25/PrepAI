const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      default: "",
    },
    atsAnalysis: {
      score: { type: Number, default: null },
      summary: { type: String, default: "" },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestions: [{ type: String }],
      keywords: [{ type: String }],
    },
    interviewQuestions: [
      {
        category: { type: String },
        question: { type: String },
        difficulty: { type: String },
        tip: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["uploaded", "analyzed", "interview_ready"],
      default: "uploaded",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);