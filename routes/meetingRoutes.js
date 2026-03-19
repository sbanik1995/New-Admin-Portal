const express = require('express');
const meetingController = require('../controllers/meetingController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireAuth, meetingController.createMeeting);
router.get('/upcoming', requireAuth, meetingController.getUpcomingMeetings);
router.get('/', requireAuth, meetingController.getAllMeetings);

module.exports = router;
