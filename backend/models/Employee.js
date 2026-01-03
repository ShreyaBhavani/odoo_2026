const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  mobile: String,
  company: String,
  department: String,
  manager: String,
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  about: String,
  skills: [String],
  interests: [String],
  resume: {
    dateOfJoining: Date,
    empCode: String,
    panNo: String,
    uanNo: String,
    maritalStatus: String
  },
  privateInfo: {
    mobile: String,
    workMobile: String,
    email: String,
    ipfsCode: String
  },
  isPresent: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'on-leave'],
    default: 'absent'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
