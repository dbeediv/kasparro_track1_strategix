// src/agent/shopmind.js
// ShopMind core agent — all 11 logics
// AI Provider: Groq (free tier — llama-3.3-70b-versatile)

require('dotenv').config();
const Groq = require('groq-sdk');
const { getCatalog, recordCatalogGap } = require('../shopify/catalog');
const { getInsightCollector } = require('./insights');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── SESSION STORE ──────────────────────────────────────────────────────────
const sessions = {};

function getSession(sessionId) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      id: sessionId,
      history: [],
      extractedIntent: {},
      turnCount: 0,
      recipientProfile: {},
      confidenceHistory: [],
      catalogSnapshot: null,
      startTime: Date.now(),
    };
  }
  return sessions[sessionId];
}

function saveSession(session) {
  sessions[session.id] = session;
}

// ─── SYSTEM PROMPT ──────────────────────────────────────────────────────────
function buildSystemPrompt(catalog, session) {
  const catalogSummary = catalog.length === 0
    ? 'NO PRODUCTS LOADED YET — ask for buyer intent and recommend based on their needs.'
    : catalog.slice(0, 60).map(p =>
        `[${p.handle}] "${p.title}" Rs.${Math.round(p.price)} | emotions:${(p.emotionTags||[]).join(',')} | personas:${(p.personas||[]).join(',')} | occasions:${(p.occasions||[]).join(',')} | moods:${(p.moodTiles||[]).join(',')}`
      ).join('\n');

  const turnContext = session.turnCount === 0
    ? 'This is the FIRST turn. Start warm and ask ONE smart opening question.'
    : `This is turn ${session.turnCount + 1}. You already know: ${JSON.stringify(session.extractedIntent)}. DO NOT repeat questions already answered. Move toward a recommendation.`;

  const recipientContext = Object.keys(session.recipientProfile).length > 0
    ? `\nRECIPIENT PROFILE (L10): ${JSON.stringify(session.recipientProfile)}`
    : '';

  return `You are ShopMind — a warm, intelligent AI shopping agent for a curated Indian gifting store. Help buyers find the perfect gift through conversation.

YOUR GOAL: Guide the buyer from vague intent to a confident purchase in 2-4 turns.

HARD RULES — never break these:
1. Ask EXACTLY ONE question per turn when narrowing. Never two.
2. NEVER repeat a question already answered by the buyer.
3. NEVER show a product list. Recommend ONE product when confident.
4. NEVER use the phrase "Can you tell me a little more about who this gift is for?" — it is banned.
5. Each turn must PROGRESS — use everything you already know.
6. By turn 4, you MUST recommend something. Do not ask more questions.
7. Return ONLY valid JSON. No markdown. No explanation text outside the JSON.
8. If the buyer describes something not available in the catalog, set catalogGap to a 5-word description of what they wanted (e.g. "sustainable bamboo water bottle"). This powers merchant intelligence.

CONVERSATION STATE:
${turnContext}${recipientContext}

CONFIDENCE RULES:
- Turn 1: Ask opening question. confidence = null.
- Turn 2: You know relationship/category. Ask ONE refinement. confidence = 40-60.
- Turn 3: Recommend if confidence >= 65. Ask one more only if truly unclear.
- Turn 4+: MUST recommend. Pick best match. confidence >= 75.

SMART QUESTION BANK (pick ONE based on what you still don't know):
- Relationship unclear → "Is this for someone close like family, or more of a friend or colleague?"
- Occasion unclear → "Is there a special occasion, or just a thoughtful gift?"
- Budget unclear → "Any budget range in mind, or should I just find the best match?"
- Vibe unclear → "Would they prefer something practical they'll use daily, or something more indulgent and special?"
- Taste unclear → "Do they lean more minimal and understated, or warm and expressive?"

AVAILABLE PRODUCTS:
${catalogSummary}

RETURN EXACTLY THIS JSON STRUCTURE — no extra text before or after:
{
  "stage": "narrowing",
  "message": "Your warm 1-2 sentence response",
  "question": "Your ONE question if narrowing, otherwise null",
  "intent": {
    "emotion": [],
    "persona": [],
    "occasion": null,
    "priceMax": null,
    "priceMin": null,
    "moodTiles": [],
    "relationshipSignal": "",
    "unstatedConstraints": ""
  },
  "recommendation": {
    "handle": null,
    "confidence": null,
    "reason": null,
    "matchDimensions": [],
    "caveat": null
  },
  "comparison": { "product1Handle": null, "product2Handle": null, "dimension": null, "verdict": null },
  "regretPrevention": { "objection": null, "answer": null }, // Leave null — auto-populated from product metafields
  "upsell": { "handle": null, "framing": null },
  "recipientProfileUpdate": { "relationship": null, "preferences": [], "occasion": null },
  "catalogGap": null,
  "insightSignal": { "emotionConverting": null, "dropoffRisk": "low", "dropoffReason": null }
}`;
}

// ─── VARIED FALLBACKS — never the same message twice ────────────────────────
const FALLBACKS = [
  { message: "Happy to help find something perfect.", question: "Is this a gift for someone, or a treat for yourself?" },
  { message: "Let's find the right thing together.", question: "Any special occasion behind this, or just because?" },
  { message: "Great, I'd love to help with this.", question: "Who are you shopping for today?" },
  { message: "Sure, let's figure this out.", question: "Would they prefer something practical or something more indulgent and special?" },
];

function getFallback(turnCount) {
  return FALLBACKS[turnCount % FALLBACKS.length];
}

// ─── MAIN AGENT ─────────────────────────────────────────────────────────────
async function processMessage(sessionId, userMessage, moodTiles = []) {
  const session = getSession(sessionId);
  const insights = getInsightCollector();

  // Load catalog
  let catalog = [];
  try {
    catalog = await getCatalog();
    session.catalogSnapshot = catalog;
  } catch (err) {
    console.error('[Agent] Catalog fetch failed:', err.message);
  }

  // L6: inject mood tiles
  const fullMessage = moodTiles.length > 0
    ? `${userMessage} [Mood tiles selected: ${moodTiles.join(', ')}]`
    : userMessage;

  session.history.push({ role: 'user', content: fullMessage });

  const systemPrompt = buildSystemPrompt(catalog, session);

  // Build messages for Groq (same OpenAI-compatible format)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...session.history.map(h => ({ role: h.role, content: h.content })),
  ];

  let parsed = null;
  let rawResponse = '';

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      if (attempt === 2) {
        // Add stricter instruction on retry
        messages[0].content += '\n\nCRITICAL: Output ONLY the JSON object. Start with { end with }. No other text.';
      }

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        temperature: 0.4,
        messages,
      });

      rawResponse = response.choices[0].message.content.trim();

      // Strip markdown fences if model adds them
      const cleaned = rawResponse
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      // Extract JSON if there's text before/after
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON object found in response');

      parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.stage || !parsed.message) throw new Error('Missing required fields');
      break;

    } catch (err) {
      console.error(`[Agent] Attempt ${attempt} failed:`, err.message);
      if (attempt === 2) {
        const fb = getFallback(session.turnCount);
        parsed = {
          stage: 'narrowing',
          message: fb.message,
          question: fb.question,
          intent: { emotion: [], persona: [], occasion: null, priceMax: null, priceMin: null, moodTiles: [], relationshipSignal: '', unstatedConstraints: '' },
          recommendation: { handle: null, confidence: null, reason: null, matchDimensions: [], caveat: null },
          comparison: { product1Handle: null, product2Handle: null, dimension: null, verdict: null },
          regretPrevention: { objection: null, answer: null },
          upsell: { handle: null, framing: null },
          recipientProfileUpdate: { relationship: null, preferences: [], occasion: null },
          catalogGap: null,
          insightSignal: { emotionConverting: null, dropoffRisk: 'high', dropoffReason: 'LLM parse failure' },
        };
      }
    }
  }

  // Add assistant turn to history
  session.history.push({ role: 'assistant', content: rawResponse || JSON.stringify(parsed) });
  session.turnCount++;

  // L1: merge intent
  if (parsed.intent) mergeIntent(session.extractedIntent, parsed.intent);

  // L10: recipient profile
  if (parsed.recipientProfileUpdate?.relationship) {
    session.recipientProfile = {
      ...session.recipientProfile,
      ...parsed.recipientProfileUpdate,
      lastUpdated: new Date().toISOString(),
    };
  }

  // L11: insights
  if (parsed.insightSignal) {
    getInsightCollector().record({
      sessionId,
      turn: session.turnCount,
      stage: parsed.stage,
      emotionTags: parsed.intent?.emotion || [],
      recommendedHandle: parsed.recommendation?.handle,
      confidence: parsed.recommendation?.confidence,
      dropoffRisk: parsed.insightSignal.dropoffRisk,
      dropoffReason: parsed.insightSignal.dropoffReason,
    });
  }

  if (parsed.catalogGap) recordCatalogGap(parsed.catalogGap);
  if (parsed.recommendation?.confidence) {
    session.confidenceHistory.push(parsed.recommendation.confidence);
  }

  // Validate recommendation handle
  let recommendedProduct = null;
  if (parsed.recommendation?.handle && catalog.length > 0) {
    recommendedProduct = catalog.find(p => p.handle === parsed.recommendation.handle);
    if (!recommendedProduct) {
      console.warn(`[Agent] Invalid handle: "${parsed.recommendation.handle}" — trying fuzzy match`);
      const key = parsed.recommendation.handle.split('-')[0];
      recommendedProduct = catalog.find(p => p.handle.startsWith(key) || p.title.toLowerCase().includes(key));
      if (recommendedProduct) {
        parsed.recommendation.handle = recommendedProduct.handle;
      } else {
        parsed.recommendation.handle = null;
        if (parsed.stage === 'recommendation') parsed.stage = 'narrowing';
      }
    }
  }

  // L7: social proof
  const socialProof = recommendedProduct?.socialProof || null;

  // L8: regret prevention — always fire when a product is recommended
  // Populated from metafields regardless of stage, so it always appears with the recommendation
  if (recommendedProduct) {
    if (recommendedProduct.regretObjection && !parsed.regretPrevention?.objection) {
      parsed.regretPrevention = {
        objection: recommendedProduct.regretObjection,
        answer: recommendedProduct.regretAnswer,
      };
    }
  }

  // L9: upsell
  let upsellProduct = null;
  if (parsed.upsell?.handle) {
    upsellProduct = catalog.find(p => p.handle === parsed.upsell.handle);
  }
  if (!upsellProduct && recommendedProduct?.complementaryHandles?.length) {
    for (const h of recommendedProduct.complementaryHandles) {
      upsellProduct = catalog.find(p => p.handle === h);
      if (upsellProduct) {
        parsed.upsell = {
          handle: h,
          framing: `People who loved the ${recommendedProduct.title} also picked this up — it makes the gift feel complete.`,
        };
        break;
      }
    }
  }

  saveSession(session);

  return {
    stage: parsed.stage,
    message: parsed.message,
    question: parsed.question,
    recommendation: recommendedProduct ? { ...parsed.recommendation, product: recommendedProduct, socialProof } : null,
    comparison: parsed.comparison?.product1Handle ? parsed.comparison : null,
    regretPrevention: parsed.regretPrevention?.objection ? parsed.regretPrevention : null,
    upsell: upsellProduct ? { ...parsed.upsell, product: upsellProduct } : null,
    recipientProfile: session.recipientProfile,
    turnCount: session.turnCount,
    confidenceHistory: session.confidenceHistory,
  };
}

// L6: mood tile entry point
async function processMoodTiles(sessionId, selectedTiles) {
  return processMessage(sessionId, `I am drawn to things that feel: ${selectedTiles.join(', ')}`, selectedTiles);
}

function mergeIntent(existing, newIntent) {
  if (newIntent.emotion?.length) existing.emotion = [...new Set([...(existing.emotion||[]), ...newIntent.emotion])];
  if (newIntent.persona?.length) existing.persona = [...new Set([...(existing.persona||[]), ...newIntent.persona])];
  if (newIntent.occasion) existing.occasion = newIntent.occasion;
  if (newIntent.priceMax) existing.priceMax = newIntent.priceMax;
  if (newIntent.priceMin) existing.priceMin = newIntent.priceMin;
  if (newIntent.moodTiles?.length) existing.moodTiles = [...new Set([...(existing.moodTiles||[]), ...newIntent.moodTiles])];
  if (newIntent.relationshipSignal) existing.relationshipSignal = newIntent.relationshipSignal;
}

function getRecipientProfile(sessionId) {
  return sessions[sessionId]?.recipientProfile || null;
}

module.exports = { processMessage, processMoodTiles, getSession, getRecipientProfile };
