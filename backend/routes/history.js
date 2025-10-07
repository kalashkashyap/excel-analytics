const express = require("express");
const router = express.Router();
const AnalysisHistory = require("../models/AnalysisHistory");

// Save analysis
router.post("/", async (req, res) => {
  try {
    const { userId, fileName, data, stats } = req.body;
    const newRecord = new AnalysisHistory({ userId, fileName, data, stats });
    await newRecord.save();
    res.status(201).json({ message: "Analysis saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get history for a user
router.get("/:userId", async (req, res) => {
  try {
    const history = await AnalysisHistory.find({ userId: req.params.userId }).sort({ uploadedAt: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
