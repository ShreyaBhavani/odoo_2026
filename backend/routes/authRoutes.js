const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

router.post(
  '/register',
  [
    body('loginId').notEmpty().withMessage('Login ID is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
  ],
  register
);

router.post(
  '/login',
  [
    body('loginId').notEmpty().withMessage('Login ID is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  login
);

router.get('/me', protect, getMe);

module.exports = router;
