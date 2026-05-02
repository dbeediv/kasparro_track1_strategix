# Git History Guide — ShopMind

> The Kasparro hackathon specifically evaluates git history as a signal of engineering discipline.
> "Atomic commits with meaningful messages show engineering discipline. A single 'final submission' commit shows the opposite."
>
> Follow this guide to create a proper git history before submitting.

## The commit sequence to use

Run these commands in order from your project root. Each commit corresponds to a real build milestone.

```bash
# Initialise
git init
git add .gitignore .env.example
git commit -m "init: project scaffold and environment setup"

# Core infrastructure
git add package.json src/server.js
git commit -m "feat: express server with session init, static serving, route structure"

git add src/shopify/client.js
git commit -m "feat(shopify): Admin API GraphQL client with full metafield support (D01 — Admin over Storefront)"

git add src/shopify/catalog.js
git commit -m "feat(shopify): catalog cache with 5-min TTL, gap tracking for L11, demo fallback catalog"

git add scripts/setup-metafields.js
git commit -m "feat(scripts): metafield definition setup — emotion_tags, persona, occasion, mood_tiles, social_proof"

git add scripts/seed-products.js
git commit -m "feat(scripts): seed 40 synthetic gifting products with full ShopMind metafield architecture (D04 — catalog size)"

# Agent core
git add src/agent/insights.js
git commit -m "feat(L11): merchant insight collector — event recording, session aggregation, emotion/dropoff/funnel tracking"

git add src/agent/shopmind.js
git commit -m "feat(agent): core ShopMind agent — L1-L4 intent parsing, narrowing, confidence scoring via Groq (D16 — Groq over Claude)"

# Routes
git add src/routes/chat.js
git commit -m "feat(routes): chat endpoints — /message and /mood, L6 mood tile processing"

git add src/routes/cart.js
git commit -m "feat(L5): cart route — deterministic draft order creation, no LLM involvement (D08 — cart boundary)"

git add src/routes/insights.js
git commit -m "feat(routes): insights API — GET /api/insights aggregating L11 signal + catalog gaps"

# Frontend
git add public/index.html
git commit -m "feat(ui): buyer chat interface — mood canvas (L6), confidence bar (L4), social proof (L7), regret card (L8), upsell (L9), one-tap cart (L5)"

git add public/insights.html
git commit -m "feat(ui): merchant insights dashboard — emotion tags, dropoff risk, stage funnel, top products, catalog gaps (L11)"

# Failure handling improvements
git add src/agent/shopmind.js src/shopify/catalog.js
git commit -m "fix: retry logic, JSON extraction robustness, fuzzy handle matching, varied fallbacks (D12 — failure handling)"

# Documentation
git add DECISION_LOG.md
git commit -m "docs: decision log — 16 build decisions with reasoning, D09 DPDP compliance note"

git add README.md CONTRIBUTION.md DEMO_SCRIPT.md docs/ screenshots/
git commit -m "docs: product document, technical document, submission materials, demo script"

git add GIT_HISTORY_GUIDE.md docs/TECHNICAL_DOCUMENT_ADDENDUM.md
git commit -m "docs: technical document addendum (D16 Groq decision), git history guide"
```

## After running these commands

1. Create a public GitHub repo named `shopmind`
2. `git remote add origin https://github.com/YOUR_USERNAME/shopmind.git`
3. `git push -u origin main`
4. Paste the repo URL in your submission email

