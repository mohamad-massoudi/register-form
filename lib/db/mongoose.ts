/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error("");

const cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "school", 
      retryWrites:true,
      w:"majority"
      
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}