const express = require('express');
const router = express.Router();
const reportRoutes = require('./reports');
const { auth } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const projectController = require('../controllers/projectController');

// Mount report routes
router.use('/:projectId/reports', reportRoutes);

// Project routes
router.route('/')
  .post(auth, checkRole(['Government Official']), projectController.createProject)
  .get(projectController.getProjects);

router.route('/:id')
  .get(projectController.getProject)
  .put(auth, checkRole(['Government Official']), projectController.updateProject)
  .delete(auth, checkRole(['Government Official']), projectController.deleteProject);

router.route('/:id/assign')
  .put(auth, checkRole(['Government Official']), projectController.assignContractor);

module.exports = router;