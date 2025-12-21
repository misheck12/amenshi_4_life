const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, testEmail } = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and for admin only
router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.route('/')
    .get(getSettings)
    .put(updateSettings);

router.post('/test-email', testEmail);

module.exports = router;
