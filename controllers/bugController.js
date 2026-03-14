const Bug = require('../models/Bug');

exports.createBug = async (req, res) => {
  const payload = {
    ...req.body,
    screenshotPath: req.file ? `/uploads/bugs/${req.file.filename}` : undefined,
    screenshotOriginalName: req.file ? req.file.originalname : undefined,
  };

  const bug = await Bug.create(payload);
  res.status(201).json(bug);
};

exports.getBugs = async (req, res) => {
  const bugs = await Bug.find().sort({ createdAt: -1 });
  res.status(200).json(bugs);
};

exports.updateBugStatus = async (req, res) => {
  const bug = await Bug.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found.' });
  }
  return res.status(200).json(bug);
};
