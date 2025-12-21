const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  // Hero Section
  heroTitle: {
    type: String,
    default: 'About Us'
  },
  heroDescription: {
    type: String,
    default: 'We are part of The Talmudine Foundation: a non-profit ministry serving needs for clean water and care for abandoned babies in Zambia, Africa.'
  },

  // Main Content Section
  mainImage: {
    type: String,
    default: '/images/mission.jpg'
  },
  mainHeading: {
    type: String,
    default: '8 Years of Experience in Drilling and Maintenance of Water Wells'
  },
  paragraph1: {
    type: String,
    default: "We are called to demonstrate Christ's love in communities by providing clean water. We believe that access to clean water is a basic human right, and we are committed to helping communities in need gain access to this vital resource."
  },
  paragraph2: {
    type: String,
    default: 'Water-borne diseases are a major concern in Zambia, where poor sanitary services and lack of clean water are all too common. We are dedicated to reducing the incidence of water-borne diseases in the communities we serve.'
  },

  // Mission & Vision Cards
  missionTitle: {
    type: String,
    default: 'Our Mission'
  },
  missionText: {
    type: String,
    default: 'Our mission is to provide clean water and care for abandoned babies in Zambia, Africa. The foundation is a partnership between missions-minded believers in the USA and Gilgal Christian Community Centre in Kitwe, Zambia.'
  },
  visionTitle: {
    type: String,
    default: 'Our Vision'
  },
  visionText: {
    type: String,
    default: 'Our vision is a future where every community in Zambia has access to clean, safe drinking water and where every child is cared for with love and dignity. We work towards sustainable solutions that empower communities for generations to come.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);
