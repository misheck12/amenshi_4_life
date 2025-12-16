const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getFeaturedProjects
} = require('../controllers/projectController');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.route('/featured').get(getFeaturedProjects);

router
  .route('/')
  .get(getProjects)
  .post(protect, createProject);

router
  .route('/:id')
  .get(getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
