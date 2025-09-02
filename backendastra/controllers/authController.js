// controllers/authController.js
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// NEW: Verify Google JWT token for popup login
exports.verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify the Google JWT token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, name, email, picture } = payload;
    
    // Find or create user
    let user = await User.findOne({ googleId });
    
    if (user) {
      user.lastLogin = new Date();
      await user.save();
    } else {
      user = new User({
        googleId,
        name,
        email,
        profilePicture: picture
      });
      await user.save();
    }
    
    // Create session
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Session creation failed' });
      }
      
      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture
        }
      });
    });
    
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Keep existing methods unchanged
exports.googleCallback = (req, res) => {
  if (req.user) {
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?success=true`);
  } else {
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?success=false`);
  }
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};
