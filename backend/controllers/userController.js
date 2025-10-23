const { validationResult } = require('express-validator');
const User = require('../models/User');
const Hazard = require('../models/Hazard');
const Route = require('../models/Route');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const totalReports = await Hazard.countDocuments({
      reportedBy: req.user.id,
      isActive: true
    });

    const verifiedReports = await Hazard.countDocuments({
      reportedBy: req.user.id,
      status: 'Verified',
      isActive: true
    });

    const totalRoutes = await Route.countDocuments({
      user: req.user.id,
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          totalReports,
          verifiedReports,
          totalRoutes
        }
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { fullName, email, currentPassword, newPassword } = req.body;

    // Update basic info
    if (fullName) user.fullName = fullName;

    // Check if email is being updated
    if (email && email !== user.email) {
      // Check if email already exists
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
      user.email = email;
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const userWithPassword = await User.findById(req.user.id).select('+password');
      const isMatch = await userWithPassword.comparePassword(currentPassword);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
exports.deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete by deactivating account
    user.isActive = false;
    await user.save();

    // Also deactivate user's hazard reports
    await Hazard.updateMany(
      { reportedBy: req.user.id },
      { isActive: false }
    );

    // Deactivate user's routes
    await Route.updateMany(
      { user: req.user.id },
      { isActive: false }
    );

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete user account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user account',
      error: error.message
    });
  }
};

// @desc    Get user's hazard reports
// @route   GET /api/users/my-hazards
// @access  Private
exports.getUserHazards = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const query = {
      reportedBy: req.user.id,
      isActive: true
    };

    if (status) {
      query.status = status;
    }

    const hazards = await Hazard.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip)
      .populate('verifiedBy', 'fullName');

    const total = await Hazard.countDocuments(query);

    // Get counts by status
    const pendingCount = await Hazard.countDocuments({
      reportedBy: req.user.id,
      status: 'Pending',
      isActive: true
    });

    const verifiedCount = await Hazard.countDocuments({
      reportedBy: req.user.id,
      status: 'Verified',
      isActive: true
    });

    const resolvedCount = await Hazard.countDocuments({
      reportedBy: req.user.id,
      status: 'Resolved',
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        hazards,
        counts: {
          pending: pendingCount,
          verified: verifiedCount,
          resolved: resolvedCount,
          total
        },
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user hazards error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user hazards',
      error: error.message
    });
  }
};

// @desc    Get user's activity summary
// @route   GET /api/users/activity
// @access  Private
exports.getUserActivity = async (req, res) => {
  try {
    // Get recent hazard reports
    const recentHazards = await Hazard.find({
      reportedBy: req.user.id,
      isActive: true
    })
    .sort('-createdAt')
    .limit(5)
    .select('hazardType status createdAt location.address');

    // Get recent routes
    const recentRoutes = await Route.find({
      user: req.user.id,
      isActive: true
    })
    .sort('-createdAt')
    .limit(5)
    .select('origin.address destination.address selectedRoute createdAt');

    // Get monthly report count
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyReports = await Hazard.countDocuments({
      reportedBy: req.user.id,
      isActive: true,
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        recentHazards,
        recentRoutes,
        monthlyReports
      }
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user activity',
      error: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PATCH /api/users/preferences
// @access  Private
exports.updateUserPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { preferences } = req.body;

    // Initialize preferences if not exists
    if (!user.preferences) {
      user.preferences = {};
    }

    // Update preferences
    user.preferences = {
      ...user.preferences,
      ...preferences
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: user.preferences }
    });
  } catch (error) {
    console.error('Update user preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
};

// @desc    Get user by ID (for admin)
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user statistics
    const totalReports = await Hazard.countDocuments({
      reportedBy: req.params.id,
      isActive: true
    });

    const verifiedReports = await Hazard.countDocuments({
      reportedBy: req.params.id,
      status: 'Verified',
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          totalReports,
          verifiedReports
        }
      }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Get all users (for admin)
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Update user role (for admin)
// @route   PATCH /api/users/:id/role
// @access  Private (Admin)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message
    });
  }
};

// @desc    Toggle user active status (for admin)
// @route   PATCH /api/users/:id/status
// @access  Private (Admin)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};
