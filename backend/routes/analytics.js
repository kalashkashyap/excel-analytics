import express from "express";
import XLSX from "xlsx";
import path from "path";
import authMiddleware from "../middleware/auth.js";
import File from "../models/File.js";

const router = express.Router();

// Download Excel with original data + summary stats
router.get("/download/:fileId", authMiddleware, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.fileId, userId: req.user.id });
    if (!file) return res.status(404).json({ msg: "File not found" });

    // Read original Excel
    const workbook = XLSX.readFile(path.resolve(file.path));
    const sheetName = workbook.SheetNames[0];
    const originalData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Generate summary stats
    const numericKeys = Object.keys(originalData[0] || {}).filter(
      key => typeof originalData[0][key] === "number"
    );

    const statsData = numericKeys.map(key => {
      const values = originalData.map(row => row[key]);
      return {
        Column: key,
        Sum: values.reduce((a, b) => a + b, 0),
        Avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
        Min: Math.min(...values),
        Max: Math.max(...values),
      };
    });

    // Create new workbook
    const newWorkbook = XLSX.utils.book_new();

    // Sheet 1: Original data
    const sheet1 = XLSX.utils.json_to_sheet(originalData);
    XLSX.utils.book_append_sheet(newWorkbook, sheet1, "Original Data");

    // Sheet 2: Summary statistics
    const sheet2 = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(newWorkbook, sheet2, "Summary Stats");

    // Generate buffer and send as download
    const buffer = XLSX.write(newWorkbook, { type: "buffer", bookType: "xlsx" });
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Excel_Analytics_${file.filename}`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error generating download" });
  }
});

export default router;
