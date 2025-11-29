require('dotenv').config();
const mongoose = require('mongoose');
const Hazard = require('./models/Hazard');
const Route = require('./models/Route');

const rebuildIndexes = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    console.log('🔧 Dropping existing indexes...');
    await Hazard.collection.dropIndexes();
    await Route.collection.dropIndexes();
    
    console.log('🔨 Creating new indexes...');
    await Hazard.createIndexes();
    await Route.createIndexes();
    
    console.log('✅ Indexes rebuilt successfully');
    
    // Verify indexes
    const hazardIndexes = await Hazard.collection.getIndexes();
    const routeIndexes = await Route.collection.getIndexes();
    
    console.log('\n📋 Hazard indexes:');
    Object.keys(hazardIndexes).forEach(index => {
      console.log(`  - ${index}`);
    });
    
    console.log('\n📋 Route indexes:');
    Object.keys(routeIndexes).forEach(index => {
      console.log(`  - ${index}`);
    });
    
    await mongoose.connection.close();
    console.log('\n✅ Done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

rebuildIndexes();
