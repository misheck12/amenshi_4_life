const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    getAll,
    getOne,
    create,
    update,
    delete: deleteService,
} = require('../controllers/serviceController');

// Public routes
router.get('/', getAll);
router.get('/:id', getOne);

// Protected routes
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteService);

module.exports = router;
