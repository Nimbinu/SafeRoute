const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  origin: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  routes: [{
    routeType: {
      type: String,
      enum: ['fastest', 'shortest', 'safest'],
      required: true
    },
    distance: {
      type: Number, // in meters
      required: true
    },
    duration: {
      type: Number, // in seconds
      required: true
    },
    safetyScore: {
      type: Number, // 0-100 (100 being safest)
      default: 100
    },
    hazardCount: {
      type: Number,
      default: 0
    },
    polyline: {
      type: String, // Encoded polyline for the route
      required: true
    },
    steps: [{
      instruction: String,
      distance: Number,
      duration: Number,
      coordinates: [Number]
    }],
    hazardsOnRoute: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hazard'
    }]
  }],
  selectedRoute: {
    type: String,
    enum: ['fastest', 'shortest', 'safest'],
    default: 'safest'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
routeSchema.index({ user: 1, createdAt: -1 });
routeSchema.index({ isActive: 1 });

const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
