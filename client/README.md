# Amenshi 4 Life - Frontend

Modern Vite + React frontend for Amenshi 4 Life nonprofit organization.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Configure Environment
```bash
cp .env.example .env
# Edit .env if needed
```

### Start Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5173` with hot reload!

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   ├── common/      # Reusable components
│   │   └── layout/      # Layout components
│   ├── pages/           # Page components
│   │   └── admin/       # Admin panel pages
│   ├── context/         # React Context
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Features

- ⚡ Vite for lightning-fast development
- ⚛️ React 18 with hooks
- 🎨 Tailwind CSS for styling
- 🔄 React Query for data fetching
- 🛣️ React Router for navigation
- 🔐 JWT authentication
- 📧 Working contact form
- 🖼️ Image gallery
- 📱 Fully responsive
- ♿ Accessible (WAI-ARIA)
- 🔍 SEO optimized

## 📝 Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
VITE_DONATION_URL=https://app.clovergive.com/App/Giving/talm10e206
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 📦 Dependencies

### Core
- react & react-dom
- vite
- tailwindcss

### Routing & State
- react-router-dom
- @tanstack/react-query

### UI & Forms
- react-hook-form
- react-toastify
- react-icons
- react-helmet-async

### HTTP Client
- axios

## 🌐 Pages

### Public
- `/` - Home
- `/about` - About Us
- `/services` - Our Ministries
- `/projects` - All Projects
- `/projects/:id` - Project Details
- `/gallery` - Photo Gallery
- `/contact` - Contact Form

### Admin
- `/admin/login` - Admin Login
- `/admin/dashboard` - Dashboard
- `/admin/projects` - Manage Projects
- `/admin/team` - Manage Team
- `/admin/messages` - Contact Messages
- `/admin/statistics` - Update Statistics

## 🎯 Next Steps

1. Replace placeholder images in `/public/images/`
2. Customize colors in `tailwind.config.js`
3. Update content as needed
4. Deploy to Vercel/Netlify

## 📄 License

Made with ❤️ for Amenshi 4 Life
