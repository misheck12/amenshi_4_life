const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getAll = async (req, res, next) => {
    try {
        const { active } = req.query;
        
        const filter = {};
        if (active !== undefined) filter.active = active === 'true';

        const services = await Service.find(filter).sort({ order: 1 });

        res.status(200).json({
            success: true,
            count: services.length,
            data: services,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getOne = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private
exports.create = async (req, res, next) => {
    try {
        const service = await Service.create(req.body);

        res.status(201).json({
            success: true,
            data: service,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
exports.update = async (req, res, next) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private
exports.delete = async (req, res, next) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
