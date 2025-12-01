const mongoose = require('mongoose');

const SavedLocationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  locationName: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true,
    maxlength: [100, 'Location name cannot exceed 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  category: {
    type: String,
    enum: ['Home', 'Work', 'School', 'Favorite', 'Other'],
    default: 'Other'
  },
  icon: {
    type: String,
    default: '📍'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
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
SavedLocationSchema.index({ user: 1, createdAt: -1 });
SavedLocationSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('SavedLocation', SavedLocationSchema);
