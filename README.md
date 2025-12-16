# Amenshi 4 Life - Full Stack Application

**Clean Water for Zambia** 💧🇿🇲

A modern full-stack web application for Amenshi 4 Life nonprofit organization dedicated to providing clean water wells and care for abandoned babies in Zambia.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (Atlas or local)

### Installation

**1. Clone and navigate:**
```bash
cd amenshi_4_life
```

**2. Install Backend:**
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
```

**3. Install Frontend:**
```bash
cd ../client
npm install
```

**4. Start Development:**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

**5. Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin: http://localhost:5173/admin/login

---

## 📁 Project Structure

```
amenshi_4_life/
├── client/              # Vite + React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── ...
│   └── package.json
│
├── server/              # Express + MongoDB backend
│   ├── models/          # Database models
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   └── package.json
│
└── README.md
```

---

## 🎯 Features

### Public Features
- ✅ Dynamic homepage with live statistics
- ✅ Project showcase with search & filters
- ✅ Team member profiles
- ✅ Photo gallery
- ✅ Working contact form
- ✅ Fully responsive design
- ✅ SEO optimized

### Admin Features
- ✅ Secure authentication
- ✅ Dashboard with metrics
- ✅ Project management
- ✅ Team management
- ✅ Contact message inbox
- ✅ Statistics updates

### Technical
- ⚡ Vite for ultra-fast development
- 🎨 Tailwind CSS for styling
- 🔐 JWT authentication
- 📧 Email notifications
- 🔍 Advanced search & filtering
- 📱 Mobile-first responsive
- ♿ Accessibility (WCAG 2.1)
- 🚀 Production-ready

---

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- React Query
- Axios
- React Hook Form
- React Toastify

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Nodemailer

---

## 📖 Documentation

- **Quick Start:** See [QUICK_START.md](QUICK_START.md)
- **Backend API:** See [server/README.md](server/README.md)
- **Frontend:** See [client/README.md](client/README.md)

---

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/amenshi4life
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_DONATION_URL=your_donation_url
```

---

## 📊 API Endpoints

### Public
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Single project
- `GET /api/team` - Team members
- `GET /api/statistics` - Organization stats
- `POST /api/contact` - Submit contact form

### Protected (Admin)
- `POST /api/auth/login` - Admin login
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `PUT /api/statistics` - Update stats

*See full API docs in server/README.md*

---

## 🧪 Development

### Seed Database
```bash
cd server
node seeder.js
```

### Create Admin
```bash
# Default credentials in .env
curl -X POST http://localhost:5000/api/auth/setup
```

### Build for Production
```bash
# Frontend
cd client
npm run build

# Backend
cd server
npm start
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Backend (Render/Railway)
1. Connect GitHub repo
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

### Database
Use MongoDB Atlas for production database.

---

## 🤝 Contributing

This is a nonprofit project. Contributions welcome!

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

---

## 📝 License

MIT License - Feel free to use this for good causes!

---

## 💡 About Amenshi 4 Life

We are a non-profit ministry serving needs for clean water and care for abandoned babies in Zambia, Africa. A partnership between missions-minded believers in the USA and Gilgal Christian Community Centre in Kitwe, Zambia.

**Our Impact:**
- 20+ boreholes donated
- 30+ boreholes repaired
- 60+ communities benefiting
- Education programs
- Baby rescue & care

---

## 📞 Contact

- Website: (your-website.com)
- Email: A4L@gmail.com
- Location: Kitwe, Zambia

---

## 🙏 Support Our Mission

[Donate Now](https://app.clovergive.com/App/Giving/talm10e206) to help bring clean water to Zambia!

---

**Built with ❤️ for a better world**

*Transforming lives through clean water and compassionate care.*
