const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: Date,
  date: {
    type: String,
    required: true
  },
  totalHours: Number,
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'on-leave'],
    default: 'present'
  }
}, {
  timestamps: true
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
