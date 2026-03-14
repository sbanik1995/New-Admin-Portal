const mongoose = require('mongoose');

const testReportSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    reportDate: { type: Date, required: true },
    description: { type: String, trim: true },
    filePath: { type: String, required: true },
    originalFileName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestReport', testReportSchema);
