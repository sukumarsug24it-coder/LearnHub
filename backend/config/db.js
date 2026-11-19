const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/learnhub';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    isMongoConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.log(`\x1b[33m⚠ MongoDB is not running locally (${error.message}).\x1b[0m`);
    console.log(`\x1b[36mℹ LearnHub is running in zero-config In-Memory Hybrid Store mode. All authentication, courses, enrollments, and progress tracking will work seamlessly!\x1b[0m`);
    return false;
  }
};

const getMongoStatus = () => isMongoConnected;

module.exports = { connectDB, getMongoStatus };

