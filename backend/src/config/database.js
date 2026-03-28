const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// read environment variables
dotenv.config({
    path: path.resolve(__dirname, '../../.env')
});


// validade if the connection already exists 
let registry;
const getOrCreateRegistry = () => {
    if (registry) return registry;
    const auth = mongoose.createConnection(process.env.MONGO_URI_AUTH);  

    registry = {
        auth
    };

    return registry;
}

// create a new connection
const connectDB = async () => {
    // first validate
    const connections = getOrCreateRegistry();

    // then, try a connection asPromise
    try{
        await connections.auth.asPromise();
        console.log('MongoDB is connected!!')
    }catch (error){
        console.error('MongoDB connection failed', error.message)
        process.exit(1);
    }
}

// lets get a new connection
const getConnection = () => getOrCreateRegistry();

/* connectDB(); */

module.exports = {
    connectDB,
    getConnection
}