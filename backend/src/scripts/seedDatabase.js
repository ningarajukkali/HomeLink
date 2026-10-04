/**
 * HomeLink Database Seeder Script
 * Connects to MongoDB Atlas and seeds verified properties and roommates.
 * Usage: npm run seed or node src/scripts/seedDatabase.js
 */

import mongoose from 'mongoose';
import config from '../config/config.js';
import Property from '../models/Property.js';
import Roommate from '../models/Roommate.js';
import { SEED_PROPERTIES, SEED_ROOMMATES } from '../data/seedData.js';

async function seed() {
  console.log('🚀 HomeLink Database Seeding Initialized...');

  if (!config.mongoUri) {
    console.error('❌ Error: MONGO_URI not configured in .env file.');
    process.exit(1);
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB Connected to database: ${mongoose.connection.name}`);

    // Seed Properties
    console.log('🏠 Seeding verified properties across Delhi, Bangalore, Mumbai, Hyderabad, Rewa...');
    for (const prop of SEED_PROPERTIES) {
      await Property.findOneAndUpdate(
        { id: prop.id },
        { ...prop },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
    const propCount = await Property.countDocuments();
    console.log(`✅ Properties verified in database: ${propCount} listings`);

    // Seed Roommates
    console.log('👥 Seeding verified roommate profiles...');
    for (const rm of SEED_ROOMMATES) {
      await Roommate.findOneAndUpdate(
        { id: rm.id },
        { ...rm },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }
    const rmCount = await Roommate.countDocuments();
    console.log(`✅ Roommates verified in database: ${rmCount} profiles`);

    console.log('\n🎉 HomeLink Database Seeding Completed Successfully!\n');
  } catch (err) {
    console.error('❌ Seeding failed with error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
}

seed();
