require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('./models/Service');

const connectDB = require('./config/db');

// Sample services data
const services = [
    {
        title: 'Borehole Donation',
        description: 'Providing clean water access through borehole construction in rural communities',
        icon: 'FaHandHoldingWater',
        details: [
            'Site assessment and water source identification',
            'Professional borehole drilling and installation',
            'Solar-powered pump systems for sustainability',
            'Community training on maintenance and management',
            'Long-term monitoring and support',
        ],
        order: 1,
        active: true,
    },
    {
        title: 'Borehole Repair & Maintenance',
        description: 'Restoring and maintaining existing boreholes to ensure continuous water supply',
        icon: 'FaTools',
        details: [
            'Comprehensive system diagnostics',
            'Pump repair and replacement',
            'Pipeline and infrastructure fixes',
            'Water quality testing',
            'Preventive maintenance programs',
        ],
        order: 2,
        active: true,
    },
    {
        title: 'Baby Rescue & Care',
        description: 'Supporting vulnerable children with essential care, nutrition, and safe shelter',
        icon: 'FaBaby',
        details: [
            'Emergency rescue and placement',
            'Nutritional support and healthcare',
            'Safe shelter and 24/7 care',
            'Educational support programs',
            'Family reunification services',
        ],
        order: 3,
        active: true,
    },
    {
        title: 'Education Support',
        description: 'Empowering communities through educational programs and resources',
        icon: 'FaGraduationCap',
        details: [
            'School supplies and materials distribution',
            'Scholarship programs for vulnerable children',
            'Adult literacy classes',
            'Vocational training programs',
            'Community library development',
        ],
        order: 4,
        active: true,
    },
    {
        title: 'Community Development',
        description: 'Building sustainable communities through holistic development initiatives',
        icon: 'FaHandsHelping',
        details: [
            'Capacity building workshops',
            'Income generation projects',
            'Health and hygiene education',
            'Agricultural support programs',
            'Community leadership training',
        ],
        order: 5,
        active: true,
    },
];

const seedServices = async () => {
    try {
        await connectDB();

        // Clear existing services
        await Service.deleteMany({});
        console.log('✅ Cleared existing services');

        // Insert new services
        const createdServices = await Service.insertMany(services);
        console.log(`✅ Seeded ${createdServices.length} services`);

        console.log('\n📋 Services created:');
        createdServices.forEach(service => {
            console.log(`  - ${service.title} (${service.icon})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding services:', error);
        process.exit(1);
    }
};

seedServices();
