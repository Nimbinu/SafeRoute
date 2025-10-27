const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    unique: true,
    enum: ['mission', 'features', 'team', 'contact', 'faq', 'testimonials', 'privacy', 'terms']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    icon: String,
    imageUrl: String,
    link: String,
    tags: [String]
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
aboutContentSchema.index({ section: 1, isActive: 1 });
aboutContentSchema.index({ order: 1 });

const AboutContent = mongoose.model('AboutContent', aboutContentSchema);

module.exports = AboutContent;
