const Statistics = require('../models/Statistics');

// @desc    Get statistics
// @route   GET /api/statistics
// @access  Public
exports.getStatistics = async (req, res, next) => {
  try {
    let stats = await Statistics.findOne();

    // If no statistics exist, create default
    if (!stats) {
      stats = await Statistics.create({});
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update statistics
// @route   PUT /api/statistics
// @access  Private
exports.updateStatistics = async (req, res, next) => {
  try {
    let stats = await Statistics.findOne();

    if (!stats) {
      stats = await Statistics.create(req.body);
    } else {
      stats = await Statistics.findByIdAndUpdate(
        stats._id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );
    }

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
