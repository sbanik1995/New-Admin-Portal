const TestReport = require('../models/TestReport');

exports.uploadReport = async (req, res) => {
  const { title, reportDate, description } = req.body;
  if (!req.file) {
    return res.status(400).json({ message: 'Report file is required.' });
  }

  const report = await TestReport.create({
    title,
    reportDate,
    description,
    filePath: `/uploads/reports/${req.file.filename}`,
    originalFileName: req.file.originalname,
  });

  return res.status(201).json(report);
};

exports.getReports = async (req, res) => {
  const reports = await TestReport.find().sort({ createdAt: -1 });
  res.status(200).json(reports);
};
