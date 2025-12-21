const Story = require('../models/Story');

// @desc    Get all stories (public: published only, admin: all)
// @route   GET /api/stories
// @access  Public
exports.getStories = async (req, res, next) => {
    try {
        let query;

        // If admin (checked via middleware usually, but here we filter by status query param or show published by default)
        // Ideally, we'd check req.user.role, but let's keep it simple: Public API defaults to published
        
        // Copy req.query
        const reqQuery = { ...req.query };
        
        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);
        
        // Create query string
        let queryStr = JSON.stringify(reqQuery);
        
        // Finding resource
        query = Story.find(JSON.parse(queryStr));
        
        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }
        
        const stories = await query;
        
        res.status(200).json({
            success: true,
            count: stories.length,
            data: stories
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single story
// @route   GET /api/stories/:idOrSlug
// @access  Public
exports.getStory = async (req, res, next) => {
    try {
        const { idOrSlug } = req.params;
        let story;

        if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
             story = await Story.findById(idOrSlug);
        } else {
             story = await Story.findOne({ slug: idOrSlug });
        }

        if (!story) {
            return res.status(404).json({ success: false, message: 'Story not found' });
        }

        res.status(200).json({
            success: true,
            data: story
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create story
// @route   POST /api/stories
// @access  Private (Admin)
exports.createStory = async (req, res, next) => {
    try {
        const story = await Story.create(req.body);
        res.status(201).json({
            success: true,
            data: story
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update story
// @route   PUT /api/stories/:id
// @access  Private (Admin)
exports.updateStory = async (req, res, next) => {
    try {
        let story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ success: false, message: 'Story not found' });
        }

        story = await Story.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: story
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private (Admin)
exports.deleteStory = async (req, res, next) => {
    try {
        const story = await Story.findById(req.params.id);

        if (!story) {
            return res.status(404).json({ success: false, message: 'Story not found' });
        }

        await story.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
