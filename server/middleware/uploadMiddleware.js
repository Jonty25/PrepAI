const multer = require("multer");

// Use memory storage instead of disk storage
// This stores the file in memory as a Buffer
// Works on all hosting platforms including Render
const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;