const express = require('express');
const router = express.Router();
const {
  getContractors,
  getContractor,
  getContractorProjects,
  addContractorReview,
  updateFaithScore
} = require('../controllers/contractorController');
const { auth } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

router.route('/')
  .get(getContractors);

router.route('/:id')
  .get(getContractor);

router.route('/:id/projects')
  .get(auth, checkRole(['Contractor', 'Government Official']), getContractorProjects);

router.route('/:id/reviews')
  .post(auth, checkRole(['Government Official']), addContractorReview);

router.route('/:id/faith-score')
  .put(auth, checkRole(['Government Official']), updateFaithScore);

module.exports = router;