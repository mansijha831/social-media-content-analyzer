// server/routes/uploadRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");

// Storage config: file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });
// POST /api/upload
router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileBuffer = req.file.buffer;

  // Check if PDF
  if (req.file.mimetype === "application/pdf") {
    try {
      const data = await pdfParse(fileBuffer);
      const text = data.text;

      // Analysis
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const charCount = text.length;
      const hashtagCount = (text.match(/#/g) || []).length;

      let suggestions = [];

      if (wordCount < 20) {
        suggestions.push("Post is too short. Try adding more details.");
      }

      if (hashtagCount < 3) {
        suggestions.push("Add more hashtags to increase reach.");
      }

      if (!/like|comment|share|follow/i.test(text)) {
        suggestions.push(
          "Add a call-to-action like 'Like, Comment, Share or Follow'.",
        );
      }

      if (!/😊|🔥|🚀|💡|❤️/.test(text)) {
        suggestions.push(
          "Consider adding emojis to make the post more engaging.",
        );
      }

      return res.json({
        message: "PDF uploaded successfully!",
        text: text,
        analysis: {
          wordCount,
          charCount,
          hashtagCount,
          suggestions,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error parsing PDF" });
    }
  }

  // ✅ Check if Image
  if (req.file.mimetype.startsWith("image/")) {
    try {
      const result = await Tesseract.recognize(fileBuffer, "eng");

      return res.json({
        message: "Image processed successfully!",
        text: result.data.text,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Error processing image" });
    }
  }

  // ❌ If unsupported file type
  return res.status(400).json({ message: "Unsupported file type" });
});

module.exports = router;
