const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Present', 'Absent'],
      required: true,
    },
    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
