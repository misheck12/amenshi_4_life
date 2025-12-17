# Amenshi 4 Life - Detailed Codebase Structure & Workflow

**Last Updated:** December 17, 2025

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Directory Structure](#directory-structure)
4. [Architecture](#architecture)
5. [Module Breakdown](#module-breakdown)
6. [Data Flow & Workflow](#data-flow--workflow)
7. [API Documentation](#api-documentation)
8. [Authentication & Authorization](#authentication--authorization)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Development Workflow](#development-workflow)

---

## 🎯 Project Overview

**Amenshi 4 Life** is a full-stack web application for a nonprofit organization dedicated to providing clean water wells and care for abandoned babies in Zambia. The application features:

- **Public-facing website** with project showcase, gallery, contact forms
- **Admin dashboard** for content management
- **REST API** for data operations
- **CI/CD pipeline** for automated deployment
- **Docker containerization** for consistent environments

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI Framework |
| **Vite** | 6.0.1 | Build tool & dev server |
| **React Router** | 6.26.2 | Client-side routing |
| **TanStack Query** | 5.59.0 | Server state management |
| **Tailwind CSS** | 3.4.14 | Styling framework |
| **Axios** | 1.7.7 | HTTP client |
| **React Hook Form** | 7.53.0 | Form management |
| **React Toastify** | 10.0.5 | Notifications |
| **React Icons** | 5.3.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 14+ | Runtime environment |
| **Express** | 5.2.1 | Web framework |
| **MongoDB** | - | Database |
| **Mongoose** | 9.0.1 | ODM for MongoDB |
| **JWT** | 9.0.3 | Authentication |
| **bcryptjs** | 3.0.3 | Password hashing |
| **Cloudinary** | 2.8.0 | Image hosting |
| **Nodemailer** | 7.0.11 | Email service |
| **Helmet** | 8.1.0 | Security headers |
| **Express Rate Limit** | 8.2.1 | Rate limiting |
| **Multer** | 2.0.2 | File uploads |

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **GitHub Actions** - CI/CD automation
- **PM2** (optional) - Process management
- **Nginx** - Reverse proxy & static file serving

---

## 📁 Directory Structure

```
amenshi_4_life/
│
├── 📂 .github/                      # GitHub-specific configurations
│   └── workflows/                   # GitHub Actions CI/CD workflows
│       ├── deploy.yml              # Main deployment workflow
│       ├── deploy-rsync.yml        # Alternative rsync deployment
│       ├── pr-checks.yml           # Pull request validation
│       └── rollback.yml            # Automated rollback workflow
│
├── 📂 client/                       # Frontend React application
│   ├── 📂 public/                  # Static assets
│   │   └── images/                 # Public images
│   │
│   ├── 📂 src/                     # Source code
│   │   ├── 📂 components/          # Reusable React components
│   │   │   ├── common/            # Shared components
│   │   │   │   ├── Spinner.jsx    # Loading spinners
│   │   │   │   ├── Modal.jsx      # Modal dialogs
│   │   │   │   └── ImageUpload.jsx # Image upload component
│   │   │   │
│   │   │   └── layout/            # Layout components
│   │   │       ├── Navbar.jsx     # Main navigation
│   │   │       ├── Footer.jsx     # Site footer
│   │   │       ├── AdminLayout.jsx # Admin dashboard layout
│   │   │       ├── AdminSidebar.jsx # Admin sidebar
│   │   │       └── Hero.jsx       # Hero section
│   │   │
│   │   ├── 📂 pages/               # Page components
│   │   │   ├── Home.jsx           # Homepage
│   │   │   ├── About.jsx          # About page
│   │   │   ├── Services.jsx       # Services page
│   │   │   ├── Ministries.jsx     # Ministries page
│   │   │   ├── Projects.jsx       # Projects listing
│   │   │   ├── ProjectDetail.jsx  # Single project view
│   │   │   ├── Gallery.jsx        # Photo gallery
│   │   │   ├── Contact.jsx        # Contact form
│   │   │   ├── NotFound.jsx       # 404 page
│   │   │   │
│   │   │   └── 📂 admin/          # Admin pages
│   │   │       ├── Login.jsx      # Admin login
│   │   │       ├── Dashboard.jsx  # Admin overview
│   │   │       ├── ProjectManager.jsx      # Projects CRUD
│   │   │       ├── TeamManager.jsx         # Team CRUD
│   │   │       ├── GalleryManager.jsx      # Gallery CRUD
│   │   │       ├── ServiceManager.jsx      # Services CRUD
│   │   │       ├── MinistryManager.jsx     # Ministries CRUD
│   │   │       ├── HomeContentManager.jsx  # Home content CRUD
│   │   │       ├── Messages.jsx            # Contact messages inbox
│   │   │       └── Statistics.jsx          # Stats management
│   │   │
│   │   ├── 📂 services/            # API service layer
│   │   │   └── api.js             # Axios configuration & API calls
│   │   │
│   │   ├── 📂 context/             # React Context providers
│   │   │   └── AuthContext.jsx    # Authentication context
│   │   │
│   │   ├── 📂 config/              # App configuration
│   │   │   └── queryClient.js     # React Query config
│   │   │
│   │   ├── 📂 utils/               # Utility functions
│   │   │   └── helpers.js         # Helper functions
│   │   │
│   │   ├── App.jsx                # Main App component (routing)
│   │   ├── main.jsx               # App entry point
│   │   └── index.css              # Global styles
│   │
│   ├── .env.example                # Environment variables template
│   ├── .dockerignore               # Docker ignore rules
│   ├── Dockerfile                  # Frontend Docker configuration
│   ├── nginx.conf                  # Nginx configuration for production
│   ├── package.json                # Dependencies & scripts
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── postcss.config.js           # PostCSS configuration
│
├── 📂 server/                       # Backend Node.js/Express application
│   ├── 📂 config/                  # Configuration files
│   │   └── db.js                  # MongoDB connection
│   │
│   ├── 📂 models/                  # MongoDB schemas (Mongoose)
│   │   ├── Admin.js               # Admin user model
│   │   ├── Project.js             # Project model
│   │   ├── Team.js                # Team member model
│   │   ├── Contact.js             # Contact message model
│   │   ├── Statistics.js          # Statistics model
│   │   ├── Gallery.js             # Gallery image model
│   │   ├── Service.js             # Service model
│   │   ├── Ministry.js            # Ministry model
│   │   ├── HomeContent.js         # Home content model
│   │   └── Video.js               # Video (YouTube) model
│   │
│   ├── 📂 controllers/             # Business logic
│   │   ├── authController.js      # Authentication logic
│   │   ├── projectController.js   # Projects CRUD operations
│   │   ├── teamController.js      # Team CRUD operations
│   │   ├── contactController.js   # Contact form handling
│   │   ├── statisticsController.js # Statistics operations
│   │   ├── galleryController.js   # Gallery operations
│   │   ├── serviceController.js   # Services operations
│   │   ├── ministryController.js  # Ministries operations
│   │   ├── homeContentController.js # Home content operations
│   │   └── videoController.js     # Video operations
│   │
│   ├── 📂 routes/                  # API route definitions
│   │   ├── auth.js                # Auth routes
│   │   ├── projects.js            # Projects endpoints
│   │   ├── team.js                # Team endpoints
│   │   ├── contact.js             # Contact endpoints
│   │   ├── statistics.js          # Statistics endpoints
│   │   ├── gallery.js             # Gallery endpoints
│   │   ├── services.js            # Services endpoints
│   │   ├── ministries.js          # Ministries endpoints
│   │   ├── homeContent.js         # Home content endpoints
│   │   ├── videos.js              # Video endpoints
│   │   └── upload.js              # File upload endpoints
│   │
│   ├── 📂 middleware/              # Express middleware
│   │   ├── auth.js                # JWT authentication middleware
│   │   ├── errorHandler.js        # Global error handler
│   │   └── upload.js              # Multer file upload middleware
│   │
│   ├── 📂 migrations/              # Database migrations
│   │   └── updateProjects.js      # Project schema updates
│   │
│   ├── 📂 uploads/                 # Uploaded files (local storage)
│   │
│   ├── seeder.js                   # Seed all data
│   ├── seedProjects.js             # Seed projects
│   ├── seedServices.js             # Seed services
│   ├── seedMinistries.js           # Seed ministries
│   ├── seedHomeContent.js          # Seed home content
│   ├── server.js                   # Express app entry point
│   ├── .env.example                # Environment variables template
│   ├── .dockerignore               # Docker ignore rules
│   ├── Dockerfile                  # Backend Docker configuration
│   └── package.json                # Dependencies & scripts
│
├── 📂 .vscode/                      # VSCode workspace settings
│
├── 📄 docker-compose.yml            # Development Docker setup
├── 📄 docker-compose.prod.yml       # Production Docker setup
├── 📄 ecosystem.config.js           # PM2 process manager config
├── 📄 setup-vm.sh                   # VM setup script (PM2)
├── 📄 setup-vm-docker.sh            # VM setup script (Docker)
├── 📄 .gitignore                    # Git ignore rules
│
└── 📄 Documentation Files
    ├── README.md                    # Main project documentation
    ├── QUICK_START.md               # Quick start guide
    ├── DEPLOYMENT_QUICK_REF.md      # Deployment reference
    ├── DOCKER_DEPLOYMENT.md         # Docker deployment guide
    ├── MONOREPO_STRUCTURE.md        # Monorepo structure docs
    ├── CICD_ARCHITECTURE.md         # CI/CD architecture
    ├── GITHUB_ACTIONS_SETUP.md      # GitHub Actions setup
    ├── MONGODB_SETUP.md             # MongoDB setup guide
    ├── SSL_SETUP.md                 # SSL certificate setup
    └── [various feature docs...]    # Feature-specific documentation
```

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                │
│  │ Public   │   │  Admin   │   │  Mobile  │                │
│  │ Website  │   │Dashboard │   │  View    │                │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘                │
└───────┼──────────────┼──────────────┼────────────────────────┘
        │              │              │
        └──────────────┴──────────────┘
                       │
                       ▼
        ┌──────────────────────────────┐
        │       NGINX (Reverse Proxy)   │
        │    - Static file serving      │
        │    - SSL termination          │
        │    - Load balancing           │
        └──────────────┬────────────────┘
                       │
        ┌──────────────┴────────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐             ┌──────────────────┐
│   FRONTEND    │             │     BACKEND      │
│   (React)     │             │    (Express)     │
│               │             │                  │
│ - Vite        │◄───────────►│ - REST API       │
│ - React Router│   HTTP/JSON │ - JWT Auth       │
│ - TanStack    │             │ - Business Logic │
│   Query       │             │ - Validation     │
│ - Tailwind    │             │ - Middleware     │
└───────────────┘             └────────┬─────────┘
                                       │
                       ┌───────────────┼───────────────┐
                       │               │               │
                       ▼               ▼               ▼
              ┌─────────────┐  ┌────────────┐  ┌──────────────┐
              │   MongoDB   │  │ Cloudinary │  │ Nodemailer   │
              │  Database   │  │   (Images) │  │   (Email)    │
              └─────────────┘  └────────────┘  └──────────────┘
```

### Application Flow

```
User Request
     │
     ▼
┌─────────────────┐
│  React Router   │  → Client-side routing
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Page Component │  → Renders UI
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  TanStack Query │  → Manages server state, caching
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   API Service   │  → Axios HTTP client
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Express Route  │  → Route handler
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Middleware     │  → Auth, validation, error handling
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │  → Business logic
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Mongoose Model │  → Database operations
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    MongoDB      │  → Data persistence
└─────────────────┘
```

---

## 📦 Module Breakdown

### Frontend Modules

#### 1. **Pages** (`client/src/pages/`)
Public-facing pages and admin pages.

**Public Pages:**
- `Home.jsx` - Landing page with hero, stats, featured projects
- `About.jsx` - Organization information
- `Services.jsx` - Services offered
- `Ministries.jsx` - Ministry programs
- `Projects.jsx` - Project listing with filters & search
- `ProjectDetail.jsx` - Individual project details
- `Gallery.jsx` - Photo gallery with lightbox
- `Contact.jsx` - Contact form
- `NotFound.jsx` - 404 error page

**Admin Pages:**
- `Login.jsx` - Admin authentication
- `Dashboard.jsx` - Admin overview with metrics
- `ProjectManager.jsx` - Project CRUD operations
- `TeamManager.jsx` - Team member management
- `GalleryManager.jsx` - Image upload & management
- `ServiceManager.jsx` - Service content management
- `MinistryManager.jsx` - Ministry content management
- `HomeContentManager.jsx` - Homepage content editing
- `Messages.jsx` - View contact form submissions
- `Statistics.jsx` - Update organization statistics

#### 2. **Components** (`client/src/components/`)

**Layout Components:**
- `Navbar.jsx` - Main navigation with mobile menu
- `Footer.jsx` - Site footer with links
- `AdminLayout.jsx` - Admin dashboard wrapper
- `AdminSidebar.jsx` - Admin navigation sidebar
- `Hero.jsx` - Hero section component

**Common Components:**
- `Spinner.jsx` - Loading indicators
- `Modal.jsx` - Reusable modal dialogs
- `ImageUpload.jsx` - Image upload with preview

#### 3. **Services** (`client/src/services/`)
- `api.js` - Centralized API client with:
  - Axios instance configuration
  - Request/response interceptors
  - JWT token handling
  - Error handling
  - All API endpoint functions

#### 4. **Context** (`client/src/context/`)
- `AuthContext.jsx` - Authentication state management
  - User authentication status
  - Login/logout functions
  - Token management
  - Protected route logic

### Backend Modules

#### 1. **Models** (`server/models/`)
Mongoose schemas defining data structure:

- `Admin.js` - Admin user with hashed password
- `Project.js` - Project with images, status, beneficiaries
- `Team.js` - Team members with roles & photos
- `Contact.js` - Contact form submissions
- `Statistics.js` - Organization statistics
- `Gallery.js` - Gallery images with metadata
- `Service.js` - Service offerings
- `Ministry.js` - Ministry programs
- `HomeContent.js` - Homepage editable content
- `Video.js` - YouTube video links

#### 2. **Controllers** (`server/controllers/`)
Business logic for each entity:

- `authController.js` - Login, JWT generation, password verification
- `projectController.js` - CRUD operations, filtering, search
- `teamController.js` - Team member operations
- `contactController.js` - Form submission, email notifications
- `statisticsController.js` - Stats retrieval & updates
- `galleryController.js` - Image management
- `serviceController.js` - Service operations
- `ministryController.js` - Ministry operations
- `homeContentController.js` - Home content operations
- `videoController.js` - Video link management

#### 3. **Routes** (`server/routes/`)
API endpoint definitions:

**Structure:**
```javascript
router.get('/')       // List all (public)
router.get('/:id')    // Get single (public)
router.post('/')      // Create (protected)
router.put('/:id')    // Update (protected)
router.delete('/:id') // Delete (protected)
```

#### 4. **Middleware** (`server/middleware/`)

- `auth.js` - JWT verification middleware
  ```javascript
  const auth = (req, res, next) => {
    // Verify JWT token
    // Attach user to request
    // Call next() or return 401
  }
  ```

- `errorHandler.js` - Global error handling
  ```javascript
  const errorHandler = (err, req, res, next) => {
    // Log error
    // Send appropriate error response
  }
  ```

- `upload.js` - Multer configuration for file uploads
  ```javascript
  // Disk storage configuration
  // File filter (images only)
  // Size limits
  ```

---

## 🔄 Data Flow & Workflow

### 1. **User Authentication Flow**

```
┌────────────────────────────────────────────────────────────┐
│ 1. Admin enters credentials in Login page                  │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 2. POST /api/auth/login with { email, password }          │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 3. authController.login()                                   │
│    - Find admin by email                                   │
│    - Compare password with bcrypt                          │
│    - Generate JWT token                                    │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 4. Return { token, admin } to client                       │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 5. Client stores token in localStorage                     │
│    AuthContext updates authentication state                │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 6. Subsequent requests include token in Authorization      │
│    header: "Bearer <token>"                                │
└────────────────────────────────────────────────────────────┘
```

### 2. **Project Creation Flow**

```
┌────────────────────────────────────────────────────────────┐
│ 1. Admin fills project form in ProjectManager              │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 2. Upload images (if any)                                  │
│    POST /api/upload → Returns Cloudinary URLs              │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 3. POST /api/projects with form data + image URLs         │
│    (Authorization: Bearer <token>)                         │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 4. auth middleware verifies JWT                            │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 5. projectController.createProject()                       │
│    - Validate input data                                   │
│    - Create new Project document                           │
│    - Save to MongoDB                                       │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 6. Return created project to client                        │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 7. TanStack Query invalidates projects cache               │
│    UI automatically re-fetches and updates                 │
└────────────────────────────────────────────────────────────┘
```

### 3. **Public Page Rendering Flow**

```
┌────────────────────────────────────────────────────────────┐
│ 1. User navigates to /projects                             │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 2. React Router loads Projects.jsx                         │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 3. useQuery hook triggers data fetch                       │
│    GET /api/projects?status=completed                      │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 4. projectController.getProjects()                         │
│    - Parse query parameters                                │
│    - Query MongoDB with filters                            │
│    - Return projects array                                 │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 5. TanStack Query caches response                          │
│    Component receives data and renders                     │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 6. User sees project cards with images                     │
│    Subsequent visits use cached data (if fresh)            │
└────────────────────────────────────────────────────────────┘
```

### 4. **Contact Form Submission Flow**

```
┌────────────────────────────────────────────────────────────┐
│ 1. User fills contact form on Contact page                 │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 2. POST /api/contact with { name, email, message }        │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 3. contactController.submitContact()                       │
│    - Validate input (express-validator)                    │
│    - Save to Contact collection                            │
│    - Send email notification via Nodemailer               │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 4. Return success response                                 │
└─────────────────────┬──────────────────────────────────────┘
                      ▼
┌────────────────────────────────────────────────────────────┐
│ 5. Client shows success toast message                      │
│    Form resets for new submission                          │
└────────────────────────────────────────────────────────────┘
```

---

## 🔌 API Documentation

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-domain.com/api`

### Authentication
Protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### Endpoints Summary

#### **Authentication**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/login` | Public | Admin login |
| POST | `/auth/setup` | Public (one-time) | Create initial admin |

#### **Projects**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/projects` | Public | List all projects |
| GET | `/projects/:id` | Public | Get single project |
| POST | `/projects` | Protected | Create project |
| PUT | `/projects/:id` | Protected | Update project |
| DELETE | `/projects/:id` | Protected | Delete project |

**Query Parameters for GET /projects:**
- `status` - Filter by status (planning, ongoing, completed)
- `type` - Filter by type (borehole, repair, baby_rescue, education)
- `search` - Search in title and description
- `limit` - Results per page (default: 12)
- `page` - Page number

#### **Team**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/team` | Public | List all team members |
| GET | `/team/:id` | Public | Get single member |
| POST | `/team` | Protected | Add member |
| PUT | `/team/:id` | Protected | Update member |
| DELETE | `/team/:id` | Protected | Remove member |

#### **Statistics**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/statistics` | Public | Get statistics |
| PUT | `/statistics/:id` | Protected | Update statistics |

#### **Gallery**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/gallery` | Public | List all images |
| POST | `/gallery` | Protected | Upload image |
| DELETE | `/gallery/:id` | Protected | Delete image |

#### **Services**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/services` | Public | List all services |
| POST | `/services` | Protected | Create service |
| PUT | `/services/:id` | Protected | Update service |
| DELETE | `/services/:id` | Protected | Delete service |

#### **Ministries**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/ministries` | Public | List all ministries |
| POST | `/ministries` | Protected | Create ministry |
| PUT | `/ministries/:id` | Protected | Update ministry |
| DELETE | `/ministries/:id` | Protected | Delete ministry |

#### **Home Content**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/home-content` | Public | Get home content |
| PUT | `/home-content/:id` | Protected | Update home content |

#### **Videos**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/videos` | Public | List all videos |
| GET | `/videos/:id` | Public | Get single video |
| POST | `/videos` | Protected | Add video |
| PUT | `/videos/:id` | Protected | Update video |
| DELETE | `/videos/:id` | Protected | Delete video |

#### **Contact**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/contact` | Public | Submit contact form |
| GET | `/contact` | Protected | List all messages |
| PUT | `/contact/:id` | Protected | Mark as read |
| DELETE | `/contact/:id` | Protected | Delete message |

#### **Upload**
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/upload` | Protected | Upload image to Cloudinary |

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Validation errors if applicable
}
```

---

## 🔐 Authentication & Authorization

### JWT Authentication

**Token Generation:**
```javascript
// In authController.js
const token = jwt.sign(
  { id: admin._id, email: admin.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**Token Verification:**
```javascript
// In middleware/auth.js
const token = req.headers.authorization?.split(' ')[1];
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.admin = decoded;
```

**Client-Side Token Storage:**
```javascript
// In AuthContext.jsx
localStorage.setItem('token', token);

// In api.js (Axios interceptor)
config.headers.Authorization = `Bearer ${token}`;
```

### Protected Routes

**Backend:**
```javascript
router.post('/projects', auth, projectController.createProject);
```

**Frontend:**
```javascript
<Route path="/admin/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

#### 1. **Deploy Workflow** (`.github/workflows/deploy.yml`)
Triggers on push to `main` branch.

**Steps:**
1. Checkout code
2. Set up Node.js
3. Build frontend (Vite)
4. Build backend
5. Build Docker images
6. Push to Docker registry
7. Deploy to VM via SSH
8. Restart containers
9. Health checks

#### 2. **PR Checks** (`.github/workflows/pr-checks.yml`)
Triggers on pull requests.

**Steps:**
1. Lint code
2. Run tests
3. Build verification
4. Security checks

#### 3. **Rollback Workflow** (`.github/workflows/rollback.yml`)
Manual trigger for emergency rollbacks.

**Steps:**
1. Pull previous Docker image version
2. Stop current containers
3. Start previous version
4. Verify health

### Deployment Options

**Option 1: Docker Deployment** (Recommended)
```bash
# On VM
docker-compose -f docker-compose.prod.yml up -d
```

**Option 2: PM2 Deployment**
```bash
# On VM
pm2 start ecosystem.config.js
```

### Environment Variables

**Required for Production:**

**Backend (.env):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_very_secure_secret_key
CLIENT_URL=https://your-frontend-domain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@amenshi4life.org
```

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_DONATION_URL=https://app.clovergive.com/App/Giving/talm10e206
```

---

## 💻 Development Workflow

### 1. **Local Development Setup**

```bash
# Clone repository
git clone <repo-url>
cd amenshi_4_life

# Install backend dependencies
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI

# Install frontend dependencies
cd ../client
npm install
cp .env.example .env
# Edit .env if needed

# Seed database (optional)
cd ../server
node seeder.js
```

### 2. **Running Development Servers**

**Terminal 1 - Backend:**
```bash
cd server
npm run dev  # Uses nodemon for hot reload
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev  # Vite dev server with HMR
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api

### 3. **Development with Docker**

```bash
# Start both services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down
```

### 4. **Code Organization Best Practices**

**Creating a New Feature:**

1. **Backend:**
   ```bash
   # Create model
   server/models/NewFeature.js
   
   # Create controller
   server/controllers/newFeatureController.js
   
   # Create routes
   server/routes/newFeature.js
   
   # Register route in server.js
   app.use('/api/new-feature', require('./routes/newFeature'));
   ```

2. **Frontend:**
   ```bash
   # Create page component
   client/src/pages/NewFeature.jsx
   
   # Create admin manager
   client/src/pages/admin/NewFeatureManager.jsx
   
   # Add API functions
   client/src/services/api.js
   
   # Add routes in App.jsx
   ```

### 5. **Database Seeding**

**Seed all data:**
```bash
cd server
node seeder.js
```

**Seed specific data:**
```bash
node seedProjects.js
node seedServices.js
node seedMinistries.js
node seedHomeContent.js
```

### 6. **Testing**

**Manual Testing Checklist:**
- [ ] Public pages load correctly
- [ ] Admin login works
- [ ] CRUD operations function properly
- [ ] Image uploads work
- [ ] Contact form sends emails
- [ ] Responsive design works on mobile
- [ ] All links work correctly
- [ ] Error handling displays properly

### 7. **Git Workflow**

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
# After review and approval, merge to main
# GitHub Actions will automatically deploy
```

### 8. **Production Build**

**Frontend:**
```bash
cd client
npm run build  # Creates dist/ folder
```

**Backend:**
```bash
cd server
npm start  # Production mode (no nodemon)
```

### 9. **Troubleshooting**

**Common Issues:**

**MongoDB Connection Failed:**
```bash
# Check MongoDB URI in .env
# Ensure IP is whitelisted (MongoDB Atlas)
# Check network connectivity
```

**CORS Errors:**
```bash
# Verify CLIENT_URL in server/.env
# Check VITE_API_URL in client/.env
```

**Image Upload Fails:**
```bash
# Verify Cloudinary credentials
# Check file size limits
# Ensure uploads/ directory exists
```

**JWT Token Expired:**
```bash
# Clear localStorage in browser
# Re-login to get new token
```

---

## 📊 Database Schema Overview

### Collections

1. **admins**
   - email (String, unique)
   - password (String, hashed)
   - name (String)
   - createdAt (Date)

2. **projects**
   - title (String)
   - description (String)
   - type (Enum: borehole, repair, baby_rescue, education)
   - status (Enum: planning, ongoing, completed)
   - location (String)
   - beneficiaries (Number)
   - cost (Number)
   - images (Array of Strings)
   - completionDate (Date)
   - createdAt (Date)

3. **team**
   - name (String)
   - role (String)
   - bio (String)
   - photo (String)
   - email (String)
   - phone (String)
   - socialMedia (Object)
   - order (Number)
   - createdAt (Date)

4. **contacts**
   - name (String)
   - email (String)
   - subject (String)
   - message (String)
   - isRead (Boolean)
   - createdAt (Date)

5. **statistics**
   - boreholesdonated (Number)
   - boreholesrepaired (Number)
   - communities (Number)
   - babies (Number)
   - updatedAt (Date)

6. **gallery**
   - title (String)
   - description (String)
   - imageUrl (String)
   - category (String)
   - order (Number)
   - createdAt (Date)

7. **services**
   - title (String)
   - description (String)
   - icon (String)
   - features (Array of Strings)
   - order (Number)

8. **ministries**
   - title (String)
   - description (String)
   - image (String)
   - features (Array of Strings)
   - order (Number)

9. **homecontents**
   - section (String, unique: hero, mission, vision)
   - title (String)
   - subtitle (String)
   - content (String)
   - image (String)

10. **videos**
    - title (String)
    - description (String)
    - youtubeId (String)
    - thumbnailUrl (String)
    - category (String)
    - featured (Boolean)
    - publishedAt (Date)

---

## 🎯 Key Features Implementation

### 1. **Image Upload System**

**Flow:**
1. User selects image in form
2. Frontend uploads to `/api/upload`
3. Multer receives file
4. Cloudinary API uploads image
5. Returns Cloudinary URL
6. Frontend stores URL in form data
7. URL saved to database with entity

**Code:**
```javascript
// Client-side
const handleImageUpload = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData);
  setImageUrl(response.data.imageUrl);
};
```

### 2. **Search & Filter System**

**Frontend:**
```javascript
const [filters, setFilters] = useState({
  status: 'all',
  type: 'all',
  search: ''
});

const { data } = useQuery(['projects', filters], () =>
  api.getProjects(filters)
);
```

**Backend:**
```javascript
const query = {};
if (status !== 'all') query.status = status;
if (type !== 'all') query.type = type;
if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },
    { description: { $regex: search, $options: 'i' } }
  ];
}
const projects = await Project.find(query);
```

### 3. **Email Notifications**

**Nodemailer Setup:**
```javascript
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
```

**Send Email:**
```javascript
await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: 'admin@amenshi4life.org',
  subject: `New Contact: ${subject}`,
  html: `<p><strong>From:</strong> ${name}</p>
         <p><strong>Email:</strong> ${email}</p>
         <p><strong>Message:</strong> ${message}</p>`
});
```

---

## 📚 Additional Resources

- **MongoDB Documentation:** https://docs.mongodb.com
- **Express.js Documentation:** https://expressjs.com
- **React Documentation:** https://react.dev
- **Vite Documentation:** https://vitejs.dev
- **TanStack Query:** https://tanstack.com/query
- **Tailwind CSS:** https://tailwindcss.com
- **Docker Documentation:** https://docs.docker.com
- **GitHub Actions:** https://docs.github.com/actions

---

## 🙋 Support & Contact

For questions or issues with the codebase:
1. Check existing documentation files
2. Review GitHub Issues
3. Contact: A4L@gmail.com

---

**Last Updated:** December 17, 2025
**Version:** 1.0.0
**Maintained by:** Amenshi 4 Life Development Team
