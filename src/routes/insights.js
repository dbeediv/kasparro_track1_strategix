// src/routes/insights.js
const express = require('express');
const router = express.Router();
const { getInsightSummary } = require('../agent/insights');
const { getCatalogGaps } = require('../shopify/catalog');

// GET /api/insights — L11: Merchant insight feed
router.get('/', (req, res) => {
  const summary = getInsightSummary();
  const gaps = getCatalogGaps();
  res.json({ ...summary, catalogGaps: gaps });
});

module.exports = router;
