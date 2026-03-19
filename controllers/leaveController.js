const Leave = require('../models/Leave');

exports.applyLeave = async (req, res) => {
  const leave = await Leave.create(req.body);
  res.status(201).json(leave);
};

exports.getLeaves = async (req, res) => {
  const leaves = await Leave.find().sort({ createdAt: -1 });
  res.status(200).json(leaves);
};

exports.updateLeaveStatus = async (req, res) => {
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  if (!leave) {
    return res.status(404).json({ message: 'Leave request not found.' });
  }

  return res.status(200).json(leave);
};
