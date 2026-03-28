const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const normalizeName = (value) => String(value || '').trim();

const emailRegex = User.schema.path('email').options.match[0];

exports.register = async (req, res) => {
    try {
        const name = normalizeName(req.body.name);
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || '');

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required.' });
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must have at least 6 characters.' });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        const user = await User.create({ name, email, password });

        const userObj = user.toObject();
        delete userObj.password;

        return res.status(201).json({
            message: 'User created successfully.',
            user: userObj
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        return res.status(500).json({
            message: 'Failed to register user.',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const password = String(req.body.password || '');

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        return res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Failed to login.',
            error: error.message
        });
    }
};

exports.logout = async (req, res) => {
    return res.status(200).json({
        message: 'Logout successful on client side. Discard the token.'
    });
};