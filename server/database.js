const { MongoClient } = require('mongodb');
const mongoose = require('mongoose')

// Replace with your actual connection details
const uri = 'mongodb+srv://node_server:UyD7M3cSt9pzD57s@shopply.slols0l.mongodb.net/shopply';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
        useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

module.exports = connectDB;