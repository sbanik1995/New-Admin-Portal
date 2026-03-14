const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, attendanceController.markAttendance);
router.get('/', requireAuth, attendanceController.getMonthlyAttendance);

module.exports = router;
