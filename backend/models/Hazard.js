const mongoose = require('mongoose');

const hazardSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hazardType: {
    type: String,
    required: [true, 'Hazard type is required'],
    enum: ['Pothole', 'Debris', 'Flooding', 'Ice', 'Accident', 'Road Closure', 'Construction', 'Broken Traffic Light', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  photo: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Resolved'],
    default: 'Pending'
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Create geospatial index for location-based queries
hazardSchema.index({ location: '2dsphere' });

// Index for faster queries
hazardSchema.index({ status: 1, isActive: 1 });
hazardSchema.index({ reportedBy: 1 });
hazardSchema.index({ createdAt: -1 });

const Hazard = mongoose.model('Hazard', hazardSchema);

module.exports = Hazard;
