const express = require('express');
const {
  submitContact,
  getMessages,
  updateMessageStatus,
  deleteMessage
} = require('../controllers/contactController');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/', submitContact);
router.get('/', protect, getMessages);
router.put('/:id', protect, updateMessageStatus);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
