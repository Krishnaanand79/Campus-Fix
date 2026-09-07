import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusfix';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.warn(`[MongoDB] Tip: Set your MongoDB Atlas URI in backend/.env as MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campusfix`);
    // We don't exit immediately so health check and seed diagnostics can give actionable output
    return null;
  }
};
