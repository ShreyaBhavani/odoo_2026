const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const { protect, authorize, ownerOrAdmin } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getEmployees)
  .post(protect, authorize('admin'), createEmployee);

router.route('/:id')
  .get(protect, getEmployee)
  .put(protect, ownerOrAdmin(), updateEmployee)
  .delete(protect, authorize('admin'), deleteEmployee);

module.exports = router;
