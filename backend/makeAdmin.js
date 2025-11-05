// Update User Role to Admin - Run this script once
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const updateUserToAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Get the email you want to make admin
    const email = process.argv[2] || 'admin@saferoute.com';

    // Find and update user
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      console.log('\nAvailable users:');
      const allUsers = await User.find({}).select('email fullName role');
      allUsers.forEach(u => {
        console.log(`  - ${u.email} (${u.fullName}) - Role: ${u.role}`);
      });
      process.exit(1);
    }

    console.log(`\nFound user: ${user.fullName} (${user.email})`);
    console.log(`Current role: ${user.role}`);

    // Update to admin
    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully updated role to: admin`);
    console.log(`\n🎉 ${user.fullName} is now an admin!`);
    console.log(`\nYou can now access /admin page`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Run the script
updateUserToAdmin();

// Usage:
// node makeAdmin.js your-email@example.com
