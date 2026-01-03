const express = require('express');
const {
  checkIn,
  checkOut,
  getAttendance,
  getAllAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/checkin', protect, checkIn);
router.post('/checkout', protect, checkOut);
router.get('/all', protect, authorize('admin'), getAllAttendance);
router.get('/:employeeId', protect, getAttendance);

module.exports = router;
