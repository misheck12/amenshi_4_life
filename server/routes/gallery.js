const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getAll,
    create,
    update,
    delete: deleteImage,
} = require('../controllers/galleryController');

// Public routes
router.get('/', getAll);

// Protected routes
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteImage);

module.exports = router;
