const User = require('../models/User');
const Hazard = require('../models/Hazard');
const Route = require('../models/Route');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin/Moderator)
exports.getDashboardStats = async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments({ isActive: true });
    const newUsersToday = await User.countDocuments({
      isActive: true,
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersThisWeek = await User.countDocuments({
      isActive: true,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Hazard statistics
    const totalHazards = await Hazard.countDocuments({ isActive: true });
    const pendingHazards = await Hazard.countDocuments({
      status: 'Pending',
      isActive: true
    });
    const verifiedHazards = await Hazard.countDocuments({
      status: 'Verified',
      isActive: true
    });
    const resolvedHazards = await Hazard.countDocuments({
      status: 'Resolved',
      isActive: true
    });

    // Recent hazards
    const recentHazards = await Hazard.countDocuments({
      isActive: true,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Route statistics
    const totalRoutes = await Route.countDocuments({ isActive: true });
    const routesThisWeek = await Route.countDocuments({
      isActive: true,
      createdAt: { $gte: sevenDaysAgo }
    });

    // Hazards by type
    const hazardsByType = await Hazard.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$hazardType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Hazards by severity
    const hazardsBySeverity = await Hazard.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Top reporters
    const topReporters = await Hazard.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$reportedBy', reportCount: { $sum: 1 } } },
      { $sort: { reportCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          reportCount: 1,
          fullName: '$user.fullName',
          email: '$user.email'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          byRole: usersByRole
        },
        hazards: {
          total: totalHazards,
          pending: pendingHazards,
          verified: verifiedHazards,
          resolved: resolvedHazards,
          recentWeek: recentHazards,
          byType: hazardsByType,
          bySeverity: hazardsBySeverity
        },
        routes: {
          total: totalRoutes,
          thisWeek: routesThisWeek
        },
        topReporters
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get all hazard reports for admin
// @route   GET /api/admin/hazards
// @access  Private (Admin/Moderator)
exports.getAllHazardReports = async (req, res) => {
  try {
    const {
      status,
      hazardType,
      severity,
      sortBy = '-createdAt',
      limit = 20,
      page = 1
    } = req.query;

    const query = { isActive: true };

    if (status) query.status = status;
    if (hazardType) query.hazardType = hazardType;
    if (severity) query.severity = severity;

    const skip = (page - 1) * limit;

    const hazards = await Hazard.find(query)
      .populate('reportedBy', 'fullName email')
      .populate('verifiedBy', 'fullName')
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Hazard.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        hazards,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all hazard reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hazard reports',
      error: error.message
    });
  }
};

// @desc    Get all users for admin
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const {
      role,
      isActive,
      sortBy = '-createdAt',
      limit = 20,
      page = 1,
      search
    } = req.query;

    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    // Search by name or email
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    // Get report counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const reportCount = await Hazard.countDocuments({
          reportedBy: user._id,
          isActive: true
        });
        
        return {
          ...user.toObject(),
          reportCount
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        users: usersWithStats,
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

// @desc    Verify hazard report
// @route   PATCH /api/admin/hazards/:id/verify
// @access  Private (Admin/Moderator)
exports.verifyHazard = async (req, res) => {
  try {
    const hazard = await Hazard.findById(req.params.id);

    if (!hazard) {
      return res.status(404).json({
        success: false,
        message: 'Hazard not found'
      });
    }

    hazard.status = 'Verified';
    hazard.verifiedBy = req.user.id;
    hazard.verifiedAt = new Date();

    await hazard.save();

    const updatedHazard = await Hazard.findById(hazard._id)
      .populate('reportedBy', 'fullName email')
      .populate('verifiedBy', 'fullName');

    res.status(200).json({
      success: true,
      message: 'Hazard verified successfully',
      data: { hazard: updatedHazard }
    });
  } catch (error) {
    console.error('Verify hazard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying hazard',
      error: error.message
    });
  }
};

// @desc    Resolve hazard report
// @route   PATCH /api/admin/hazards/:id/resolve
// @access  Private (Admin/Moderator)
exports.resolveHazard = async (req, res) => {
  try {
    const hazard = await Hazard.findById(req.params.id);

    if (!hazard) {
      return res.status(404).json({
        success: false,
        message: 'Hazard not found'
      });
    }

    hazard.status = 'Resolved';
    hazard.resolvedAt = new Date();

    await hazard.save();

    const updatedHazard = await Hazard.findById(hazard._id)
      .populate('reportedBy', 'fullName email')
      .populate('verifiedBy', 'fullName');

    res.status(200).json({
      success: true,
      message: 'Hazard resolved successfully',
      data: { hazard: updatedHazard }
    });
  } catch (error) {
    console.error('Resolve hazard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resolving hazard',
      error: error.message
    });
  }
};

// @desc    Reject/Delete hazard report
// @route   DELETE /api/admin/hazards/:id
// @access  Private (Admin/Moderator)
exports.deleteHazardReport = async (req, res) => {
  try {
    const hazard = await Hazard.findById(req.params.id);

    if (!hazard) {
      return res.status(404).json({
        success: false,
        message: 'Hazard not found'
      });
    }

    hazard.isActive = false;
    await hazard.save();

    res.status(200).json({
      success: true,
      message: 'Hazard report deleted successfully'
    });
  } catch (error) {
    console.error('Delete hazard report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hazard report',
      error: error.message
    });
  }
};

// @desc    Ban/Unban user
// @route   PATCH /api/admin/users/:id/ban
// @access  Private (Admin)
exports.toggleUserBan = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from banning themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot ban yourself'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'unbanned' : 'banned'} successfully`,
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Toggle user ban error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: error.message
    });
  }
};

// @desc    Change user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private (Admin)
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
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
    console.error('Change user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing user role',
      error: error.message
    });
  }
};

// @desc    Get system activity logs
// @route   GET /api/admin/activity
// @access  Private (Admin/Moderator)
exports.getSystemActivity = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Get recent user registrations
    const recentUsers = await User.find({ isActive: true })
      .sort('-createdAt')
      .limit(10)
      .select('fullName email role createdAt');

    // Get recent hazard reports
    const recentHazards = await Hazard.find({ isActive: true })
      .sort('-createdAt')
      .limit(20)
      .populate('reportedBy', 'fullName email')
      .select('hazardType status severity createdAt location.address');

    // Get recently verified hazards
    const recentVerifications = await Hazard.find({
      status: 'Verified',
      isActive: true
    })
      .sort('-verifiedAt')
      .limit(10)
      .populate('reportedBy', 'fullName')
      .populate('verifiedBy', 'fullName')
      .select('hazardType verifiedAt');

    // Get recently resolved hazards
    const recentResolutions = await Hazard.find({
      status: 'Resolved',
      isActive: true
    })
      .sort('-resolvedAt')
      .limit(10)
      .populate('reportedBy', 'fullName')
      .select('hazardType resolvedAt');

    res.status(200).json({
      success: true,
      data: {
        recentUsers,
        recentHazards,
        recentVerifications,
        recentResolutions
      }
    });
  } catch (error) {
    console.error('Get system activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching system activity',
      error: error.message
    });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin/Moderator)
exports.getAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Daily hazard reports
    const dailyReports = await Hazard.aggregate([
      {
        $match: {
          isActive: true,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily new users
    const dailyUsers = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Hazard status distribution
    const statusDistribution = await Hazard.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        dailyReports,
        dailyUsers,
        statusDistribution
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};
