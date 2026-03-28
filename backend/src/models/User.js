const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { getConnection } = require('../config/database');

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

userSchema.pre('save', async function(next){
    try{
        if(!this.isModified('password')) return next();

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);

        next();
    }catch (error){
        next(error);
    }
});

const { user } = getConnection();

module.exports = user.model('User', userSchema, 'user_credentials');