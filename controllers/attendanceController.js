const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
  const { status } = req.body;
  const attendance = await Attendance.create({ status, markedAt: new Date() });
  res.status(201).json(attendance);
};

exports.getMonthlyAttendance = async (req, res) => {
  const month = Number(req.query.month) || new Date().getMonth() + 1;
  const year = Number(req.query.year) || new Date().getFullYear();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const data = await Attendance.find({
    markedAt: { $gte: startDate, $lt: endDate },
  }).sort({ markedAt: -1 });

  res.status(200).json(data);
};
