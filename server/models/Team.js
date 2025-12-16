const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please add a role']
  },
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  social: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
