const mongoose = require('mongoose');
const User = require('./models/User');
const Hazard = require('./models/Hazard');
const Route = require('./models/Route');
require('dotenv').config();

async function checkDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check Users
    const users = await User.find();
    console.log('👥 USERS (' + users.length + ' total):');
    users.forEach(u => {
      console.log(`  - ${u.fullName} (${u.email}) - Role: ${u.role}`);
    });

    // Check Hazards
    const hazards = await Hazard.find();
    console.log('\n⚠️  HAZARDS (' + hazards.length + ' total):');
    const pending = hazards.filter(h => h.status === 'Pending').length;
    const verified = hazards.filter(h => h.status === 'Verified').length;
    const resolved = hazards.filter(h => h.status === 'Resolved').length;
    console.log(`  - Pending: ${pending}`);
    console.log(`  - Verified: ${verified}`);
    console.log(`  - Resolved: ${resolved}`);

    // Check Routes
    const routes = await Route.find();
    console.log('\n🗺️  ROUTES (' + routes.length + ' total)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkDatabase();
