const mongoose = require('mongoose');

const projectReportSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  contractorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
  },
  weekStartDate: {
    type: Date,
    required: true
  },
  expenses: {
    materials: {
      type: Number,
      required: true
    },
    labor: {
      type: Number,
      required: true
    },
    equipment: {
      type: Number,
      required: true
    },
    other: {
      type: Number,
      default: 0
    }
  },
  progressDetails: {
    type: String,
    required: true
  },
  completionPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  challenges: {
    type: String
  },
  nextWeekPlan: {
    type: String
  },
  status: {
    type: String,
    enum: ['Submitted', 'Approved', 'Rejected'],
    default: 'Submitted'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent multiple reports for same project and week
projectReportSchema.index({ projectId: 1, weekNumber: 1 }, { unique: true });

module.exports = mongoose.model('ProjectReport', projectReportSchema);