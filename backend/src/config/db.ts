import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log(`✅ Connected to ${process.env.DB_NAME} successfully!`);
    });
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected — attempting reconnect...");
    });

    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.DB_NAME,

      // ── Pool: keep min 5 connections alive so no TCP handshake on request ──
      minPoolSize: 5,
      maxPoolSize: 20,

      // ── Timeouts ────────────────────────────────────────────────────────────
      serverSelectionTimeoutMS: 5_000, // fail fast if Atlas is unreachable
      socketTimeoutMS: 30_000, // abort stalled queries after 30s
      connectTimeoutMS: 10_000, // initial TCP connect timeout

      // ── Keep TCP connections alive through idle periods ──────────────────────
      heartbeatFrequencyMS: 10_000,
    });
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
