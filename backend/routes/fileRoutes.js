const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const File = require('../models/File.js');
const authMiddleware = require('../middleware/auth.js');

// Multer setup (store files in disk)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir); // create folder if not exist
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// --------------------
// Upload Excel file
// --------------------
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    // Save file metadata in MongoDB
    const fileDoc = new File({
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      userId: req.user.id,
      uploadedAt: new Date()
    });

    await fileDoc.save();

    // Parse Excel immediately for analytics
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    res.json({ msg: 'File uploaded successfully', file: fileDoc, data: sheetData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// --------------------
// Get all files of logged-in user
// --------------------
router.get('/', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user.id }).sort({ uploadedAt: -1 });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching files' });
  }
});

// --------------------
// Delete a file
// --------------------
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user.id });
    if (!file) return res.status(404).json({ msg: 'File not found' });

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path); // remove file from disk
    await file.deleteOne(); // remove metadata

    res.json({ msg: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error deleting file' });
  }
});

module.exports = router;
