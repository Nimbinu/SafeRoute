const { validationResult } = require('express-validator');
const Route = require('../models/Route');
const Hazard = require('../models/Hazard');

// Helper function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Helper function to check if a point is near a route
const isPointNearRoute = (point, routePoints, threshold = 100) => {
  // threshold in meters
  for (const routePoint of routePoints) {
    const distance = calculateDistance(
      point[1], point[0],
      routePoint[1], routePoint[0]
    );
    if (distance <= threshold) {
      return true;
    }
  }
  return false;
};

// Helper function to calculate safety score
const calculateSafetyScore = (hazards) => {
  if (hazards.length === 0) return 100;

  let score = 100;
  
  hazards.forEach(hazard => {
    // Deduct points based on severity
    switch (hazard.severity) {
      case 'Critical':
        score -= 20;
        break;
      case 'High':
        score -= 15;
        break;
      case 'Medium':
        score -= 10;
        break;
      case 'Low':
        score -= 5;
        break;
    }
  });

  return Math.max(0, score); // Ensure score doesn't go below 0
};

// @desc    Calculate route with safety analysis
// @route   POST /api/routes/calculate
// @access  Private
exports.calculateRoute = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { origin, destination } = req.body;

    // In a real application, you would call Google Maps Directions API here
    // For now, we'll create mock route data
    
    // Get hazards along potential routes (within 5km radius of origin and destination)
    const midLat = (origin.coordinates[1] + destination.coordinates[1]) / 2;
    const midLon = (origin.coordinates[0] + destination.coordinates[0]) / 2;

    let nearbyHazards = [];
    try {
      // Try to use geospatial query
      nearbyHazards = await Hazard.find({
        isActive: true,
        status: { $in: ['Pending', 'Verified'] },
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [midLon, midLat]
            },
            $maxDistance: 5000 // 5km
          }
        }
      })
      .limit(50)
      .populate('reportedBy', 'fullName')
      .maxTimeMS(5000); // 5 second timeout
    } catch (geoError) {
      console.warn('Geospatial query failed, falling back to simple query:', geoError.message);
      // Fallback to simple query without geospatial index
      nearbyHazards = await Hazard.find({
        isActive: true,
        status: { $in: ['Pending', 'Verified'] }
      })
      .limit(50)
      .populate('reportedBy', 'fullName');
    }

    // Calculate approximate distance between origin and destination
    const totalDistance = calculateDistance(
      origin.coordinates[1],
      origin.coordinates[0],
      destination.coordinates[1],
      destination.coordinates[0]
    );

    // Mock route calculations (in real app, use Google Maps API)
    const mockRoutes = [
      {
        routeType: 'fastest',
        distance: totalDistance,
        duration: Math.round(totalDistance / 13.89), // Assuming ~50 km/h average speed
        polyline: `mock_polyline_fastest_${Date.now()}`,
        steps: [
          {
            instruction: `Head to ${destination.address}`,
            distance: totalDistance,
            duration: Math.round(totalDistance / 13.89),
            coordinates: destination.coordinates
          }
        ],
        hazardsOnRoute: [],
        hazardCount: 0,
        safetyScore: 100
      },
      {
        routeType: 'shortest',
        distance: totalDistance * 0.95,
        duration: Math.round(totalDistance * 0.95 / 12.5), // Slightly slower
        polyline: `mock_polyline_shortest_${Date.now()}`,
        steps: [
          {
            instruction: `Take the shortest route to ${destination.address}`,
            distance: totalDistance * 0.95,
            duration: Math.round(totalDistance * 0.95 / 12.5),
            coordinates: destination.coordinates
          }
        ],
        hazardsOnRoute: [],
        hazardCount: 0,
        safetyScore: 100
      },
      {
        routeType: 'safest',
        distance: totalDistance * 1.1,
        duration: Math.round(totalDistance * 1.1 / 13.89),
        polyline: `mock_polyline_safest_${Date.now()}`,
        steps: [
          {
            instruction: `Take the safest route to ${destination.address}`,
            distance: totalDistance * 1.1,
            duration: Math.round(totalDistance * 1.1 / 13.89),
            coordinates: destination.coordinates
          }
        ],
        hazardsOnRoute: [],
        hazardCount: 0,
        safetyScore: 100
      }
    ];

    // Analyze each route for hazards
    mockRoutes.forEach(route => {
      const routePoints = [
        origin.coordinates,
        destination.coordinates
      ];

      const hazardsOnThisRoute = nearbyHazards.filter(hazard => 
        isPointNearRoute(hazard.location.coordinates, routePoints, 200)
      );

      route.hazardsOnRoute = hazardsOnThisRoute.map(h => h._id);
      route.hazardCount = hazardsOnThisRoute.length;
      route.safetyScore = calculateSafetyScore(hazardsOnThisRoute);
    });

    // Save route calculation
    const routeRecord = await Route.create({
      user: req.user.id,
      origin,
      destination,
      routes: mockRoutes,
      selectedRoute: 'safest'
    });

    const populatedRoute = await Route.findById(routeRecord._id)
      .populate({
        path: 'routes.hazardsOnRoute',
        populate: { path: 'reportedBy', select: 'fullName' }
      });

    res.status(200).json({
      success: true,
      message: 'Routes calculated successfully',
      data: {
        route: populatedRoute,
        nearbyHazards: nearbyHazards.map(h => ({
          id: h._id,
          type: h.hazardType,
          severity: h.severity,
          location: h.location,
          description: h.description,
          status: h.status
        }))
      }
    });
  } catch (error) {
    console.error('Calculate route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating route',
      error: error.message
    });
  }
};

// @desc    Get user's route history
// @route   GET /api/routes/history
// @access  Private
exports.getRouteHistory = async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const routes = await Route.find({
      user: req.user.id,
      isActive: true
    })
    .sort('-createdAt')
    .limit(parseInt(limit))
    .skip(skip)
    .populate({
      path: 'routes.hazardsOnRoute',
      select: 'hazardType severity location'
    });

    const total = await Route.countDocuments({
      user: req.user.id,
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: {
        routes,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get route history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching route history',
      error: error.message
    });
  }
};

// @desc    Get route by ID
// @route   GET /api/routes/:id
// @access  Private
exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id)
      .populate({
        path: 'routes.hazardsOnRoute',
        populate: { path: 'reportedBy', select: 'fullName email' }
      });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    // Check if user owns this route
    if (route.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this route'
      });
    }

    res.status(200).json({
      success: true,
      data: { route }
    });
  } catch (error) {
    console.error('Get route by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching route',
      error: error.message
    });
  }
};

// @desc    Delete route from history
// @route   DELETE /api/routes/:id
// @access  Private
exports.deleteRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    if (route.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this route'
      });
    }

    route.isActive = false;
    await route.save();

    res.status(200).json({
      success: true,
      message: 'Route deleted successfully'
    });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting route',
      error: error.message
    });
  }
};

// @desc    Save/favorite a route
// @route   PATCH /api/routes/:id/select
// @access  Private
exports.selectRoute = async (req, res) => {
  try {
    const { routeType } = req.body;
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }

    if (route.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this route'
      });
    }

    route.selectedRoute = routeType;
    await route.save();

    res.status(200).json({
      success: true,
      message: 'Route selection updated',
      data: { route }
    });
  } catch (error) {
    console.error('Select route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating route selection',
      error: error.message
    });
  }
};

// @desc    Get route statistics
// @route   GET /api/routes/stats
// @access  Private
exports.getRouteStats = async (req, res) => {
  try {
    const totalRoutes = await Route.countDocuments({
      user: req.user.id,
      isActive: true
    });

    const routes = await Route.find({
      user: req.user.id,
      isActive: true
    });

    let totalDistance = 0;
    let totalDuration = 0;
    let routeTypeCount = { fastest: 0, shortest: 0, safest: 0 };

    routes.forEach(route => {
      const selectedRouteData = route.routes.find(r => r.routeType === route.selectedRoute);
      if (selectedRouteData) {
        totalDistance += selectedRouteData.distance;
        totalDuration += selectedRouteData.duration;
      }
      routeTypeCount[route.selectedRoute]++;
    });

    res.status(200).json({
      success: true,
      data: {
        totalRoutes,
        totalDistance: Math.round(totalDistance),
        totalDuration: Math.round(totalDuration),
        averageDistance: totalRoutes > 0 ? Math.round(totalDistance / totalRoutes) : 0,
        averageDuration: totalRoutes > 0 ? Math.round(totalDuration / totalRoutes) : 0,
        routePreferences: routeTypeCount
      }
    });
  } catch (error) {
    console.error('Get route stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching route statistics',
      error: error.message
    });
  }
};
