const express = require('express');
const path = require('path');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get base URL from environment or default to localhost
const getBaseUrl = (req) => {
  // Use environment variable if set, otherwise construct from request
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  return baseUrl;
};

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    // Return full URL including protocol and host
    const baseUrl = getBaseUrl(req);
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        filename: req.file.filename,
        path: imageUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private
router.post('/multiple', protect, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    const baseUrl = getBaseUrl(req);
    const images = req.files.map(file => ({
      filename: file.filename,
      path: `${baseUrl}/uploads/${file.filename}`,
      size: file.size
    }));

    res.status(200).json({
      success: true,
      message: `${images.length} images uploaded successfully`,
      data: images
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images',
      error: error.message
    });
  }
});

module.exports = router;
