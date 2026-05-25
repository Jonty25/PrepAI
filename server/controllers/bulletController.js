const { rewriteBulletPoint } = require("../utils/gemini");

const rewriteBullet = async (req, res) => {
  try {
    const { bulletPoint, jobRole } = req.body;

    if (!bulletPoint) {
      return res.status(400).json({ message: "Bullet point is required" });
    }

    if (!jobRole) {
      return res.status(400).json({ message: "Job role is required" });
    }

    const result = await rewriteBulletPoint(bulletPoint, jobRole);

    res.json({
      message: "Bullet point rewritten successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { rewriteBullet };