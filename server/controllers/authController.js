const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password'
      });
    }

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create first admin (one-time setup)
// @route   POST /api/auth/setup
// @access  Public (but should be removed after first use)
exports.setupAdmin = async (req, res, next) => {
  try {
    // Check if any admin exists
    const adminExists = await Admin.findOne();

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists. This endpoint is disabled.'
      });
    }

    const admin = await Admin.create({
      name: req.body.name || 'Super Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'super-admin'
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('+password');

    // Check current password
    if (!(await admin.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    admin.password = req.body.newPassword;
    await admin.save();

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    next(error);
  }
};
