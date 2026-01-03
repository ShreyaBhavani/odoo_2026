const TimeOff = require('../models/TimeOff');
const Attendance = require('../models/Attendance');

const toDateString = (d) => {
  const dt = new Date(d);
  return dt.toISOString().split('T')[0];
};

// Create a time off request (employee)
exports.createRequest = async (req, res) => {
  try {
    const { startDate, endDate, type, reason, attachment } = req.body;
    const employeeId = req.user.employeeId || req.user._id;
    const employeeName = req.user.employeeId?.name || req.user.loginId;

    const timeoff = await TimeOff.create({
      employeeId,
      employeeName,
      startDate,
      endDate,
      type,
      reason,
      attachment,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, data: timeoff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all requests (admin / hr)
exports.getAll = async (req, res) => {
  try {
    const requests = await TimeOff.find().sort({ createdAt: -1 }).populate('employeeId', 'name email');
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my requests (employee)
exports.getMine = async (req, res) => {
  try {
    const empId = req.user.employeeId || req.user._id;
    const requests = await TimeOff.find({ employeeId: empId }).sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve request (admin)
exports.approve = async (req, res) => {
  try {
    const reqId = req.params.id;
    const timeoff = await TimeOff.findById(reqId);
    if (!timeoff) return res.status(404).json({ message: 'TimeOff request not found' });

    if (timeoff.status === 'approved') return res.status(400).json({ message: 'Already approved' });

    timeoff.status = 'approved';
    await timeoff.save();

    // For each date in range, create or update attendance with status 'on-leave'
    const start = new Date(timeoff.startDate);
    const end = new Date(timeoff.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = toDateString(d);
      try {
        await Attendance.findOneAndUpdate(
          { employeeId: timeoff.employeeId, date: dateStr },
          {
            employeeId: timeoff.employeeId,
            checkIn: new Date(dateStr + 'T00:00:00.000Z'),
            checkOut: new Date(dateStr + 'T00:00:00.000Z'),
            date: dateStr,
            totalHours: 0,
            status: 'on-leave'
          },
          { upsert: true, new: true }
        );
      } catch (e) {
        // ignore unique constraint errors
      }
    }

    res.json({ success: true, data: timeoff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject request (admin)
exports.reject = async (req, res) => {
  try {
    const reqId = req.params.id;
    const timeoff = await TimeOff.findById(reqId);
    if (!timeoff) return res.status(404).json({ message: 'TimeOff request not found' });

    timeoff.status = 'rejected';
    await timeoff.save();

    res.json({ success: true, data: timeoff });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
