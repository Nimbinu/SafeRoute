const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const hazardRoutes = require('./routes/hazards');
const routeRoutes = require('./routes/routes');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const aboutRoutes = require('./routes/about');
const uploadRoutes = require('./routes/upload');
const locationRoutes = require('./routes/location');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection with options
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/hazards', hazardRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/location', locationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SafeRoute API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SafeRoute API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
