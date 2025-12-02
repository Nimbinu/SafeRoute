const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const user = await User.findOne({ email: 'sandali12@gmail.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      await mongoose.connection.close();
      return;
    }

    console.log('✅ User found:');
    console.log('📧 Email:', user.email);
    console.log('👤 Name:', user.fullName);
    console.log('🔑 Password Hash:', user.password);
    console.log('📅 Created:', user.createdAt);
    
    // Test password comparison
    const isMatch = await user.comparePassword('password123');
    console.log('\n🔐 Password "password123" matches:', isMatch);
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
  }
};

checkUser();
