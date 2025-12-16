require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS first (before helmet)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Security middleware with relaxed settings for development
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images from different origin
  crossOriginEmbedderPolicy: false,
}));

// Serve uploaded files with CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/team', require('./routes/team'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/services', require('./routes/services'));
app.use('/api/ministries', require('./routes/ministries'));
app.use('/api/home-content', require('./routes/homeContent'));
app.use('/api/videos', require('./routes/videos'));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Amenshi 4 Life API',
    version: '1.0.0',
    endpoints: {
      projects: '/api/projects',
      team: '/api/team',
      statistics: '/api/statistics',
      contact: '/api/contact',
      auth: '/api/auth'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📊 API available at: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at: http://localhost:${PORT}/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌ Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
