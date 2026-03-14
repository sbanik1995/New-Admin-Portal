const Task = require('../models/Task');
const Attendance = require('../models/Attendance');
const Bug = require('../models/Bug');
const Meeting = require('../models/Meeting');

// Aggregates key dashboard numbers for overview cards.
exports.getOverview = async (req, res) => {
  const now = new Date();

  const [totalTasks, latestAttendance, pendingBugs, upcomingMeetings] = await Promise.all([
    Task.countDocuments(),
    Attendance.findOne().sort({ markedAt: -1 }),
    Bug.countDocuments({ status: { $in: ['Open', 'In Progress'] } }),
    Meeting.countDocuments({ date: { $gte: now } }),
  ]);

  res.status(200).json({
    totalTasks,
    attendanceStatus: latestAttendance ? latestAttendance.status : 'Not marked',
    pendingBugs,
    upcomingMeetings,
  });
};
