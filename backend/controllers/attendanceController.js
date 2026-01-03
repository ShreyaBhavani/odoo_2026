const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Check in
// @route   POST /api/attendance/checkin
// @access  Private
exports.checkIn = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    const existing = await Attendance.findOne({ employeeId, date: today });
    if (existing && existing.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = await Attendance.create({
      employeeId,
      checkIn: new Date(),
      date: today,
      status: 'present'
    });

    // Update employee status
    await Employee.findByIdAndUpdate(employeeId, { 
      isPresent: true,
      status: 'present'
    });

    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check out
// @route   POST /api/attendance/checkout
// @access  Private
exports.checkOut = async (req, res) => {
  try {
    const { employeeId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({ employeeId, date: today });
    if (!attendance) {
      return res.status(404).json({ message: 'No check-in record found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out' });
    }

    const checkOutTime = new Date();
    const totalHours = (checkOutTime - attendance.checkIn) / (1000 * 60 * 60);

    attendance.checkOut = checkOutTime;
    attendance.totalHours = parseFloat(totalHours.toFixed(2));
    await attendance.save();

    // Update employee status
    await Employee.findByIdAndUpdate(employeeId, { 
      isPresent: false,
      status: 'absent'
    });

    res.json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance records
// @route   GET /api/attendance/:employeeId
// @access  Private
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ 
      employeeId: req.params.employeeId 
    }).sort({ date: -1 }).limit(30);
    
    res.json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance (admin)
// @route   GET /api/attendance
// @access  Private/Admin
exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('employeeId', 'name email')
      .sort({ date: -1 })
      .limit(100);
    
    res.json({ success: true, count: attendance.length, data: attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
