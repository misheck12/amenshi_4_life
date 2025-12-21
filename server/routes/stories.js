const express = require('express');
const router = express.Router();
const {
    getStories,
    getStory,
    createStory,
    updateStory,
    deleteStory
} = require('../controllers/storyController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getStories)
    .post(protect, authorize('admin', 'superadmin'), createStory);

router.route('/:idOrSlug')
    .get(getStory) // Public access for reading single story
    .put(protect, authorize('admin', 'superadmin'), updateStory)
    .delete(protect, authorize('admin', 'superadmin'), deleteStory);

module.exports = router;
