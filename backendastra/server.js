const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo'); // Add this for session persistence
require('dotenv').config();

// Initialize Astra DB connection
const { connectToAstra } = require('./config/database');

// Initialize passport configuration
require('./config/passport')(passport);

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const contentRoutes = require('./routes/content');

const app = express();

// **IMPORTANT**: Trust proxy if behind reverse proxy (like Heroku, Railway, etc.)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// **UPDATED**: CORS configuration with proper credentials support
app.use(cors({
  origin: 'https://alphaknowledge.vercel.app', // Must be specific URL, not '*' for credentials
  credentials: true, // **ESSENTIAL** - Allows cookies to be sent/received
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// **UPDATED**: Enhanced session configuration for OAuth persistence
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-secret-key-in-production',
  resave: false,
  saveUninitialized: false,
  rolling: true, // Reset session expiry on activity
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Cross-origin support
  },
  // **IMPORTANT**: Use MongoDB for session storage (instead of memory)
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI, // Your MongoDB connection string
    touchAfter: 24 * 3600, // Lazy session update (24 hours)
    ttl: 24 * 60 * 60, // Session TTL in seconds (24 hours)
    collectionName: 'sessions',
    stringify: false,
    autoRemove: 'native' // Let MongoDB handle cleanup
  })
}));

// **IMPORTANT**: Passport middleware AFTER session configuration
app.use(passport.initialize());
app.use(passport.session());

// **DEBUG**: Add middleware to log session info (remove in production)
app.use((req, res, next) => {
  // console.log('🔍 Session ID:', req.sessionID);
  // console.log('🔍 Is Authenticated:', req.isAuthenticated ? req.isAuthenticated() : false);
  // console.log('🔍 User:', req.user ? req.user.email : 'Not logged in');
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Alpha Knowledge API is running with Astra DB!',
    session: req.sessionID,
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false
  });
});

const startServer = async () => {
  try {
    // Connect to Astra DB first
    await connectToAstra();
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      // console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
      // console.log(`🔐 Session Secret: ${process.env.SESSION_SECRET ? 'Set' : 'Not set - using default'}`);
      // console.log(`🍪 Cookie Secure: ${process.env.NODE_ENV === 'production'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

