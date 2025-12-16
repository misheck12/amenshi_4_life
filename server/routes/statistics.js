const express = require('express');
const {
  getStatistics,
  updateStatistics
} = require('../controllers/statisticsController');

const router = express.Router();
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(getStatistics)
  .put(protect, updateStatistics);

module.exports = router;
