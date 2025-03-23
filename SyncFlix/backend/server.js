const express = require('express');
const cors = require('cors');
const config = require('./config');
const streamRoutes = require('./routes/stream');
const Logger = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  Logger.request(req);
  next();
});

// Routes
app.use('/api/stream', streamRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    name: 'SyncFlix API',
    version: '1.0.0',
    author: 'Harsh Bhatt',
    status: 'running'
  });
});

// Error handling
app.use(errorHandler);

// Handle unhandled routes
app.use('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`SyncFlix server started on port ${PORT}`);
  Logger.info(`SyncFlix server started on port ${PORT}`, {
    env: config.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  Logger.error('Unhandled Rejection', { error: err.stack });
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  Logger.error('Uncaught Exception', { error: err.stack });
  process.exit(1);
});