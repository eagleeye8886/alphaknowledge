// routes/auth.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();

// Keep existing routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/auth/callback?success=false` }),
  authController.googleCallback
);
router.post('/logout', authController.logout);
router.get('/user', authController.getCurrentUser);

// NEW: Add token verification route for popup login
router.post('/google/verify', authController.verifyGoogleToken);
// Ping route to keep the server awake 
router.get('/ping', (req, res) => {
  res.status(200).send('Server is awake');
});
module.exports = router;

