const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  },
  reply: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
