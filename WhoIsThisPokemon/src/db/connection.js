const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/whoareya';

async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a MongoDB:', MONGO_URI);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = { connectDB, mongoose };