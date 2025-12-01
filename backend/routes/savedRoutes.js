const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavedRoute = require('../models/SavedRoute');

// @route   GET /api/saved-routes
// @desc    Get all saved routes for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const savedRoutes = await SavedRoute.find({ user: req.user.id })
      .sort({ isFavorite: -1, lastUsed: -1 });

    res.json({
      success: true,
      count: savedRoutes.length,
      data: savedRoutes
    });
  } catch (error) {
    console.error('Error fetching saved routes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved routes',
      error: error.message
    });
  }
});

// @route   GET /api/saved-routes/:id
// @desc    Get a specific saved route
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const savedRoute = await SavedRoute.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!savedRoute) {
      return res.status(404).json({
        success: false,
        message: 'Saved route not found'
      });
    }

    // Update usage count and last used
    savedRoute.usageCount += 1;
    savedRoute.lastUsed = Date.now();
    await savedRoute.save();

    res.json({
      success: true,
      data: savedRoute
    });
  } catch (error) {
    console.error('Error fetching saved route:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved route',
      error: error.message
    });
  }
});

// @route   POST /api/saved-routes
// @desc    Save a new route
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      routeName,
      startLocation,
      endLocation,
      routeData,
      preferredRouteType
    } = req.body;

    // Validation
    if (!routeName || !startLocation || !endLocation) {
      return res.status(400).json({
        success: false,
        message: 'Please provide route name, start location, and end location'
      });
    }

    // Check if route with same name already exists for this user
    const existingRoute = await SavedRoute.findOne({
      user: req.user.id,
      routeName: routeName.trim()
    });

    if (existingRoute) {
      return res.status(400).json({
        success: false,
        message: 'You already have a saved route with this name. Please choose a different name.'
      });
    }

    const savedRoute = await SavedRoute.create({
      user: req.user.id,
      routeName: routeName.trim(),
      startLocation,
      endLocation,
      routeData,
      preferredRouteType: preferredRouteType || 'safest'
    });

    res.status(201).json({
      success: true,
      message: 'Route saved successfully',
      data: savedRoute
    });
  } catch (error) {
    console.error('Error saving route:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving route',
      error: error.message
    });
  }
});

// @route   PUT /api/saved-routes/:id
// @desc    Update a saved route
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { routeName, preferredRouteType, isFavorite } = req.body;

    const savedRoute = await SavedRoute.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!savedRoute) {
      return res.status(404).json({
        success: false,
        message: 'Saved route not found'
      });
    }

    // Update fields
    if (routeName !== undefined) savedRoute.routeName = routeName.trim();
    if (preferredRouteType !== undefined) savedRoute.preferredRouteType = preferredRouteType;
    if (isFavorite !== undefined) savedRoute.isFavorite = isFavorite;

    await savedRoute.save();

    res.json({
      success: true,
      message: 'Route updated successfully',
      data: savedRoute
    });
  } catch (error) {
    console.error('Error updating saved route:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating route',
      error: error.message
    });
  }
});

// @route   DELETE /api/saved-routes/:id
// @desc    Delete a saved route
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const savedRoute = await SavedRoute.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!savedRoute) {
      return res.status(404).json({
        success: false,
        message: 'Saved route not found'
      });
    }

    await savedRoute.deleteOne();

    res.json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting saved route:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting route',
      error: error.message
    });
  }
});

module.exports = router;
