const ProjectReport = require('../models/project_report');
const Project = require('../models/project');

// Submit report
exports.submitReport = async (req, res) => {
  try {
    const {
      weekNumber,
      weekStartDate,
      expenses,
      progressDetails,
      completionPercentage,
      challenges,
      nextWeekPlan
    } = req.body;

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const report = await ProjectReport.create({
      projectId: req.params.projectId,
      contractorId: req.user.id,
      weekNumber,
      weekStartDate: new Date(weekStartDate),
      expenses,
      progressDetails,
      completionPercentage,
      challenges,
      nextWeekPlan
    });

    res.status(201).json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reports for a project
exports.getProjectReports = async (req, res) => {
  try {
    const reports = await ProjectReport.find({ projectId: req.params.projectId })
      .populate('contractorId', 'legalName')
      .sort('-weekNumber');

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get specific report
exports.getReport = async (req, res) => {
  try {
    const report = await ProjectReport.findById(req.params.reportId)
      .populate('contractorId', 'legalName')
      .populate('projectId', 'name');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};