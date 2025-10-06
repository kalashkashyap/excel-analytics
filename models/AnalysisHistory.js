const mongoose = require("mongoose");

const analysisHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileName: String,
  data: Array,        // Raw JSON data from Excel
  stats: Object,      // Summary statistics
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AnalysisHistory", analysisHistorySchema);
