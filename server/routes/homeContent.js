const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { get, update } = require('../controllers/homeContentController');

// Public route
router.get('/', get);

// Protected route
router.put('/', protect, update);

module.exports = router;
