const Project = require('../models/project');
const User = require('../models/user');

// @desc    Create new project
exports.createProject = async (req, res) => {
  try {
    const {
      name,
      region,
      description,
      tenderDetails,
      deadline,
      materialCost,
      laborCost,
      constructionCost
    } = req.body;

    const project = await Project.create({
      name,
      region,
      description,
      tenderDetails,
      deadline,
      materialCost,
      laborCost,
      constructionCost,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'legalName')
      .populate('contractorId', 'legalName');

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'legalName')
      .populate('contractorId', 'legalName');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await project.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignContractor = async (req, res) => {
  try {
    const { contractorId } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const contractor = await User.findOne({
      _id: contractorId,
      role: 'Contractor'
    });

    if (!contractor) {
      return res.status(400).json({ message: 'Invalid contractor' });
    }

    project.contractorId = contractorId;
    project.status = 'In Progress';
    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};