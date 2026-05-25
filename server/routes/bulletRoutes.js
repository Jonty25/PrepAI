const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { rewriteBullet } = require("../controllers/bulletController");

router.post("/rewrite", protect, rewriteBullet);

module.exports = router;