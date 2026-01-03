const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createRequest,
  getAll,
  getMine,
  approve,
  reject
} = require('../controllers/timeoffController');

const router = express.Router();

router.post('/', protect, createRequest);
router.get('/mine', protect, getMine);
router.get('/', protect, authorize('admin'), getAll);
router.put('/:id/approve', protect, authorize('admin'), approve);
router.put('/:id/reject', protect, authorize('admin'), reject);

module.exports = router;
