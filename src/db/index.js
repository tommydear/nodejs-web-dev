import mongoose from "mongoose"
import dns from "node:dns"
// DNS configuration removed because overriding DNS servers in Vercel 
// can cause SRV record resolution to fail and block database connections.

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export const connectDB = async (uri, { timeoutMs = 15000 } = {}) => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: timeoutMs,
      family: 4,
      bufferCommands: false, // Prevents mongoose from buffering commands when disconnected
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      console.log("Database connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export const disconnectDB = () => mongoose.disconnect()