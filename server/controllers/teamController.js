const Team = require('../models/Team');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
exports.getTeamMembers = async (req, res, next) => {
  try {
    const team = await Team.find().sort('order');

    res.status(200).json({
      success: true,
      count: team.length,
      data: team
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
// @access  Public
exports.getTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team member
// @route   POST /api/team
// @access  Private
exports.createTeamMember = async (req, res, next) => {
  try {
    const member = await Team.create(req.body);

    res.status(201).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
// @access  Private
exports.updateTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
// @access  Private
exports.deleteTeamMember = async (req, res, next) => {
  try {
    const member = await Team.findByIdAndDelete(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
