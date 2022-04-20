const mongoose = require('mongoose');
require('dotenv').config();


const dbConnection = async() => {
    try {
        await mongoose.connect( process.env.MONGODB );
        console.log('Connected to MongoDB...');
    } catch (error) {
        console.log('error: ', error);
        throw new Error('Failed to connect to MongoDB.');
    }
}


module.exports = dbConnection;