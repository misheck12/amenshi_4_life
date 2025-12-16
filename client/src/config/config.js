// Environment configuration
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  donationUrl: import.meta.env.VITE_DONATION_URL || 'https://app.clovergive.com/App/Giving/talm10e206',
  siteName: 'Amenshi 4 Life',
  contactEmail: 'A4L@gmail.com',
  contactAddress: '12 Mporokoso, Kitwe, Zambia',
  contactPhone: '+1 123 456 7890',
};

// API endpoints
export const endpoints = {
  projects: {
    getAll: '/projects',
    getOne: (id) => `/projects/${id}`,
    getFeatured: '/projects/featured',
    create: '/projects',
    update: (id) => `/projects/${id}`,
    delete: (id) => `/projects/${id}`,
  },
  team: {
    getAll: '/team',
    getOne: (id) => `/team/${id}`,
    create: '/team',
    update: (id) => `/team/${id}`,
    delete: (id) => `/team/${id}`,
  },
  statistics: {
    get: '/statistics',
    update: '/statistics',
  },
  contact: {
    submit: '/contact',
    getAll: '/contact',
    update: (id) => `/contact/${id}`,
    delete: (id) => `/contact/${id}`,
  },
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    setup: '/auth/setup',
    updatePassword: '/auth/updatepassword',
  },
};

export default config;
