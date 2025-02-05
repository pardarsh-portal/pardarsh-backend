const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Contractor', 'Government Official', 'General User'],
    default: 'General User'
  },
  legalName: String,
  dob: Date,
  phoneNumber: String,
  aadharNumber: String,
  address: String,
  faithScore: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Enable virtuals
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews
userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'contractorId'
});

module.exports = mongoose.model('User', userSchema);