const AboutContent = require('../models/AboutContent');

// @desc    Get about page content
// @route   GET /api/about-content
// @access  Public
exports.get = async (req, res, next) => {
    try {
        // Get the first (and should be only) about page content
        let content = await AboutContent.findOne();

        // If no content exists, create default with schema defaults
        if (!content) {
            content = await AboutContent.create({});
        }

        res.status(200).json({
            success: true,
            data: content,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update about page content
// @route   PUT /api/about-content
// @access  Private
exports.update = async (req, res, next) => {
    try {
        // Get or create content
        let content = await AboutContent.findOne();

        if (!content) {
            content = await AboutContent.create(req.body);
        } else {
            content = await AboutContent.findByIdAndUpdate(
                content._id,
                req.body,
                { new: true, runValidators: true }
            );
        }

        res.status(200).json({
            success: true,
            data: content,
        });
    } catch (error) {
        next(error);
    }
};
