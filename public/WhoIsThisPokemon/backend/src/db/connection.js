const mongoose = require('mongoose');
const config = require('../config');

async function connectDB() {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Conectado a MongoDB:', config.mongoUri);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };
