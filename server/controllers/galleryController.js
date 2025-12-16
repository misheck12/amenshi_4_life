const Gallery = require('../models/Gallery');

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
exports.getAll = async (req, res, next) => {
    try {
        const { category } = req.query;
        
        const filter = {};
        if (category) filter.category = category;

        const images = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: images.length,
            data: images,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create gallery image
// @route   POST /api/gallery
// @access  Private
exports.create = async (req, res, next) => {
    try {
        const image = await Gallery.create(req.body);

        res.status(201).json({
            success: true,
            data: image,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private
exports.update = async (req, res, next) => {
    try {
        const image = await Gallery.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
            });
        }

        res.status(200).json({
            success: true,
            data: image,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private
exports.delete = async (req, res, next) => {
    try {
        const image = await Gallery.findByIdAndDelete(req.params.id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found',
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
