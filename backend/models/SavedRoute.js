const mongoose = require('mongoose');

const SavedRouteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  routeName: {
    type: String,
    required: [true, 'Route name is required'],
    trim: true,
    maxlength: [100, 'Route name cannot exceed 100 characters']
  },
  startLocation: {
    address: {
      type: String,
      required: [true, 'Start address is required']
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  endLocation: {
    address: {
      type: String,
      required: [true, 'End address is required']
    },
    coordinates: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    }
  },
  routeData: {
    safest: {
      type: Object,
      default: null
    },
    fastest: {
      type: Object,
      default: null
    },
    shortest: {
      type: Object,
      default: null
    }
  },
  preferredRouteType: {
    type: String,
    enum: ['safest', 'fastest', 'shortest'],
    default: 'safest'
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
SavedRouteSchema.index({ user: 1, createdAt: -1 });
SavedRouteSchema.index({ user: 1, isFavorite: -1 });

module.exports = mongoose.model('SavedRoute', SavedRouteSchema);
