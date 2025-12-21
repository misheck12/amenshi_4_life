const express = require('express');
const router = express.Router();
const {
    subscribe,
    unsubscribe,
    getSubscribers,
    sendBroadcast
} = require('../controllers/subscriberController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/', getSubscribers);
router.post('/broadcast', sendBroadcast);

module.exports = router;
