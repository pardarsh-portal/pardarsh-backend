const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for accessing params from parent router
const { auth } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const reportController = require('../controllers/reportController');

// Routes
router.route('/')
  .post(auth, checkRole(['Contractor']), reportController.submitReport)
  .get(reportController.getProjectReports);

router.route('/:reportId')
  .get(reportController.getReport);

module.exports = router;