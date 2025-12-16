const express = require('express');
const {
  login,
  getMe,
  setupAdmin,
  updatePassword
} = require('../controllers/authController');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/setup', setupAdmin);  // Remove this route after first admin setup
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
