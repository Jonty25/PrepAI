require("pdf-parse");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/bullet", require("./routes/bulletRoutes"));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "PrepAI server is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});