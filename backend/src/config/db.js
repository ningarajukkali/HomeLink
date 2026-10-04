import mongoose from 'mongoose';
import config from './config.js';
import User from '../models/User.js';
import { readLocalUsers } from '../data/userStore.js';
import { Room } from '../models/Room.js';
import { SEED_ROOMS } from '../data/seedRooms.js';

/**
 * Connect to MongoDB Atlas
 */
export async function connectDB() {
  if (!config.mongoUri) {
    console.log('ℹ️  No MONGODB_URI configured in .env. Running with local user store.');
    return null;
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    mongoose.set('bufferTimeoutMS', 2500);

    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} / ${conn.connection.name}`);

    // Sync local users to MongoDB collection
    try {
      const localUsers = readLocalUsers();
      for (const u of localUsers) {
        const query = [];
        if (u.email) query.push({ email: u.email });
        if (u.phone) query.push({ phone: u.phone });
        if (query.length > 0) {
          const exists = await User.findOne({ $or: query });
          if (!exists) {
            await User.create(u);
            console.log(`🌱 Synced user to MongoDB: ${u.name} (${u.email || u.phone})`);
          }
        }
      }
    } catch (syncErr) {
      console.warn('⚠️ User sync check note:', syncErr.message);
    }

    return conn;
  } catch (error) {
    console.error('⚠️ MongoDB Atlas connection notice:', error.message);
    console.log('💡 TIP: If connecting to MongoDB Atlas from a new network or IP:');
    console.log('   Go to MongoDB Atlas dashboard -> Network Access -> Add IP Address -> "0.0.0.0/0" (Allow from anywhere).');
    console.log('⚡ Running smoothly with local database cache in the meantime.');
    return null;
  }
}

export default connectDB;
