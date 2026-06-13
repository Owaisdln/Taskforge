const mongoose = require('mongoose');

let cached = global._mongoClientPromise;

if (!cached) {
  cached = global._mongoClientPromise = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Add other mongoose options here if needed
    };
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${cached.conn.host}`);
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

module.exports = connectDB;