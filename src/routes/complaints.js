const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const {
  submitComplaint,
  trackComplaint,
  updateComplaintStatus,
  getComplaints
} = require('../controllers/complaintController');

// Public routes
router.post('/', submitComplaint);
router.get('/track/:complaintId', trackComplaint);

// Protected routes (Government Officials only)
router.get('/', auth, checkRole(['Government Official']), getComplaints);
router.put('/:complaintId', auth, checkRole(['Government Official']), updateComplaintStatus);

module.exports = router;