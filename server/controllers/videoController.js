const Video = require('../models/Video');

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
exports.getAll = async (req, res, next) => {
    try {
        const { active, category } = req.query;
        
        const filter = {};
        if (active !== undefined) filter.active = active === 'true';
        if (category) filter.category = category;

        const videos = await Video.find(filter).sort({ order: 1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: videos.length,
            data: videos,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single video
// @route   GET /api/videos/:id
// @access  Public
exports.getOne = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found',
            });
        }

        // Increment views
        video.views += 1;
        await video.save();

        res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create video
// @route   POST /api/videos
// @access  Private
exports.create = async (req, res, next) => {
    try {
        const video = await Video.create(req.body);

        res.status(201).json({
            success: true,
            data: video,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private
exports.update = async (req, res, next) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found',
            });
        }

        res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private
exports.delete = async (req, res, next) => {
    try {
        const video = await Video.findByIdAndDelete(req.params.id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: 'Video not found',
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
