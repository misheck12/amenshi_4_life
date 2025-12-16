# Amenshi 4 Life - Backend API

RESTful API for Amenshi 4 Life nonprofit organization.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB** (if running locally):
```bash
mongod
```

4. **Seed the database** (optional):
```bash
node seeder.js
```

5. **Start the server:**
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### Public Routes

#### Projects
- `GET /api/projects` - Get all projects (with pagination, filtering, search)
- `GET /api/projects/:id` - Get single project
- `GET /api/projects/featured` - Get featured projects

#### Team
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single team member

#### Statistics
- `GET /api/statistics` - Get organization statistics

#### Contact
- `POST /api/contact` - Submit contact form

### Protected Routes (Require Authentication)

#### Projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Team
- `POST /api/team` - Add team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member

#### Statistics
 - `PUT /api/statistics` - Update statistics

#### Contact
- `GET /api/contact` - Get all messages
- `PUT /api/contact/:id` - Update message status
- `DELETE /api/contact/:id` - Delete message

#### Auth
- `POST /api/auth/login` - Admin login
- `POST /api/auth/setup` - Create first admin (one-time)
- `GET /api/auth/me` - Get current admin
- `PUT /api/auth/updatepassword` - Update password

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### First Time Setup

1. Create the first admin account:
```bash
curl -X POST http://localhost:5000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User"}'
```

2. Login with default credentials:
  - Email: `admin@amenshi4life.org`
  - Password: `Admin@123`

3. **Important:** Change the password immediately after first login!

## 📊 Query Parameters

### Projects Endpoint

**Filtering:**
```
GET /api/projects?status=completed
GET /api/projects?category=borehole-donation
```

**Search:**
```
GET /api/projects?search=kitwe
```

**Sorting:**
```
GET /api/projects?sort=-createdAt  # Descending
GET /api/projects?sort=title        # Ascending
```

**Pagination:**
```
GET /api/projects?page=2&limit=5
```

**Field Selection:**
```
GET /api/projects?select=title,location,status
```

**Combining:**
```
GET /api/projects?status=completed&category=borehole-donation&page=1&limit=10&sort=-completedDate
```

## 🗂️ Project Structure

```
server/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js
│   ├── contactController.js
│   ├── projectController.js
│   ├── statisticsController.js
│   └── teamController.js
├── middleware/
│   ├── auth.js           # JWT authentication
│   └── errorHandler.js   # Error handling
├── models/
│   ├── Admin.js
│   ├── Contact.js
│   ├── Project.js
│   ├── Statistics.js
│   └── Team.js
├── routes/
│   ├── auth.js
│   ├── contact.js
│   ├── projects.js
│   ├── statistics.js
│   └── team.js
├── .env                  # Environment variables
├── .env.example          # Environment template
├── seeder.js             # Database seeder
├── server.js             # Main server file
└── package.json
```

## 🛠️ Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/amenshi4life
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@amenshi4life.org
ADMIN_PASSWORD=changeme
```

## 📝 Database Seeder

**Import sample data:**
```bash
node seeder.js
```

**Destroy all data:**
```bash
node seeder.js -d
```

## 🔄 Testing with cURL

**Get all projects:**
```bash
curl http://localhost:5000/api/projects
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@amenshi4life.org","password":"Admin@123"}'
```

**Create project (with auth):**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"New Project","description":"Description","location":"Zambia","category":"borehole-donation"}'
```

## 🚨 Error Handling

All errors return JSON in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **nodemailer** - Email sending

## 🔒 Security Features

- JWT-based authentication
- Password encryption with bcrypt
- Helmet.js security headers
- CORS protection
- Rate limiting
- Input validation
- XSS protection

## 📞 Support

For questions or issues, contact: admin@amenshi4life.org

---

**Made with ❤️ for Amenshi 4 Life**
