const express = require('express');
const router = express.Router();
const {
    applyVolunteer,
    getVolunteers,
    updateVolunteerStatus,
    deleteVolunteer
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', applyVolunteer);

router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/', getVolunteers);
router.route('/:id')
    .put(updateVolunteerStatus)
    .delete(deleteVolunteer);

module.exports = router;
