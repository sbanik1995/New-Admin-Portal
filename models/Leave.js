const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema(
  {
    leaveType: {
      type: String,
      enum: ['Sick', 'Casual', 'Personal'],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', leaveSchema);
