# ShopMind — Demo Video Script
## Kasparro Agentic Commerce Hackathon | Track 1: AI Shopping Agent
## Target length: 3–5 minutes

---

## BEFORE YOU RECORD

**Setup checklist:**
- [ ] Run `npm run seed` — confirm ~40 products are in Shopify store
- [ ] Start server with `npm start` — confirm localhost:3000 loads
- [ ] Open localhost:3000 in a clean browser window (no extensions visible)
- [ ] Open localhost:3000/insights in a second tab (for the dashboard section)
- [ ] Have a screen recorder ready (OBS, Loom, or Screencastify)
- [ ] Upload to YouTube as **Unlisted** or Google Drive after recording
- [ ] Paste the link into README.md replacing YOUR_DEMO_VIDEO_LINK_HERE

---

## SCRIPT

### [0:00–0:30] OPENING — The problem and what ShopMind does

**Show:** The localhost:3000 page loading — mood canvas visible

**Narrate:**
> "Shopping online today means browsing through lists, filtering, comparing specs, and still not being sure. ShopMind replaces the entire browse-search-filter-compare loop with a single conversation.
>
> It's built for Track 1 of the Kasparro Agentic Commerce Hackathon — an AI shopping agent that understands what you actually need, narrows intelligently, and walks you to a purchase with confidence.
>
> Let me show you how it works."

---

### [0:30–1:00] MOOD CANVAS — Non-verbal entry (L6)

**Show:** The mood canvas with 12 tiles. Slowly select 3: "Warm", "Handmade", "Gentle"

**Narrate:**
> "Instead of typing, ShopMind lets you start by picking how you want the gift to *feel*. These mood tiles map to product emotion tags in our Shopify catalog — no search query needed.
>
> I'll pick Warm, Handmade, and Gentle — and hit 'Start with these vibes'."

**Action:** Click submit. Show ShopMind's warm opening response appear.

---

### [1:00–2:30] CONVERSATION FLOW — All 5 Track 1 criteria

**Narrate as you type:**
> "Or I can just describe it. Let me type: 'I need a gift for my mom's birthday — something she'd actually use.'"

**[After response appears]**
> "ShopMind asks ONE smart question — not a survey. It has detected the relationship and occasion, and now it's narrowing on what she values."

**Type the answer:** "She loves skincare and anything that feels luxurious but not over the top."

**[After next response]**
> "Confidence is now above 75. It's recommending one product — not a list. Watch what appears."

**[Recommendation card loads — highlight each element:]**
> "The product card shows the match confidence — 89% — with the specific reason: it references my exact words. This is L4 — the confidence scoring and reason articulation.

> Below that, social proof — not aggregate star ratings. It shows who else bought this and why it worked for them. Someone who also bought for a picky mom. This is L7 — contextual social proof."

---

### [2:30–3:15] REGRET PREVENTION + UPSELL + CART

**[Scroll to regret card]**
> "Before checkout, ShopMind surfaces the most likely reason you'd return it — and answers it proactively. This is L8. Nobody else does this."

**[Show upsell card]**
> "It then suggests one complementary product — framed as completing the experience, not as an add-on. No pushy cross-sell. Just: 'this makes the gift feel complete.' L9."

**[Click 'Add to Cart']**
> "One tap. No redirect to a product page. The conversation IS the checkout funnel. A draft order is created in Shopify and the checkout link is delivered right here. L5 — frictionless cart path."

---

### [3:15–3:45] MERCHANT INSIGHTS DASHBOARD (L11)

**Switch to the /insights tab**

**Narrate:**
> "Every conversation generates signal for the merchant. This is the Merchant Insights dashboard — live data from every session.

> Emotion tags that are converting. The conversation stage funnel — where buyers are dropping off. Products with high confidence but low cart adds — a pricing friction signal.

> This is L11 — and it's directly aligned with Kasparro's mission: building infrastructure for agentic commerce, not just a chatbot."

---

### [3:45–4:15] CLOSING — What this becomes

**Return to the main chat interface**

**Narrate:**
> "ShopMind is built on Shopify's Admin API — not the Storefront API — because our entire intelligence layer lives in custom metafields: emotion tags, persona matching, occasion context, social proof, and regret prevention data. That's what separates this from a keyword search with a chat skin.

> The decision layer of commerce — the moment between 'I want something' and 'I bought it' — is owned by nobody today. ShopMind is built to own it.

> Thank you."

---

## TIPS FOR A STRONG RECORDING

- Speak at a natural pace — don't rush through the UI
- Pause briefly when a new UI element loads so viewers can see it
- If the LLM is slow to respond, narrate what's about to appear: "ShopMind is parsing the emotional intent now..."
- Record at 1280×800 or higher
- If you make a mistake, don't restart — just keep going, edit in post if needed
- The video doesn't need to be perfect. Clarity of thinking matters more than production quality.

---

## WHAT TO HIGHLIGHT (aligns with judging criteria)

| Moment in video | Judging criterion it demonstrates |
|----------------|----------------------------------|
| Mood canvas selection | Originality 15% — non-verbal input, nobody else has this |
| One-question narrowing | Product Thinking 25% — one question rule explained |
| Confidence score UI | Product Experience 20% — transparent AI reasoning |
| Regret prevention card | Business Relevance 15% — reduces return rate |
| One-tap cart | Product Experience 20% — frictionless path to purchase |
| Merchant insights dashboard | Technical Execution 25% + Business Relevance 15% |
| Admin API mention | Technical Execution 25% — correct architecture choice |
EOF
