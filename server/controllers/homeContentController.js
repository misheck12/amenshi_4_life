const HomeContent = require('../models/HomeContent');

// @desc    Get homepage content
// @route   GET /api/home-content
// @access  Public
exports.get = async (req, res, next) => {
    try {
        // Get the first (and should be only) homepage content
        let content = await HomeContent.findOne();

        // If no content exists, create default
        if (!content) {
            content = await HomeContent.create({
                heroQuote: 'Thousands have lived without love, not one without water.',
                heroAuthor: 'H. Auden',
                heroDescription: 'We are a non-profit ministry serving needs for clean water and care for abandoned babies in Zambia, Africa.',
                heroImage: '/images/hero-bg.jpg',
                aboutLabel: 'This is us',
                aboutHeading: 'We believe in the power of giving',
                aboutParagraph1: 'Amenshi 4 Life is dedicated to bringing clean, safe drinking water to communities in need around the world. We believe that access to clean water is a basic human right and are committed to working towards a future where everyone has access to this vital resource.',
                aboutParagraph2: 'Over the years, we have partnered with local organizations and communities to implement a range of water projects, including drilling and repairing wells. In addition to our water projects, we also prioritize education and awareness-raising about the importance of clean water.',
                aboutImage: '/images/about-us.jpg',
            });
        }

        res.status(200).json({
            success: true,
            data: content,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update homepage content
// @route   PUT /api/home-content
// @access  Private
exports.update = async (req, res, next) => {
    try {
        // Get or create content
        let content = await HomeContent.findOne();

        if (!content) {
            content = await HomeContent.create(req.body);
        } else {
            content = await HomeContent.findByIdAndUpdate(
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
