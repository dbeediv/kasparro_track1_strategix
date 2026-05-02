// src/server.js
// ShopMind Express server — API + static frontend

require('dotenv').config();
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// ─── Routes ────────────────────────────────────────────────────────────────
const chatRouter = require('./routes/chat');
const cartRouter = require('./routes/cart');
const insightsRouter = require('./routes/insights');

app.use('/api/chat', chatRouter);
app.use('/api/cart', cartRouter);
app.use('/api/insights', insightsRouter);

// Session init — returns a fresh sessionId for the client
app.post('/api/session', (req, res) => {
  const sessionId = uuidv4();
  res.json({ sessionId });
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});
app.get('/insights', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/insights.html'));
});

// 404 fallback
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🛍  ShopMind running at http://localhost:${PORT}`);
  console.log(`📊  Insights dashboard: http://localhost:${PORT}/insights\n`);
});

module.exports = app;
