const User = require('../models/User');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { loginId, email, password, role, employeeName } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { loginId }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create employee if registering as employee
    let employeeId = null;
    if (role === 'employee' && employeeName) {
      const employee = await Employee.create({
        name: employeeName,
        email: email
      });
      employeeId = employee._id;
    }

    // Create user
    const user = await User.create({
      loginId,
      email,
      password,
      role: role || 'employee',
      employeeId
    });

    // Update employee with user reference if exists
    if (employeeId) {
      await Employee.findByIdAndUpdate(employeeId, { userId: user._id });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        loginId: user.loginId,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    // Check for user
    const user = await User.findOne({ loginId }).populate('employeeId');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        loginId: user.loginId,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
        employee: user.employeeId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('employeeId').select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
