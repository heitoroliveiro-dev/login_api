const dotenv = require('dotenv');
const { connectDB } = require('./src/config/database');
const app = require('./src/app');

// dotend configuration to read environment variables
dotenv.config();

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