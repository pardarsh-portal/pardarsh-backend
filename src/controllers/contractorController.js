const User = require('../models/user');
const Project = require('../models/project');
const Review = require('../models/reviews');

// @desc    Get all contractors
// @route   GET /api/contractors
// @access  Public
exports.getContractors = async (req, res) => {
    try {
      const contractors = await User.find({ role: 'Contractor' })
        .select('-password')
        .populate({
          path: 'reviews',
          select: 'rating comment createdAt'
        });
  
      res.json({
        success: true,
        count: contractors.length,
        data: contractors
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

// @desc    Get contractor by ID
// @route   GET /api/contractors/:id
// @access  Public
exports.getContractor = async (req, res) => {
  try {
    const contractor = await User.findOne({
      _id: req.params.id,
      role: 'Contractor'
    }).select('-password');

    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    // Get contractor's projects
    const projects = await Project.find({ contractorId: req.params.id });

    // Get contractor's reviews
    const reviews = await Review.find({ contractorId: req.params.id })
      .populate('reviewerId', 'legalName');

    res.json({
      success: true,
      data: {
        contractor,
        projects,
        reviews
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get contractor's projects
// @route   GET /api/contractors/:id/projects
// @access  Private (Contractor only)
exports.getContractorProjects = async (req, res) => {
  try {
    const projects = await Project.find({ contractorId: req.params.id })
      .populate('createdBy', 'legalName');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add review for contractor
// @route   POST /api/contractors/:id/reviews
// @access  Private (Government Officials only)
exports.addContractorReview = async (req, res) => {
  try {
    const { rating, comment, projectId } = req.body;

    // Check if contractor exists
    const contractor = await User.findOne({
      _id: req.params.id,
      role: 'Contractor'
    });

    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    // Create review
    const review = await Review.create({
      contractorId: req.params.id,
      projectId,
      reviewerId: req.user.id,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update contractor's faith score
// @route   PUT /api/contractors/:id/faith-score
// @access  Private (Government Officials only)
exports.updateFaithScore = async (req, res) => {
  try {
    const { faithScore } = req.body;

    const contractor = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'Contractor' },
      { faithScore },
      { new: true }
    ).select('-password');

    if (!contractor) {
      return res.status(404).json({ message: 'Contractor not found' });
    }

    res.json({
      success: true,
      data: contractor
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};