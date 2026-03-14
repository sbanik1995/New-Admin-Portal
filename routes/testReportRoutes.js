const express = require('express');
const multer = require('multer');
const path = require('path');
const testReportController = require('../controllers/testReportController');
const { requireAuth } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: 'uploads/reports',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

const router = express.Router();

router.post('/', requireAuth, upload.single('file'), testReportController.uploadReport);
router.get('/', requireAuth, testReportController.getReports);

module.exports = router;
