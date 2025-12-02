const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Check if user exists
    const existingUser = await User.findOne({ email: 'sandali12@gmail.com' });
    
    if (existingUser) {
      console.log('❌ User already exists with this email');
      await mongoose.connection.close();
      return;
    }

    // Create test user
    const user = await User.create({
      fullName: 'Sandali User',
      email: 'sandali12@gmail.com',
      password: 'password123', // Will be hashed automatically by the User model
      role: 'user'
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email: sandali12@gmail.com');
    console.log('🔑 Password: password123');
    console.log(`👤 Name: ${user.fullName}`);
    console.log(`🆔 User ID: ${user._id}`);
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
  }
};

createTestUser();
