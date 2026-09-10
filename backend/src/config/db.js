import mongoose from 'mongoose';

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusfix';
  const localFallbackUri = 'mongodb://127.0.0.1:27017/campusfix';

  try {
    console.log(`[MongoDB] Connecting to database...`);
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 6000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`\n[MongoDB] Primary connection failed: ${error.message}`);

    if (primaryUri.includes('mongodb.net') || primaryUri.includes('mongodb+srv')) {
      console.warn(`\n===============================================================`);
      console.warn(`⚠️  MONGODB ATLAS CONNECTION NOTICE:`);
      console.warn(`Your Atlas cluster rejected the connection (commonly due to IP Access Whitelist).`);
      console.warn(`To allow connections from your computer to Atlas:`);
      console.warn(`  1. Open MongoDB Atlas (https://cloud.mongodb.com)`);
      console.warn(`  2. Go to 'Network Access' -> 'Add IP Address'`);
      console.warn(`  3. Select 'Allow Access from Anywhere' (0.0.0.0/0) or 'Add Current IP'`);
      console.warn(`  4. Click 'Confirm' (takes ~1 minute to apply)`);
      console.warn(`===============================================================\n`);
    }

    // Try fallback to local MongoDB if primary wasn't local
    if (primaryUri !== localFallbackUri) {
      try {
        console.log(`[MongoDB] Attempting fallback to local MongoDB (${localFallbackUri})...`);
        const fallbackConn = await mongoose.connect(localFallbackUri, {
          serverSelectionTimeoutMS: 3000,
        });
        console.log(`[MongoDB] Connected successfully to local fallback host: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackErr) {
        console.error(`[MongoDB] Local fallback also failed: ${fallbackErr.message}`);
      }
    }

    return null;
  }
};
