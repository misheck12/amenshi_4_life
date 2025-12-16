const express = require('express');
const {
  getTeamMembers,
  getTeamMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');

const router = express.Router();
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(getTeamMembers)
  .post(protect, createTeamMember);

router
  .route('/:id')
  .get(getTeamMember)
  .put(protect, updateTeamMember)
  .delete(protect, deleteTeamMember);

module.exports = router;
