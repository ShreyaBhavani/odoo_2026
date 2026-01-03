const express = require('express');
const {
  getSalary,
  createOrUpdateSalary,
  deleteSalary
} = require('../controllers/salaryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .post(protect, authorize('admin'), createOrUpdateSalary);

router.route('/:employeeId')
  .get(protect, authorize('admin'), getSalary)
  .delete(protect, authorize('admin'), deleteSalary);

module.exports = router;
