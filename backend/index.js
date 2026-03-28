const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectionDB, connectDB } = require('./src/config/database');

// read environment variables
dotenv.config();

// create a new server
const app = express();
app.use(cors());
app.use(express.json());
/* app.use('api/auth', require('./routes/userRoutes')); */

/* test router */
app.get('/', (req, res) => {
    res.send('API is running...')
});

const PORT = process.env.PORT;

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