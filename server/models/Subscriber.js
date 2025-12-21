const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  active: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscriber', subscriberSchema);
