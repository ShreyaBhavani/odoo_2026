const User = require('../models/User');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const expiresIn = process.env.JWT_EXPIRE || '7d';
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { loginId, email, password, role, employeeName, adminCode } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { loginId }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Only allow HR or Admin to register via public signup.
    // Employees must be created by HR/Admin internally — no self-signup.
    if (!role || role === 'employee') {
      return res.status(403).json({ message: 'Employee self-signup is not allowed. Please contact HR or Admin.' });
    }

    // Validate role: allow 'hr' or 'admin'
    let assignedRole = null;
    if (role === 'hr') {
      assignedRole = 'hr';
    } else if (role === 'admin') {
      const adminSignupCode = process.env.ADMIN_SIGNUP_CODE;
      if (!adminSignupCode) {
        return res.status(403).json({ message: 'Admin signup is disabled on this server' });
      }
      if (adminCode !== adminSignupCode) {
        return res.status(403).json({ message: 'Invalid admin signup code' });
      }
      assignedRole = 'admin';
    } else {
      return res.status(403).json({ message: 'Invalid signup role' });
    }

    // Only create Employee documents for 'employee' role. Since self-signup for employees
    // is disabled, we do not create employee records here for hr/admin signups.
    let employeeId = null;

    // Create user
    const user = await User.create({
      loginId,
      email,
      password,
      role: assignedRole,
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
    console.log('Login attempt for:', loginId);

    // Check for user
    const user = await User.findOne({ loginId }).populate('employeeId');
    if (!user) {
      console.log('User not found for loginId:', loginId);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for:', loginId);
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
