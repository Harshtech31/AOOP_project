require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');

const fixUsernameIndex = async () => {
  try {
    // Connect to the database
    await connectDB();
    
    console.log('Connected to MongoDB. Attempting to fix username index...');
    
    // Get a reference to the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Check existing indexes
    const indexes = await usersCollection.indexes();
    console.log('Current indexes:', indexes);
    
    // Drop the problematic username index if it exists
    const usernameIndex = indexes.find(index => 
      index.name === 'username_1' || 
      (index.key && index.key.username)
    );
    
    if (usernameIndex) {
      console.log('Found username index. Dropping it...');
      await usersCollection.dropIndex(usernameIndex.name);
      console.log('Successfully dropped the username index.');
    } else {
      console.log('No username index found.');
    }
    
    // Create a new sparse index on username
    console.log('Creating new sparse index on username field...');
    await usersCollection.createIndex(
      { username: 1 },
      { 
        unique: true, 
        sparse: true,
        name: 'username_1_sparse'
      }
    );
    
    console.log('Successfully created sparse index on username field.');
    
    // Optional: Update existing documents with null username to undefined
    console.log('Updating existing documents with null username...');
    const result = await usersCollection.updateMany(
      { username: null },
      { $unset: { username: "" } }
    );
    
    console.log(`Updated ${result.modifiedCount} documents with null username.`);
    
    console.log('Index fix completed successfully!');
  } catch (error) {
    console.error('Error fixing username index:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
};

// Run the function
fixUsernameIndex();
