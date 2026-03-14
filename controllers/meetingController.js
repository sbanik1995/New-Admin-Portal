const Meeting = require('../models/Meeting');

exports.createMeeting = async (req, res) => {
  const meeting = await Meeting.create(req.body);
  res.status(201).json(meeting);
};

exports.getUpcomingMeetings = async (req, res) => {
  const meetings = await Meeting.find({ date: { $gte: new Date() } }).sort({ date: 1 });
  res.status(200).json(meetings);
};

exports.getAllMeetings = async (req, res) => {
  const meetings = await Meeting.find().sort({ date: 1 });
  res.status(200).json(meetings);
};
