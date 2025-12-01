const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavedLocation = require('../models/SavedLocation');

// @route   GET /api/saved-locations
// @desc    Get all saved locations for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { category } = req.query;
    
    const query = { user: req.user.id };
    if (category) {
      query.category = category;
    }

    const savedLocations = await SavedLocation.find(query)
      .sort({ isFavorite: -1, lastUsed: -1 });

    res.json({
      success: true,
      count: savedLocations.length,
      data: savedLocations
    });
  } catch (error) {
    console.error('Error fetching saved locations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved locations',
      error: error.message
    });
  }
});

// @route   GET /api/saved-locations/:id
// @desc    Get a specific saved location
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const savedLocation = await SavedLocation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!savedLocation) {
      return res.status(404).json({
        success: false,
        message: 'Saved location not found'
      });
    }

    // Update usage count and last used
    savedLocation.usageCount += 1;
    savedLocation.lastUsed = Date.now();
    await savedLocation.save();

    res.json({
      success: true,
      data: savedLocation
    });
  } catch (error) {
    console.error('Error fetching saved location:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved location',
      error: error.message
    });
  }
});

// @route   POST /api/saved-locations
// @desc    Save a new location
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      locationName,
      address,
      coordinates,
      category,
      icon,
      notes
    } = req.body;

    // Validation
    if (!locationName || !address || !coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Please provide location name, address, and coordinates'
      });
    }

    if (!coordinates.lat || !coordinates.lng) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    // Check if location with same name already exists for this user
    const existingLocation = await SavedLocation.findOne({
      user: req.user.id,
      locationName: locationName.trim()
    });

    if (existingLocation) {
      return res.status(400).json({
        success: false,
        message: 'You already have a saved location with this name. Please choose a different name.'
      });
    }

    const savedLocation = await SavedLocation.create({
      user: req.user.id,
      locationName: locationName.trim(),
      address,
      coordinates,
      category: category || 'Other',
      icon: icon || '📍',
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Location saved successfully',
      data: savedLocation
    });
  } catch (error) {
    console.error('Error saving location:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving location',
      error: error.message
    });
  }
});

// @route   PUT /api/saved-locations/:id
// @desc    Update a saved location
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { locationName, category, icon, notes, isFavorite } = req.body;

    const savedLocation = await SavedLocation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!savedLocation) {
      return res.status(404).json({
        success: false,
        message: 'Saved location not found'
      });
    }

    // Update fields
    if (locationName !== undefined) savedLocation.locationName = locationName.trim();
    if (category !== undefined) savedLocation.category = category;
    if (icon !== undefined) savedLocation.icon = icon;
    if (notes !== undefined) savedLocation.notes = notes;
    if (isFavorite !== undefined) savedLocation.isFavorite = isFavorite;

    await savedLocation.save();

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: savedLocation
    });
  } catch (error) {
    console.error('Error updating saved location:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message
    });
  }
});

// @route   DELETE /api/saved-locations/:id
// @desc    Delete a saved location
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const savedLocation = await SavedLocation.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!savedLocation) {
      return res.status(404).json({
        success: false,
        message: 'Saved location not found'
      });
    }

    await savedLocation.deleteOne();

    res.json({
      success: true,
      message: 'Location deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting saved location:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting location',
      error: error.message
    });
  }
});

module.exports = router;
