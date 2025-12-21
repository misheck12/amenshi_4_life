const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // SMTP Settings
  smtpHost: {
    type: String,
    default: ''
  },
  smtpPort: {
    type: Number,
    default: 587
  },
  smtpUser: {
    type: String,
    default: ''
  },
  smtpPassword: {
    type: String,
    default: ''
  },
  smtpFromEmail: {
    type: String,
    default: ''
  },
  
  // You can add other system settings here later (e.g. social links, contact info)
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
