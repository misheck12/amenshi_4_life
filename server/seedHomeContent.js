require('dotenv').config();
const mongoose = require('mongoose');
const HomeContent = require('./models/HomeContent');
const connectDB = require('./config/db');

const homeContentData = {
    heroQuote: 'Thousands have lived without love, not one without water.',
    heroAuthor: 'H. Auden',
    heroDescription: 'We are a non-profit ministry serving needs for clean water and care for abandoned babies in Zambia, Africa.',
    heroImage: '/images/hero-bg.jpg',
    aboutLabel: 'This is us',
    aboutHeading: 'We believe in the power of giving',
    aboutParagraph1: 'Amenshi 4 Life is dedicated to bringing clean, safe drinking water to communities in need around the world. We believe that access to clean water is a basic human right and are committed to working towards a future where everyone has access to this vital resource.',
    aboutParagraph2: 'Over the years, we have partnered with local organizations and communities to implement a range of water projects, including drilling and repairing wells. In addition to our water projects, we also prioritize education and awareness-raising about the importance of clean water.',
    aboutImage: '/images/about-us.jpg',
};

const seedHomeContent = async () => {
    try {
        await connectDB();

        // Clear existing home content
        await HomeContent.deleteMany({});
        console.log('✅ Cleared existing homepage content');

        // Insert new home content
        const content = await HomeContent.create(homeContentData);
        console.log('✅ Seeded homepage content');

        console.log('\n📋 Homepage sections created:');
        console.log('  - Hero Section (Quote, Description)');
        console.log('  - About Section (2 paragraphs)');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding homepage content:', error);
        process.exit(1);
    }
};

seedHomeContent();
