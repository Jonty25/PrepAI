const Resume = require("../models/Resume");

const getDashboardStats = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).select(
      "fileName status atsAnalysis createdAt"
    );

    const totalResumes = resumes.length;

    const analyzedResumes = resumes.filter(
      (r) => r.atsAnalysis?.score !== null && r.atsAnalysis?.score !== undefined
    );

    const avgScore =
      analyzedResumes.length > 0
        ? Math.round(
            analyzedResumes.reduce((sum, r) => sum + r.atsAnalysis.score, 0) /
              analyzedResumes.length
          )
        : 0;

    const bestScore =
      analyzedResumes.length > 0
        ? Math.max(...analyzedResumes.map((r) => r.atsAnalysis.score))
        : 0;

    const totalInterviewSets = resumes.filter(
      (r) => r.status === "interview_ready"
    ).length;

    const recentResumes = resumes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((r) => ({
        _id: r._id,
        fileName: r.fileName,
        status: r.status,
        score: r.atsAnalysis?.score ?? null,
        createdAt: r.createdAt,
      }));

    res.json({
      totalResumes,
      totalAnalyzed: analyzedResumes.length,
      avgScore,
      bestScore,
      totalInterviewSets,
      recentResumes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };