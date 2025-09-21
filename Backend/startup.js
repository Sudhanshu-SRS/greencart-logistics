const mongoose = require("mongoose");
require("dotenv").config();

// Test database connection
async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connection successful");

    // Test collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "📋 Available collections:",
      collections.map((c) => c.name)
    );

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
}

testConnection();
