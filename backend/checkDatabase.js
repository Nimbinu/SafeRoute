require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Hazard = require('./models/Hazard');

async function checkDatabase() {
  try {
    console.log('🔌 Connecting to database...\n');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully!\n');

    // 1. Check Users
    console.log('═══════════════════════════════════════');
    console.log('👥 USERS COLLECTION');
    console.log('═══════════════════════════════════════');
    
    const userCount = await User.countDocuments();
    console.log(`Total users: ${userCount}\n`);
    
    const users = await User.find().select('fullName email role isActive createdAt');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.fullName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Status: ${user.isActive ? '✅ Active' : '❌ Inactive'}`);
      console.log(`   Joined: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    // 2. Check Hazards
    console.log('═══════════════════════════════════════');
    console.log('🚨 HAZARDS COLLECTION');
    console.log('═══════════════════════════════════════');
    
    const hazardCount = await Hazard.countDocuments();
    console.log(`Total hazards: ${hazardCount}\n`);
    
    const hazards = await Hazard.find()
      .populate('reportedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    hazards.forEach((hazard, index) => {
      console.log(`${index + 1}. ${hazard.hazardType}`);
      console.log(`   Location: ${hazard.location.address}`);
      console.log(`   Status: ${hazard.status}`);
      console.log(`   Severity: ${hazard.severity}`);
      console.log(`   Reported by: ${hazard.reportedBy?.fullName || 'Unknown'}`);
      console.log(`   Date: ${hazard.createdAt.toLocaleString()}`);
      console.log('');
    });

    // 3. Statistics
    console.log('═══════════════════════════════════════');
    console.log('📊 STATISTICS');
    console.log('═══════════════════════════════════════');
    
    const pendingHazards = await Hazard.countDocuments({ status: 'Pending' });
    const verifiedHazards = await Hazard.countDocuments({ status: 'Verified' });
    const resolvedHazards = await Hazard.countDocuments({ status: 'Resolved' });
    
    console.log(`Pending Hazards: ${pendingHazards}`);
    console.log(`Verified Hazards: ${verifiedHazards}`);
    console.log(`Resolved Hazards: ${resolvedHazards}\n`);
    
    const userRoles = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    console.log('Users by Role:');
    userRoles.forEach(role => {
      console.log(`  ${role._id}: ${role.count}`);
    });
    console.log('');
    
    const hazardTypes = await Hazard.aggregate([
      { $group: { _id: '$hazardType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('Hazards by Type:');
    hazardTypes.forEach(type => {
      console.log(`  ${type._id}: ${type.count}`);
    });
    
    console.log('\n✅ Database check complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkDatabase();
