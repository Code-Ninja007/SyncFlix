const express = require('express');
const { parseISO, differenceInSeconds } = require('date-fns');
const config = require('../config');
const Logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

// Mock database of user sequences (in production, this would be in a real database)
const userSequences = {
  'user1': [
    { videoId: 'video1', duration: 300 },
    { videoId: 'video2', duration: 300 },
    { videoId: 'video3', duration: 300 }
  ],
  'user2': [
    { videoId: 'video2', duration: 300 },
    { videoId: 'video3', duration: 300 },
    { videoId: 'video1', duration: 300 }
  ]
};

// Helper function to calculate current video and offset
const calculateStreamPosition = (userId, elapsedSeconds) => {
  const sequence = userSequences[userId];
  if (!sequence) {
    throw new AppError('User sequence not found', 404);
  }

  let totalDuration = 0;
  for (let i = 0; i < sequence.length; i++) {
    totalDuration += sequence[i].duration;
    if (elapsedSeconds < totalDuration) {
      const offset = sequence[i].duration - (totalDuration - elapsedSeconds);
      return {
        videoId: sequence[i].videoId,
        offset,
        nextVideo: sequence[i + 1]?.videoId || sequence[0].videoId
      };
    }
  }

  // If elapsed time exceeds total duration, loop back to start
  const adjustedElapsed = elapsedSeconds % totalDuration;
  return calculateStreamPosition(userId, adjustedElapsed);
};

// Get current stream position for user
router.get('/position', async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      throw new AppError('userId is required', 400);
    }

    Logger.request(req, { userId });

    // Calculate elapsed time since global kickoff
    const now = new Date();
    const kickoffTime = parseISO(`${now.toISOString().split('T')[0]}T${config.globalKickoffTime}Z`);
    const elapsedSeconds = differenceInSeconds(now, kickoffTime);

    // Get current video and offset
    const streamPosition = calculateStreamPosition(userId, elapsedSeconds);

    // Construct video URL from CDN configuration
    const videoUrl = `${config.cdn.baseUrl}${config.cdn.videoPath}/${streamPosition.videoId}${config.cdn.videoExtension}`;

    res.json({
      status: 'success',
      data: {
        videoUrl,
        offset: streamPosition.offset,
        nextVideoId: streamPosition.nextVideo,
        qualityLevels: config.cdn.qualityLevels
      }
    });

  } catch (error) {
    next(error);
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  Logger.request(req);
  res.json({
    status: 'success',
    message: 'Streaming service is healthy',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;