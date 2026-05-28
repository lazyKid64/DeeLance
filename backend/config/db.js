const mongoose = require("mongoose");

let dbConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    dbConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    dbConnected = false;
    console.error("MongoDB connection error:", error.message);
    console.warn("Server will continue with IN-MEMORY storage. Data will not persist across restarts.");
  }
};

const isDbConnected = () => dbConnected;

module.exports = connectDB;
module.exports.isDbConnected = isDbConnected;
