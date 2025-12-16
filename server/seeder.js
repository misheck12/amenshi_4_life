require('dotenv').config();
const connectDB = require('./config/db');
const Project = require('./models/Project');
const Team = require('./models/Team');
const Statistics = require('./models/Statistics');
const Admin = require('./models/Admin');

connectDB();

const projects = [
  {
    title: 'Kamatipa Drilling',
    description: 'Kamatipa is home to 15,000 residents. The area is populated by youths and children with few schools and no clean water sources. Kamatipa suffers from water-borne diseases and low literacy. We have donated a borehole which is 30 meters deep to benefit the community, and we hope that the story will change.',
    location: 'Kamatipa, Zambia',
    status: 'completed',
    category: 'borehole-donation',
    beneficiaries: 15000,
    cost: 5000,
    featured: true,
    completedDate: new Date('2023-01-15'),
    images: []
  },
  {
    title: 'New Kitwe Repairs',
    description: 'We have repaired two wells in New Kitwe so far. This has been of benefit to this community owing to the fact that there is no other source of water apart from these wells.',
    location: 'New Kitwe, Zambia',
    status: 'completed',
    category: 'borehole-repair',
    beneficiaries: 8000,
    cost: 2000,
   featured: true,
    completedDate: new Date('2023-06-20'),
    images: []
  },
  {
    title: 'Race Course Well Donation',
    description: 'We drilled this well 10 years ago and the community is still benefiting from it. We have changed the pump and pipes, changed the base and rebuilt a new one. We are happy to know that this well has served a lot of residents who have no other source of water.',
    location: 'Race Course, Kitwe',
    status: 'completed',
    category: 'borehole-donation',
    beneficiaries: 12000,
    cost: 6000,
    featured: true,
    completedDate: new Date('2014-03-10'),
    images: []
  }
];

const teamMembers = [
  {
    name: 'Nancy Staible',
    role: 'Founder',
    bio: 'Passionate about bringing clean water and care to communities in need.',
    image: 'nancy.png',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#'
    },
    order: 1
  },
  {
    name: 'Rollie Brinker',
    role: 'Director - U.S.A',
    bio: 'Leading operations and partnerships in the United States.',
    image: 'rollie.jpg',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#'
    },
    order: 2
  },
  {
    name: 'Leann Marrie Davis',
    role: 'Teaching Expert- U.S.A',
    bio: 'Dedicated to improving education in underserved communities.',
    image: 'lean.png',
    social: {
      facebook: '#',
      linkedin: '#',
      instagram: '#'
    },
    order: 3
  },
  {
    name: 'B. Ennocent Silwamba',
    role: 'Director - Zambia',
    bio: 'Overseeing all operations and projects in Zambia.',
    image: 'bishop.jpeg',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#'
    },
    order: 4
  },
  {
    name: 'Renwick Chibanga',
    role: 'Drilling Team Lead - Zambia',
    bio: 'Leading the technical drilling operations on the ground.',
    image: 'renwick.jpg',
    social: {
      linkedin: '#',
      instagram: '#'
    },
    order: 5
  },
  {
    name: 'Bryan Peoples',
    role: 'Design Expert - U.S.A',
    bio: 'Creating impactful designs to communicate our mission.',
    image: 'bryan.jpg',
    social: {
      facebook: '#',
      twitter: '#',
      linkedin: '#'
    },
    order: 6
  }
];

const statistics = {
  boreholeDonated: 20,
  boreholesRepaired: 30,
  communitiesBenefiting: 60,
  babiesRescued: 15,
  peopleServed: 50000,
  yearsOfService: 10
};

const importData = async () => {
  try {
    // Clear existing data
    await Project.deleteMany();
    await Team.deleteMany();
    await Statistics.deleteMany();
    
    // Insert sample data
    await Project.insertMany(projects);
    await Team.insertMany(teamMembers);
    await Statistics.create(statistics);

    console.log('✅ Sample data imported successfully');
    console.log(`   - ${projects.length} projects created`);
    console.log(`   - ${teamMembers.length} team members added`);
    console.log(`   - Statistics initialized`);
    
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Project.deleteMany();
    await Team.deleteMany();
    await Statistics.deleteMany();
    await Admin.deleteMany();

    console.log('✅ All data destroyed');
    process.exit();
  } catch (error) {
    console.error('❌ Error destroying data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
