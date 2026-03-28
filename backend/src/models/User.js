const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { getConnection } = require('../config/database');

// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash the password before saving
userSchema.pre('save', async function(){
    try{
        if(!this.isModified('password')) return;

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);


    }catch (error){
        console.error('Error hashing password:', error);
        throw error;
    }
});

// get the connection and export the model
const { auth } = getConnection();
module.exports = auth.model('User', userSchema, 'user_credentials');