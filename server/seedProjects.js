require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');
const connectDB = require('./config/db');

// Sample projects data
const projects = [
    {
        title: 'Water Well in Kamatipa Village',
        description: 'Drilling a new borehole to provide clean water access for over 500 community members in Kamatipa Village. This project includes pump installation and community training.',
        location: 'Kamatipa, Zambia',
        category: 'borehole-donation',
        status: 'completed',
        images: ['/images/wells.jpg'],
        beneficiaries: 500,
        cost: 5000,
        fundedAmount: 5000,
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-03-20'),
        featured: true,
    },
    {
        title: 'Borehole Repair - Chambishi',
        description: 'Repairing and restoring a broken water pump system that serves 300 families. Includes replacement of damaged pipes and installation of a solar-powered pump.',
        location: 'Chambishi, Zambia',
        category: 'borehole-repair',
        status: 'in-progress',
        images: ['/images/wells.jpg'],
        beneficiaries: 300,
        cost: 3000,
        fundedAmount: 2100,
        startDate: new Date('2024-11-01'),
        featured: true,
    },
    {
        title: 'Somone House Expansion',
        description: 'Expanding the Somone House facility to accommodate more rescued babies. This includes building a new nursery wing and medical care room.',
        location: 'Kitwe, Zambia',
        category: 'babies',
        status: 'in-progress',
        images: ['/images/babies.jpg'],
        beneficiaries: 20,
        cost: 15000,
        fundedAmount: 8000,
        startDate: new Date('2024-10-01'),
        featured: true,
    },
    {
        title: 'School Internet Access Project',
        description: 'Providing internet connectivity and computers to local schools to enhance education. Includes installation of equipment and teacher training.',
        location: 'Kitwe, Zambia',
        category: 'education',
        status: 'planned',
        images: ['/images/education.jpg'],
        beneficiaries: 450,
        cost: 8000,
        fundedAmount: 1000,
        featured: false,
    },
    {
        title: 'Community Water Well - Ndola',
        description: 'New borehole drilling project in Ndola to serve multiple households. Community-managed water point with solar pump system.',
        location: 'Ndola, Zambia',
        category: 'borehole-donation',
        status: 'in-progress',
        images: ['/images/wells.jpg'],
        beneficiaries: 400,
        cost: 6000,
        fundedAmount: 3500,
        startDate: new Date('2024-12-01'),
        featured: false,
    },
];

const seedProjects = async () => {
    try {
        await connectDB();

        // Clear existing projects
        await Project.deleteMany({});
        console.log('✅ Cleared existing projects');

        // Insert new projects
        const createdProjects = await Project.insertMany(projects);
        console.log(`✅ Seeded ${createdProjects.length} projects`);

        console.log('\n📋 Projects created:');
        createdProjects.forEach(project => {
            console.log(`  - ${project.title} (${project.status})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding projects:', error);
        process.exit(1);
    }
};

seedProjects();
