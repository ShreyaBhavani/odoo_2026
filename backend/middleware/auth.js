const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

// Allow access if user is admin OR the owner of the employee record
exports.ownerOrAdmin = () => {
  return (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ message: 'Not authorized' });
      if (req.user.role === 'admin') return next();
      const empId = req.user.employeeId ? req.user.employeeId.toString() : null;
      if (empId && empId === req.params.id) return next();
      return res.status(403).json({ message: 'User not authorized to perform this action' });
    } catch (err) {
      return res.status(403).json({ message: 'User not authorized to perform this action' });
    }
  };
};
