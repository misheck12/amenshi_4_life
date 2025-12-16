const mongoose = require('mongoose');

const homeContentSchema = new mongoose.Schema({
    // There should only be ONE homepage content document
    // Hero Section
    heroQuote: {
        type: String,
        required: true,
        default: 'Thousands have lived without love, not one without water.',
    },
    heroAuthor: {
        type: String,
        default: 'H. Auden',
    },
    heroDescription: {
        type: String,
        required: true,
        default: 'We are a non-profit ministry serving needs for clean water and care for abandoned babies in Zambia, Africa.',
    },
    heroImage: {
        type: String,
        default: '/images/hero-bg.jpg',
    },

    // About Section
    aboutLabel: {
        type: String,
        default: 'This is us',
    },
    aboutHeading: {
        type: String,
        required: true,
        default: 'We believe in the power of giving',
    },
    aboutParagraph1: {
        type: String,
        required: true,
    },
    aboutParagraph2: {
        type: String,
        required: true,
    },
    aboutImage: {
        type: String,
        default: '/images/about-us.jpg',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('HomeContent', homeContentSchema);
