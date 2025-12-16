const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  boreholeDonated: {
    type: Number,
    default: 20
  },
  boreholesRepaired: {
    type: Number,
    default: 30
  },
  communitiesBenefiting: {
    type: Number,
    default: 60
  },
  babiesRescued: {
    type: Number,
    default: 0
  },
  peopleServed: {
    type: Number,
    default: 0
  },
  yearsOfService: {
    type: Number,
    default: 8
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Statistics', statisticsSchema);
