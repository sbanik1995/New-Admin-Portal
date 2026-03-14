const express = require('express');
const multer = require('multer');
const bugController = require('../controllers/bugController');
const { requireAuth } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: 'uploads/bugs',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post('/', requireAuth, upload.single('screenshot'), bugController.createBug);
router.get('/', requireAuth, bugController.getBugs);
router.patch('/:id/status', requireAuth, bugController.updateBugStatus);

module.exports = router;
