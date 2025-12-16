require('dotenv').config();
const mongoose = require('mongoose');
const Ministry = require('./models/Ministry');
const connectDB = require('./config/db');

// Sample ministries data
const ministries = [
    {
        title: 'Amenshi 4 Life',
        subtitle: 'Amenshi (water) 4 life',
        content: [
            "In 2005, I traveled with a medical mission team to Zambia, Africa. It would be my first of many visits to the sub-Saharan country about the size of Texas with a little over 10 million people. We had been told that the people were infected with AIDS and a deadly form of malaria. After ten days of medical clinics set up in communities of abject poverty, city streets, and the country's prison, I was struck by the fact that so many of the diseases we treated were the result of the absence of health education and the lack of available clean water.",
            "In 2014 Talmudine Foundation in partnership with Gilgal Christian Community Centre in Kitwe, Zambia established Amenshi4Life, a water well-drilling project. A portable drill rig was shipped to Zambia and a team from the USA sent to train a team of Zambian men to drill for water and establish a business offering well drilling services. After three years of drilling wells, Amenshi4Life is receiving an increased number of requests for boreholes that can be \"gifted\" to those in desperate need without any means to fund."
        ],
        image: '/images/wells.jpg',
        order: 1,
        active: true,
    },
    {
        title: 'Somone Home',
        subtitle: 'Somone House means "Come and see what the Lord has done"',
        content: [
            "One of the most difficult realities we confronted as medical missionaries in Zambia was the horror of \"dumped babies\". New mothers, many HIV positive living in abject poverty without support, often leave their newborns on the steps of buildings, in trash cans, or even latrines where they give birth. In response, Gilgal Community Church, in partnership with Talmudine Foundation, built and equipped the Somone House for Babies, completed in 2011.",
            "It is a place where babies receive loving care, nourishing food, and medical care for growth and good health. Each baby has also been dedicated to the Lord at Gilgal Community Church where they worship with their caregivers. The goal is for them to be adopted in the community or returned to family members. Once they reach the age of two, the Social Service agreement requires that they move to an orphanage. So far three children have been placed in a wonderful Christian Orphanage, while all others were placed in homes of family members or adopted.",
            "Many families within the nearby churches would adopt the children but cannot afford to support another child. To solve this problem, we have developed a sponsorship program for the loving Christian families fostering or adopting these rescued babies."
        ],
        image: '/images/babies.jpg',
        order: 2,
        active: true,
    },
    {
        title: 'Education',
        subtitle: 'Education is the world\'s most powerful weapon',
        content: [
            "Walking off of the airplane, we were greeted with a sign in the Zambia airport that said, \"Education is our most sustainable investment.\" After visiting three phenomenal schools, we definitely saw the passion of teaching in the teachers' hearts, the love of learning in the students' eyes, and the ability to do so much with very limited resources.",
            "We are committed to help support schools in Zambia. Giving them access to the Internet and a printer, would allow their resources to be unlimited. Our next steps are to fund Internet access and a printer for a school and to build another school for the Somone House. Please consider giving to this crucial component of education in these precious children's lives."
        ],
        image: '/images/education.jpg',
        order: 3,
        active: true,
    },
];

const seedMinistries = async () => {
    try {
        await connectDB();

        // Clear existing ministries
        await Ministry.deleteMany({});
        console.log('✅ Cleared existing ministries');

        // Insert new ministries
        const createdMinistries = await Ministry.insertMany(ministries);
        console.log(`✅ Seeded ${createdMinistries.length} ministries`);

        console.log('\n📋 Ministries created:');
        createdMinistries.forEach(ministry => {
            console.log(`  - ${ministry.title}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding ministries:', error);
        process.exit(1);
    }
};

seedMinistries();
