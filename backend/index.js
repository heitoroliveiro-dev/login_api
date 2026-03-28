const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./src/config/database');

// dotend configuration to read environment variables
dotenv.config();

// initialize express app
const app = express();
app.use(cors());
app.use(express.json());
/* app.use('api/auth', require('./routes/userRoutes')); */

// test route
app.get('/', (req, res) => {
    res.send('API is running...')
});

const PORT = process.env.PORT;

// start the server and connect to the database
const startServer = async () => {
    try{
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }catch (error){
        console.error('Connection failed!:', error.message);
        if(process.env.NODE_ENV === 'production'){
            process.exit(1);
        }
    }
};

startServer();