require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Global stream configuration
  globalKickoffTime: '00:00', // UTC time when streams start
  streamingSettings: {
    chunkDuration: 300, // 5 minutes in seconds
    preloadChunks: 2,   // Number of chunks to preload
    maxConcurrentStreams: 1000000 // Maximum concurrent streams supported
  },

  // CDN configuration (example endpoints)
  cdn: {
    baseUrl: process.env.CDN_BASE_URL || 'http://localhost:8000',
    videoPath: '/public/videos',
    qualityLevels: ['1080p', '720p', '480p', '360p'],
    videoExtension: '.mp4'
  },

  // Cache configuration
  cache: {
    ttl: 3600, // Time to live in seconds
    checkPeriod: 600 // Cleanup period in seconds
  },

  // Cors configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
};

module.exports = config;