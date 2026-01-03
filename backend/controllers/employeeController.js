const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create employee + user (by Admin/HR)
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      company,
      department,
      manager,
      avatar,
      about,
      skills,
      status,
      isPresent,
      role,
      joiningYear
    } = req.body;

    const employee = await Employee.create({
      name,
      email,
      mobile,
      company,
      department,
      manager,
      avatar,
      about,
      skills,
      status,
      isPresent
    });

    // Create a linked User with generated loginId and random password
    const { generateLoginId } = require('../utils/idGenerator');
    const loginId = await generateLoginId(name, joiningYear || new Date().getFullYear());

    // generate a temporary random password (8 chars)
    const crypto = require('crypto');
    const plainPassword = crypto.randomBytes(4).toString('hex');

    const User = require('../models/User');
    const user = await User.create({
      loginId,
      email,
      password: plainPassword,
      role: role || 'employee',
      employeeId: employee._id
    });

    await Employee.findByIdAndUpdate(employee._id, { userId: user._id });

    res.status(201).json({ success: true, data: { employee, user: { loginId: user.loginId, password: plainPassword } } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
exports.updateEmployee = async (req, res) => {
  try {
    // Only allow certain fields for non-admin users
    const user = req.user; // set by protect middleware
    let updatePayload = {};
    if (user && user.role === 'admin') {
      updatePayload = req.body;
    } else {
      // allow limited editable fields for employees themselves
      const allowed = ['mobile', 'company', 'department', 'manager', 'about', 'avatar', 'skills', 'privateInfo', 'resume'];
      allowed.forEach((key) => {
        if (req.body[key] !== undefined) updatePayload[key] = req.body[key];
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
