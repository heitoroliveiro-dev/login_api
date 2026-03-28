// create the auth routes
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/userMiddleware');

// register route
router.post('/register', userController.register);

// login route
router.post('/login', userController.login);

// logout route (optional, can be implemented on the client side by deleting the token)
router.post('/logout', userController.logout);

// get current user
router.get('/me', protect, (req, res) => {
  return res.status(200).json({ user: req.user });
});

module.exports = router;