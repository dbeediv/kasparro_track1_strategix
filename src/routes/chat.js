// src/routes/chat.js
const express = require('express');
const router = express.Router();
const { processMessage, processMoodTiles, getRecipientProfile } = require('../agent/shopmind');

// POST /api/chat/message
router.post('/message', async (req, res) => {
  const { sessionId, message, moodTiles } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: 'sessionId and message are required' });
  }

  try {
    const result = await processMessage(sessionId, message, moodTiles || []);
    res.json(result);
  } catch (err) {
    console.error('[Chat] Error:', err.message);
    res.status(500).json({
      stage: 'error',
      message: "Something went wrong. Let's try again.",
      error: true,
    });
  }
});

// POST /api/chat/mood
router.post('/mood', async (req, res) => {
  const { sessionId, tiles } = req.body;

  if (!sessionId || !Array.isArray(tiles) || tiles.length === 0) {
    return res.status(400).json({ error: 'sessionId and tiles array are required' });
  }

  try {
    const result = await processMoodTiles(sessionId, tiles);
    res.json(result);
  } catch (err) {
    console.error('[Mood] Error:', err.message);
    res.status(500).json({ stage: 'error', message: 'Mood processing failed.', error: true });
  }
});

// GET /api/chat/profile/:sessionId — L10 recipient profile
router.get('/profile/:sessionId', (req, res) => {
  const profile = getRecipientProfile(req.params.sessionId);
  res.json({ profile: profile || {} });
});

module.exports = router;
