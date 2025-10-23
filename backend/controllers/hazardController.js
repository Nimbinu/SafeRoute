const { validationResult } = require('express-validator');
const Hazard = require('../models/Hazard');

// @desc    Create a new hazard report
// @route   POST /api/hazards
// @access  Private
exports.createHazard = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { hazardType, description, location, photo, severity } = req.body;

    const hazard = await Hazard.create({
      reportedBy: req.user.id,
      hazardType,
      description,
      location: {
        type: 'Point',
        coordinates: location.coordinates, // [longitude, latitude]
        address: location.address
      },
      photo,
      severity: severity || 'Medium'
    });

    const populatedHazard = await Hazard.findById(hazard._id)
      .populate('reportedBy', 'fullName email');

    res.status(201).json({
      success: true,
      message: 'Hazard reported successfully',
      data: { hazard: populatedHazard }
    });
  } catch (error) {
    console.error('Create hazard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating hazard report',
      error: error.message
    });
  }
};

// @desc    Get all hazards (with filters)
// @route   GET /api/hazards
// @access  Public
exports.getAllHazards = async (req, res) => {
  try {
    const { 
      status, 
      hazardType, 
      severity,
      limit = 50,
      page = 1,
      sortBy = '-createdAt'
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (status) query.status = status;
    if (hazardType) query.hazardType = hazardType;
    if (severity) query.severity = severity;

    // Pagination
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
    console.error('Get hazards error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hazards',
      error: error.message
    });
  }
};

// @desc    Get hazards near location
// @route   GET /api/hazards/nearby
// @access  Public
exports.getNearbyHazards = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Longitude and latitude are required'
      });
    }

    const hazards = await Hazard.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance) // in meters
        }
      }
    })
    .populate('reportedBy', 'fullName email')
    .limit(50);

    res.status(200).json({
      success: true,
      data: { hazards }
    });
  } catch (error) {
    console.error('Get nearby hazards error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby hazards',
      error: error.message
    });
  }
};

// @desc    Get single hazard by ID
// @route   GET /api/hazards/:id
// @access  Public
exports.getHazardById = async (req, res) => {
  try {
    const hazard = await Hazard.findById(req.params.id)
      .populate('reportedBy', 'fullName email')
      .populate('verifiedBy', 'fullName');

    if (!hazard) {
      return res.status(404).json({
        success: false,
        message: 'Hazard not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { hazard }
    });
  } catch (error) {
    console.error('Get hazard by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hazard',
      error: error.message
    });
  }
};

// @desc    Update hazard status (verify/resolve)
// @route   PATCH /api/hazards/:id/status
// @access  Private (Admin/Moderator)
exports.updateHazardStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const hazard = await Hazard.findById(req.params.id);

    if (!hazard) {
      return res.status(404).json({
        success: false,
        message: 'Hazard not found'
      });
    }

    hazard.status = status;

    if (status === 'Verified') {
      hazard.verifiedBy = req.user.id;
      hazard.verifiedAt = new Date();
    }

    if (status === 'Resolved') {
      hazard.resolvedAt = new Date();
    }

    await hazard.save();

    const updatedHazard = await Hazard.findById(hazard._id)
      .populate('reportedBy', 'fullName email')
      .populate('verifiedBy', 'fullName');

    res.status(200).json({
      success: true,
      message: 'Hazard status updated successfully',
      data: { hazard: updatedHazard }
    });
  } catch (error) {
    console.error('Update hazard status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating hazard status',
      error: error.message
    });
  }
};

// @desc    Delete hazard (soft delete)
// @route   DELETE /api/hazards/:id
// @access  Private (Admin or Report Owner)
exports.deleteHazard = async (req, res) => {
  try {
    const hazard = await Hazard.findById(req.params.id);

    if (!hazard) {
      return res.status(404).json({
        success: false,
        message: 'Hazard not found'
      });
    }

    // Check if user is admin or the one who reported
    if (hazard.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this hazard'
      });
    }

    hazard.isActive = false;
    await hazard.save();

    res.status(200).json({
      success: true,
      message: 'Hazard deleted successfully'
    });
  } catch (error) {
    console.error('Delete hazard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hazard',
      error: error.message
    });
  }
};

// @desc    Get user's reported hazards
// @route   GET /api/hazards/my-reports
// @access  Private
exports.getMyReports = async (req, res) => {
  try {
    const hazards = await Hazard.find({ 
      reportedBy: req.user.id,
      isActive: true 
    })
    .sort('-createdAt')
    .populate('verifiedBy', 'fullName');

    res.status(200).json({
      success: true,
      data: { hazards }
    });
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your reports',
      error: error.message
    });
  }
};

// @desc    Get hazard statistics
// @route   GET /api/hazards/stats
// @access  Private (Admin)
exports.getHazardStats = async (req, res) => {
  try {
    const totalReports = await Hazard.countDocuments({ isActive: true });
    const verifiedReports = await Hazard.countDocuments({ status: 'Verified', isActive: true });
    const resolvedReports = await Hazard.countDocuments({ status: 'Resolved', isActive: true });
    const pendingReports = await Hazard.countDocuments({ status: 'Pending', isActive: true });

    const reportsByType = await Hazard.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$hazardType', count: { $sum: 1 } } }
    ]);

    const reportsBySeverity = await Hazard.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalReports,
          verifiedReports,
          resolvedReports,
          pendingReports
        },
        reportsByType,
        reportsBySeverity
      }
    });
  } catch (error) {
    console.error('Get hazard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hazard statistics',
      error: error.message
    });
  }
};
