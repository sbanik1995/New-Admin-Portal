const express = require('express');
const leaveController = require('../controllers/leaveController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, leaveController.applyLeave);
router.get('/', requireAuth, leaveController.getLeaves);
router.patch('/:id/status', requireAuth, leaveController.updateLeaveStatus);

module.exports = router;
