const path = require('path');
const fs = require('fs').promises;

// @desc    Upload hazard photo
// @route   POST /api/upload/hazard-photo
// @access  Private
exports.uploadHazardPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return the file URL
    const fileUrl = `/uploads/hazards/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      data: {
        filename: req.file.filename,
        url: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading photo',
      error: error.message
    });
  }
};

// @desc    Delete hazard photo
// @route   DELETE /api/upload/hazard-photo/:filename
// @access  Private
exports.deleteHazardPhoto = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads/hazards', filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (err) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete the file
    await fs.unlink(filePath);

    res.status(200).json({
      success: true,
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting photo',
      error: error.message
    });
  }
};

// @desc    Get geolocation suggestions (for autocomplete)
// @route   GET /api/location/search
// @access  Public
exports.searchLocation = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Query must be at least 3 characters'
      });
    }

    // In a real application, you would integrate with Google Places API
    // or another geocoding service. For now, return mock data
    const mockSuggestions = [
      {
        id: '1',
        description: `${query}, Colombo, Sri Lanka`,
        placeId: 'mock_place_1',
        coordinates: [79.8612, 6.9271] // [longitude, latitude]
      },
      {
        id: '2',
        description: `${query} Road, Colombo 07, Sri Lanka`,
        placeId: 'mock_place_2',
        coordinates: [79.8748, 6.9147]
      },
      {
        id: '3',
        description: `${query} Street, Dehiwala, Sri Lanka`,
        placeId: 'mock_place_3',
        coordinates: [79.8650, 6.8521]
      }
    ];

    res.status(200).json({
      success: true,
      data: { suggestions: mockSuggestions }
    });
  } catch (error) {
    console.error('Search location error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching location',
      error: error.message
    });
  }
};

// @desc    Reverse geocode coordinates to address
// @route   GET /api/location/reverse
// @access  Public
exports.reverseGeocode = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // In a real application, you would use Google Geocoding API
    // For now, return mock data
    const mockAddress = {
      formattedAddress: `${latitude}, ${longitude} - Sample Location, Colombo, Sri Lanka`,
      street: 'Galle Road',
      city: 'Colombo',
      state: 'Western Province',
      country: 'Sri Lanka',
      postalCode: '00300',
      coordinates: [parseFloat(longitude), parseFloat(latitude)]
    };

    res.status(200).json({
      success: true,
      data: { address: mockAddress }
    });
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reverse geocoding',
      error: error.message
    });
  }
};

// @desc    Get current location info (IP-based or GPS)
// @route   GET /api/location/current
// @access  Public
exports.getCurrentLocation = async (req, res) => {
  try {
    // In a real application, you might use IP geolocation service
    // For now, return mock data for Colombo, Sri Lanka
    const mockLocation = {
      latitude: 6.9271,
      longitude: 79.8612,
      accuracy: 100, // meters
      city: 'Colombo',
      country: 'Sri Lanka',
      formattedAddress: 'Colombo, Western Province, Sri Lanka'
    };

    res.status(200).json({
      success: true,
      data: { location: mockLocation }
    });
  } catch (error) {
    console.error('Get current location error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting current location',
      error: error.message
    });
  }
};

// @desc    Validate hazard report data
// @route   POST /api/upload/validate-hazard
// @access  Private
exports.validateHazardReport = async (req, res) => {
  try {
    const { hazardType, description, location } = req.body;
    const errors = [];

    // Validate hazard type
    const validTypes = ['Pothole', 'Debris', 'Flooding', 'Ice', 'Accident', 'Road Closure', 'Construction', 'Broken Traffic Light', 'Other'];
    if (!hazardType || !validTypes.includes(hazardType)) {
      errors.push('Invalid hazard type');
    }

    // Validate description
    if (!description || description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }
    if (description && description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }

    // Validate location
    if (!location || !location.coordinates || location.coordinates.length !== 2) {
      errors.push('Valid location coordinates are required');
    }
    if (!location || !location.address) {
      errors.push('Location address is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(200).json({
      success: true,
      message: 'Validation passed'
    });
  } catch (error) {
    console.error('Validate hazard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating hazard report',
      error: error.message
    });
  }
};
