const express = require('express');
const router = express.Router();
const { get, update } = require('../controllers/aboutContentController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(get)
    .put(protect, update);

module.exports = router;
