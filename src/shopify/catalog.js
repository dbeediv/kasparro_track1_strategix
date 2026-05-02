// src/shopify/catalog.js
// In-memory catalog cache + catalog gap tracking for L11 merchant insights

const { getAllProducts } = require('./client');

let _catalog = [];
let _lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Gaps: products buyers asked for but weren't found
const _catalogGaps = {};

async function getCatalog(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && _catalog.length > 0 && now - _lastFetch < CACHE_TTL) {
    return _catalog;
  }
  try {
    const fetched = await getAllProducts();
    if (fetched && fetched.length > 0) {
      _catalog = fetched;
      _lastFetch = now;
      console.log(`[Catalog] Loaded ${_catalog.length} products from Shopify Admin API`);
    } else {
      console.warn('[Catalog] Shopify returned 0 products — using demo catalog. Run `npm run seed` first.');
      _catalog = getDemoCatalog();
      _lastFetch = now;
    }
    return _catalog;
  } catch (err) {
    console.error('[Catalog] Failed to fetch from Shopify:', err.message);
    if (_catalog.length > 0) {
      console.log('[Catalog] Returning stale cache');
      return _catalog;
    }
    console.warn('[Catalog] Falling back to built-in demo catalog');
    _catalog = getDemoCatalog();
    return _catalog;
  }
}

// Demo catalog — active when Shopify store has no products yet (before running `npm run seed`)
// Mirrors the real metafield architecture so all 11 logics work end-to-end
function getDemoCatalog() {
  return [
    {
      id: 'demo-1', variantId: 'demo-v-1',
      handle: 'sandalwood-rose-hand-cream-duo',
      title: 'Sandalwood & Rose Hand Cream Duo',
      description: 'A luxurious pair of hand creams — warm sandalwood and delicate rose — gift-wrapped and ready. Deeply moisturising, long-lasting, and beautifully presented.',
      price: 1299, priceFormatted: '₹1,299', available: true, image: null, tags: ['skincare', 'gifting', 'her'],
      emotionTags: ['warmth', 'love', 'nurture', 'luxury'],
      personas: ['picky-mom', 'self-indulgent', 'wellness-seeker'],
      occasions: ['birthday', 'mothers-day', 'anniversary', 'just-because'],
      moodTiles: ['warm', 'floral', 'gentle', 'handmade'],
      socialProof: { quote: 'My mom cried when she opened this. She uses it every single morning now.', persona: 'Daughter, gifted for Mother\'s Day' },
      complementaryHandles: ['soy-candle-bloom'],
      regretObjection: 'What if she already has hand cream?',
      regretAnswer: 'The presentation alone makes this special — it\'s the thought of choosing something beautiful for her skin, not just any cream.',
    },
    {
      id: 'demo-2', variantId: 'demo-v-2',
      handle: 'soy-candle-bloom',
      title: 'Soy Candle — Bloom',
      description: 'Hand-poured soy wax candle with jasmine and white tea. 45-hour burn time. Cotton wick, recycled glass jar. Made in small batches.',
      price: 899, priceFormatted: '₹899', available: true, image: null, tags: ['candle', 'home', 'gifting'],
      emotionTags: ['calm', 'warmth', 'nostalgia', 'self-care'],
      personas: ['home-nester', 'self-indulgent', 'wellness-seeker'],
      occasions: ['birthday', 'housewarming', 'just-because', 'anniversary'],
      moodTiles: ['warm', 'minimal', 'handmade', 'gentle'],
      socialProof: { quote: 'It fills the entire room with the gentlest scent. I\'ve bought three now.', persona: 'Regular buyer, self-purchase' },
      complementaryHandles: ['sandalwood-rose-hand-cream-duo'],
      regretObjection: 'Will the fragrance be too strong?',
      regretAnswer: 'Bloom is specifically blended to be calming, not overpowering. Very safe for sensitive noses.',
    },
    {
      id: 'demo-3', variantId: 'demo-v-3',
      handle: 'leather-journal-cognac',
      title: 'Leather Journal — Cognac',
      description: 'Full-grain leather journal with cream-white acid-free pages. Lay-flat binding. Pen loop included. A gift for someone who thinks in ink.',
      price: 1799, priceFormatted: '₹1,799', available: true, image: null, tags: ['stationery', 'gifting', 'him', 'her'],
      emotionTags: ['nostalgia', 'aspiration', 'intention', 'thoughtful'],
      personas: ['thoughtful-writer', 'creative-professional', 'tech-dad'],
      occasions: ['birthday', 'graduation', 'promotion', 'just-because'],
      moodTiles: ['classic', 'minimal', 'bold', 'handmade'],
      socialProof: { quote: 'He carries it everywhere now. Said it finally made him feel like a writer.', persona: 'Partner, gifted for birthday' },
      complementaryHandles: ['brass-fountain-pen'],
      regretObjection: 'What if they prefer digital notes?',
      regretAnswer: 'The leather journal is a statement that their thoughts deserve permanence — often restarts the habit.',
    },
    {
      id: 'demo-4', variantId: 'demo-v-4',
      handle: 'brass-fountain-pen',
      title: 'Brass Fountain Pen',
      description: 'Solid brass body, medium nib, converter included. Writes like a dream. Heavy enough to feel intentional. A pen for someone who writes with purpose.',
      price: 2499, priceFormatted: '₹2,499', available: true, image: null, tags: ['stationery', 'gifting', 'him', 'her'],
      emotionTags: ['aspiration', 'prestige', 'intention', 'bold'],
      personas: ['creative-professional', 'tech-dad', 'thoughtful-writer'],
      occasions: ['graduation', 'promotion', 'birthday', 'farewell'],
      moodTiles: ['bold', 'classic', 'minimal'],
      socialProof: { quote: 'My boss keeps it on display on his desk. Said it was the best pen he\'d ever held.', persona: 'Employee, farewell gift' },
      complementaryHandles: ['leather-journal-cognac'],
      regretObjection: 'What if they don\'t write much?',
      regretAnswer: 'A beautiful pen often restarts the habit. And even as a desk piece, it signals intention.',
    },
    {
      id: 'demo-5', variantId: 'demo-v-5',
      handle: 'silk-sleep-mask',
      title: 'Silk Sleep Mask — Ivory',
      description: '22-momme mulberry silk, adjustable strap, fully blocks light. Cool to the touch. The kind of small luxury that improves every morning.',
      price: 999, priceFormatted: '₹999', available: true, image: null, tags: ['sleep', 'self-care', 'gifting', 'her'],
      emotionTags: ['calm', 'luxury', 'self-care', 'nurture'],
      personas: ['self-indulgent', 'wellness-seeker', 'picky-mom'],
      occasions: ['birthday', 'just-because', 'mothers-day', 'anniversary'],
      moodTiles: ['gentle', 'minimal', 'warm', 'luxury'],
      socialProof: { quote: 'I genuinely sleep better. A small gift that became a daily essential.', persona: 'Self-buyer, gifted to herself' },
      complementaryHandles: ['soy-candle-bloom'],
      regretObjection: 'Will the strap fit?',
      regretAnswer: 'Fully adjustable with a soft velcro closure — fits all head sizes comfortably.',
    },
    {
      id: 'demo-6', variantId: 'demo-v-6',
      handle: 'ceramic-pour-over',
      title: 'Ceramic Pour-Over Set',
      description: 'Handmade ceramic dripper and carafe. For the person who believes morning coffee is a ritual, not a routine. One cup at a time.',
      price: 2199, priceFormatted: '₹2,199', available: true, image: null, tags: ['coffee', 'kitchen', 'gifting', 'him', 'her'],
      emotionTags: ['ritual', 'calm', 'aspiration', 'intention'],
      personas: ['coffee-lover', 'home-nester', 'creative-professional'],
      occasions: ['housewarming', 'birthday', 'just-because', 'graduation'],
      moodTiles: ['minimal', 'handmade', 'warm', 'natural'],
      socialProof: { quote: 'He wakes up 20 minutes earlier just to do the pour-over. That\'s how much he loves it.', persona: 'Partner, gifted for birthday' },
      complementaryHandles: ['specialty-coffee-box'],
      regretObjection: 'What if they already have a coffee machine?',
      regretAnswer: 'Pour-over is a different ritual — intentional, meditative, manual. It coexists with machines.',
    },
    {
      id: 'demo-7', variantId: 'demo-v-7',
      handle: 'specialty-coffee-box',
      title: 'Specialty Coffee Box — Single Origin',
      description: 'Three 100g bags of single-origin beans from Ethiopia, Colombia, and Sumatra. Roasted to order, shipped within 48 hours. Tasting notes included.',
      price: 1499, priceFormatted: '₹1,499', available: true, image: null, tags: ['coffee', 'gifting', 'him', 'her'],
      emotionTags: ['aspiration', 'ritual', 'discovery', 'warmth'],
      personas: ['coffee-lover', 'foodie', 'creative-professional'],
      occasions: ['birthday', 'just-because', 'housewarming', 'farewell'],
      moodTiles: ['warm', 'bold', 'natural'],
      socialProof: { quote: 'He said it ruined supermarket coffee for him forever. I take that as a win.', persona: 'Partner, birthday gift' },
      complementaryHandles: ['ceramic-pour-over'],
      regretObjection: 'What if they don\'t like one of the origins?',
      regretAnswer: 'Three different origins means at least one becomes a favourite. Discovery is the point.',
    },
    {
      id: 'demo-8', variantId: 'demo-v-8',
      handle: 'handwoven-tote-natural',
      title: 'Handwoven Tote — Natural',
      description: 'Woven by artisans in Kutch, Gujarat. Natural cotton, vegetable dye accents, reinforced handles. A bag that gets better with every use.',
      price: 1599, priceFormatted: '₹1,599', available: true, image: null, tags: ['bag', 'gifting', 'her', 'sustainable', 'artisan'],
      emotionTags: ['warmth', 'authenticity', 'nostalgia', 'thoughtful'],
      personas: ['eco-conscious', 'creative-professional', 'picky-mom'],
      occasions: ['birthday', 'just-because', 'housewarming'],
      moodTiles: ['handmade', 'warm', 'natural', 'bold'],
      socialProof: { quote: 'Everyone asks where she got it. They never believe it was a gift.', persona: 'Gifter, friend\'s birthday' },
      complementaryHandles: [],
      regretObjection: 'Is it practical for everyday use?',
      regretAnswer: 'Large enough for a laptop, groceries, or a full gym kit. Designed to last years, not seasons.',
    },
    {
      id: 'demo-9', variantId: 'demo-v-9',
      handle: 'aromatherapy-roll-on-set',
      title: 'Aromatherapy Roll-On Set — 3 Moods',
      description: 'Three 10ml roll-ons: Focus (eucalyptus + rosemary), Calm (lavender + chamomile), Energy (citrus + peppermint). For the person who wants to feel different on demand.',
      price: 1199, priceFormatted: '₹1,199', available: true, image: null, tags: ['wellness', 'gifting', 'her', 'him'],
      emotionTags: ['self-care', 'calm', 'intention', 'nurture'],
      personas: ['wellness-seeker', 'creative-professional', 'self-indulgent'],
      occasions: ['birthday', 'just-because', 'farewell', 'mothers-day'],
      moodTiles: ['natural', 'gentle', 'minimal', 'warm'],
      socialProof: { quote: 'I use the Calm one every night. She uses the Focus one before every meeting. Best gift I\'ve given.', persona: 'Gifter, colleague\'s birthday' },
      complementaryHandles: ['linen-eye-pillow'],
      regretObjection: 'What if they\'re sensitive to fragrance?',
      regretAnswer: 'All three are plant-derived, not synthetic. Very low allergen profile. Suitable for most skin types.',
    },
    {
      id: 'demo-10', variantId: 'demo-v-10',
      handle: 'linen-eye-pillow',
      title: 'Linen Eye Pillow — Lavender',
      description: 'Weighted eye pillow filled with organic flaxseed and dried lavender. For yoga, rest, or just ten quiet minutes. Cold or warm therapy.',
      price: 699, priceFormatted: '₹699', available: true, image: null, tags: ['wellness', 'yoga', 'gifting', 'her'],
      emotionTags: ['calm', 'self-care', 'nurture', 'warmth'],
      personas: ['wellness-seeker', 'picky-mom', 'self-indulgent'],
      occasions: ['birthday', 'just-because', 'mothers-day'],
      moodTiles: ['gentle', 'natural', 'warm', 'handmade'],
      socialProof: { quote: 'She uses it every single night. Said it\'s the only thing that actually quiets her mind.', persona: 'Daughter, gifted for Mother\'s Day' },
      complementaryHandles: ['aromatherapy-roll-on-set'],
      regretObjection: 'Is the lavender scent strong?',
      regretAnswer: 'Subtle and natural — fades after first few uses to a very gentle scent. Nothing synthetic.',
    },
    {
      id: 'demo-11', variantId: 'demo-v-11',
      handle: 'desk-wellness-kit',
      title: 'Desk Wellness Kit',
      description: 'Five desk essentials: eye roll-on, hand balm, focus incense, mini diffuser, and a wrist rest. For every desk that needs more care.',
      price: 1999, priceFormatted: '₹1,999', available: true, image: null, tags: ['wellness', 'office', 'gifting', 'him', 'her'],
      emotionTags: ['care', 'self-care', 'intention', 'nurture'],
      personas: ['creative-professional', 'wellness-seeker', 'work-from-home', 'tech-dad'],
      occasions: ['birthday', 'farewell', 'just-because', 'promotion'],
      moodTiles: ['minimal', 'gentle', 'natural'],
      socialProof: { quote: 'My colleague said it changed his workdays. Said the hand balm alone was worth it.', persona: 'Manager, farewell gift' },
      complementaryHandles: [],
      regretObjection: 'Is this too personal for a workplace gift?',
      regretAnswer: 'Nothing gendered or intimate. Reads as thoughtful and considerate — exactly right for a colleague.',
    },
    {
      id: 'demo-12', variantId: 'demo-v-12',
      handle: 'artisan-chocolate-box',
      title: 'Artisan Chocolate Box — Dark Collection',
      description: 'Nine single-origin dark chocolates, 70-85% cacao, from Indian cacao farms. Tasting notes and origin cards included. Not a chocolate box. An education.',
      price: 1299, priceFormatted: '₹1,299', available: true, image: null, tags: ['chocolate', 'food', 'gifting', 'him', 'her'],
      emotionTags: ['indulgence', 'discovery', 'warmth', 'nostalgia'],
      personas: ['foodie', 'self-indulgent', 'creative-professional'],
      occasions: ['birthday', 'anniversary', 'just-because', 'housewarming'],
      moodTiles: ['bold', 'warm', 'natural', 'handmade'],
      socialProof: { quote: 'She said she\'s never thought about where chocolate comes from before. Now she can\'t stop.', persona: 'Partner, anniversary gift' },
      complementaryHandles: [],
      regretObjection: 'What if they don\'t like dark chocolate?',
      regretAnswer: 'The 70% bars are approachable for most palates. The tasting notes guide them through the range.',
    },
  ];
}

// Record a catalog gap (L11 merchant insight)
function recordCatalogGap(description) {
  const key = description.toLowerCase().trim().slice(0, 60);
  _catalogGaps[key] = (_catalogGaps[key] || 0) + 1;
}

function getCatalogGaps() {
  return Object.entries(_catalogGaps)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([desc, count]) => ({ description: desc, count }));
}

// Filter products by emotion tags, personas, occasions, price
function filterProducts(catalog, filters = {}) {
  let results = catalog.filter(p => p.available);

  if (filters.emotions?.length) {
    results = results.filter(p =>
      filters.emotions.some(e => p.emotionTags.includes(e) || p.tags.includes(e))
    );
  }
  if (filters.personas?.length) {
    results = results.filter(p =>
      filters.personas.some(pe => p.personas.includes(pe))
    );
  }
  if (filters.occasions?.length) {
    results = results.filter(p =>
      filters.occasions.some(o => p.occasions.includes(o))
    );
  }
  if (filters.moodTiles?.length) {
    results = results.filter(p =>
      filters.moodTiles.some(m => p.moodTiles.includes(m) || p.emotionTags.includes(m))
    );
  }
  if (filters.maxPrice) {
    results = results.filter(p => p.price <= filters.maxPrice);
  }
  if (filters.minPrice) {
    results = results.filter(p => p.price >= filters.minPrice);
  }
  return results;
}

module.exports = { getCatalog, filterProducts, recordCatalogGap, getCatalogGaps };
