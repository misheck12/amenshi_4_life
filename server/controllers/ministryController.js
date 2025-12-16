const Ministry = require('../models/Ministry');

// @desc    Get all ministries
// @route   GET /api/ministries
// @access  Public
exports.getAll = async (req, res, next) => {
    try {
        const { active } = req.query;
        
        const filter = {};
        if (active !== undefined) filter.active = active === 'true';

        const ministries = await Ministry.find(filter).sort({ order: 1 });

        res.status(200).json({
            success: true,
            count: ministries.length,
            data: ministries,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single ministry
// @route   GET /api/ministries/:id
// @access  Public
exports.getOne = async (req, res, next) => {
    try {
        const ministry = await Ministry.findById(req.params.id);

        if (!ministry) {
            return res.status(404).json({
                success: false,
                message: 'Ministry not found',
            });
        }

        res.status(200).json({
            success: true,
            data: ministry,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create ministry
// @route   POST /api/ministries
// @access  Private
exports.create = async (req, res, next) => {
    try {
        const ministry = await Ministry.create(req.body);

        res.status(201).json({
            success: true,
            data: ministry,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update ministry
// @route   PUT /api/ministries/:id
// @access  Private
exports.update = async (req, res, next) => {
    try {
        const ministry = await Ministry.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!ministry) {
            return res.status(404).json({
                success: false,
                message: 'Ministry not found',
            });
        }

        res.status(200).json({
            success: true,
            data: ministry,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete ministry
// @route   DELETE /api/ministries/:id
// @access  Private
exports.delete = async (req, res, next) => {
    try {
        const ministry = await Ministry.findByIdAndDelete(req.params.id);

        if (!ministry) {
            return res.status(404).json({
                success: false,
                message: 'Ministry not found',
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
