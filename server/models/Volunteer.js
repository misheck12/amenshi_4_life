const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name']
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add your phone number']
  },
  skills: {
    type: String,
    required: [true, 'Please list your skills']
  },
  availability: {
    type: String, // e.g., "Weekends", "Summer 2025"
    required: [true, 'Please share your availability']
  },
  message: {
    type: String,
    required: [true, 'Please add a message about why you want to volunteer']
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'contacted', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
