// src/agent/insights.js
// L11: Merchant Insight Feed — collects signal from every conversation

const _events = [];
const _sessionMap = {};

function getInsightCollector() {
  return {
    record(event) {
      const enriched = { ...event, timestamp: new Date().toISOString() };
      _events.push(enriched);

      // Aggregate per session
      if (!_sessionMap[event.sessionId]) {
        _sessionMap[event.sessionId] = { turns: 0, stages: [], emotionTags: new Set(), handles: [] };
      }
      const s = _sessionMap[event.sessionId];
      s.turns++;
      s.stages.push(event.stage);
      (event.emotionTags || []).forEach(t => s.emotionTags.add(t));
      if (event.recommendedHandle) s.handles.push(event.recommendedHandle);
    }
  };
}

// Compute aggregated insights for merchant dashboard
function getInsightSummary() {
  const total = _events.length;
  if (total === 0) return { message: 'No sessions yet.' };

  // Emotion tag frequency
  const emotionFreq = {};
  _events.forEach(e => (e.emotionTags || []).forEach(tag => {
    emotionFreq[tag] = (emotionFreq[tag] || 0) + 1;
  }));

  // Dropoff distribution
  const dropoff = { low: 0, medium: 0, high: 0 };
  _events.forEach(e => { if (e.dropoffRisk) dropoff[e.dropoffRisk]++; });

  // Most recommended products
  const recFreq = {};
  _events.forEach(e => {
    if (e.recommendedHandle) recFreq[e.recommendedHandle] = (recFreq[e.recommendedHandle] || 0) + 1;
  });

  // Stage funnel
  const stageFunnel = {};
  _events.forEach(e => {
    stageFunnel[e.stage] = (stageFunnel[e.stage] || 0) + 1;
  });

  // Average confidence
  const confEvents = _events.filter(e => e.confidence != null);
  const avgConfidence = confEvents.length
    ? Math.round(confEvents.reduce((a, b) => a + b.confidence, 0) / confEvents.length)
    : null;

  return {
    totalEvents: total,
    uniqueSessions: Object.keys(_sessionMap).length,
    avgConfidence,
    topEmotionTags: Object.entries(emotionFreq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([tag, count]) => ({ tag, count })),
    dropoffRiskDistribution: dropoff,
    topRecommendedProducts: Object.entries(recFreq).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([handle, count]) => ({ handle, count })),
    stageFunnel,
    recentEvents: _events.slice(-20).reverse(),
  };
}

module.exports = { getInsightCollector, getInsightSummary };
