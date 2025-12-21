const Volunteer = require('../models/Volunteer');
const { createTransporter } = require('./contactController'); // Reuse or import logic

// @desc    Submit volunteer application
// @route   POST /api/volunteers
// @access  Public
exports.applyVolunteer = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.create(req.body);

        // Send confirmation email (optional, reusing similar logic to contact)
        // For now, just save
        
        res.status(201).json({
            success: true,
            data: volunteer,
            message: 'Application received! We will be in touch soon.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private (Admin)
exports.getVolunteers = async (req, res, next) => {
    try {
        const volunteers = await Volunteer.find().sort('-createdAt');
        res.status(200).json({
            success: true,
            count: volunteers.length,
            data: volunteers
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update volunteer status
// @route   PUT /api/volunteers/:id
// @access  Private (Admin)
exports.updateVolunteerStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, { status }, { new: true });
        
        if (!volunteer) {
            return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }

        res.status(200).json({
            success: true,
            data: volunteer
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private (Admin)
exports.deleteVolunteer = async (req, res, next) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
             return res.status(404).json({ success: false, message: 'Volunteer not found' });
        }
        await volunteer.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
