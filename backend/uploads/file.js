const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');

// Configure multer
const storage = multer.memoryStorage(); // store file in memory
const upload = multer({ storage });

// Upload and parse Excel
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  // Read Excel data
  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  res.json({ data: sheetData });
});

module.exports = router;
