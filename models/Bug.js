const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
      default: 'Open',
    },
    screenshotPath: { type: String },
    screenshotOriginalName: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bug', bugSchema);
