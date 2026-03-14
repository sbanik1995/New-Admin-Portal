const express = require('express');
const multer = require('multer');
const projectDocumentController = require('../controllers/projectDocumentController');
const { requireAuth } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: 'uploads/documents',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', requireAuth, upload.single('file'), projectDocumentController.uploadDocument);
router.get('/', requireAuth, projectDocumentController.getDocuments);

module.exports = router;
