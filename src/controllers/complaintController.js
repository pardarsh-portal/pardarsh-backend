const Complaint = require('../models/complaint');
const crypto = require('crypto');

// Submit anonymous complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { projectId, subject, description } = req.body;

    // Generate unique complaint ID
    const complaintId = crypto.randomBytes(6).toString('hex');

    const complaint = await Complaint.create({
      complaintId,
      projectId,
      subject,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully. Save your complaint ID for tracking.',
      data: {
        complaintId: complaint.complaintId
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Track complaint status
exports.trackComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ 
      complaintId: req.params.complaintId 
    }).select('-_id complaintId subject status response createdAt updatedAt');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update complaint status (Government Officials only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, response } = req.body;

    const complaint = await Complaint.findOne({ complaintId: req.params.complaintId });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    complaint.response = response;
    complaint.updatedAt = Date.now();
    await complaint.save();

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all complaints (Government Officials only)
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('projectId', 'name')
      .sort('-createdAt');

    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};