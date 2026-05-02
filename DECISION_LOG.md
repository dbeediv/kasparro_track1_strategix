# ShopMind — Decision Log

> Running record of every significant build decision. Format: what we considered → what we chose → why. Written during the build, not after.

---

## D01 — Shopify API: Storefront vs Admin
**Considered:** Storefront API (simpler, public-safe)  
**Chose:** Admin API (GraphQL)  
**Why:** Storefront API has no access to custom metafields. Our entire intelligence layer — emotion_tags, persona, occasion, social_proof, regret_objection — lives in metafields. Without Admin API, ShopMind is just a keyword search. The security tradeoff (server-side calls required) is accepted. Admin API is irreplaceable for the architecture.

---

## D02 — Track selection
**Considered:** Track 1 (AI Shopping Agent), Track 5 (AI Representation Optimizer)  
**Chose:** Track 1  
**Why:** Track 1 maps directly to the buyer-side problem we care about — the decision layer. Track 5 is interesting but requires real merchant store data we don't have access to in a dev context. Track 1 lets us build and validate the full 11-logic pipeline on synthetic data, which is explicitly permitted by the hackathon guidelines.

---

## D03 — Product category: gifting vs skincare vs electronics
**Considered:** Skincare (high product density), electronics (high price clarity), gifting (highest emotional complexity)  
**Chose:** Gifting  
**Why:** Gifting is the hardest emotional context in ecommerce. The buyer is not shopping for themselves — they are navigating guilt, love, time pressure, and budget anxiety simultaneously. If L1 (emotional intent parsing) works for gifting, it works for any category. The hardest test case proves the most. Electronics has lower emotional complexity; skincare has more objective product attributes. Gifting maximises the value of every logic we built.

---

## D04 — Catalog size: 40 products
**Considered:** 10 products (too small, narrowing is trivial), 100+ products (metafield tagging becomes inconsistent)  
**Chose:** ~40 products  
**Why:** 40 gives 6-10 products per occasion type — enough for L2 narrowing to be meaningful but small enough to hand-tag every product's metafields with care. Quality of metafield coverage matters more than quantity. A catalog with 40 perfectly tagged products demonstrates the architecture better than 100 partially tagged ones.

---

## D05 — One question per turn: hard constraint vs soft guideline
**Considered:** Soft guideline (LLM can ask 2 questions if needed), hard constraint (one question, enforced in system prompt)  
**Chose:** Hard constraint  
**Why:** Tested both approaches during prompt design. Soft guideline produced turns where the LLM asked 2-3 questions. Felt interrogative in conversation review. The single question rule forces the LLM to prioritise — to decide which dimension of uncertainty matters most right now. That prioritisation is itself an intelligence signal. The tradeoff: more turns needed to reach high confidence. Accepted. A buyer who completes 3 turns and buys is more valuable than one who abandons after 1 turn with 4 unanswered questions.

---

## D06 — Confidence score: expose to buyer vs hide it
**Considered:** Hide confidence (cleaner UX, avoids alarming buyers with low scores), expose it (transparency, natural escalation trigger)  
**Chose:** Expose — framed as "match strength", not "system confidence"  
**Why:** Hiding it felt dishonest and removed a useful escalation: below 75% confidence is a signal to ask one more question. Framing matters — "91% match" reads as "this product fits you" not "the AI is 91% sure". Tested both framings; "match strength" consistently read as product-fit language, not system-uncertainty language. Risk accepted: a low score might reduce buyer confidence in some cases.

---

## D07 — Mood canvas: text tiles vs image tiles vs colour swatches
**Considered:** Image tiles (visual, more intuitive), colour swatches (aesthetic), text tiles (words like "warm", "minimal", "bold")  
**Chose:** Text tiles  
**Why:** Image tiles require curating a library of photos and introduce aesthetic interpretation inconsistency. Colour swatches don't map cleanly to product emotion_tags. Text tiles map directly to the `mood_tiles` metafield on each product — the mapping is deterministic, not interpreted. Lower implementation cost, more direct data signal, and faster to build correctly in V1.

---

## D08 — Cart: LLM-driven vs fully deterministic
**Considered:** LLM suggests cart action (keeps conversation natural), deterministic code handles all cart mutations  
**Chose:** Deterministic — no exceptions  
**Why:** LLMs hallucinate. Cart operations touch real inventory, real variant IDs, and real payment flows. Any LLM-driven cart operation introduces a failure mode where a hallucinated variant ID gets sent to Shopify. The architectural rule: LLM reasons about what to recommend; deterministic code executes every Shopify mutation. This boundary is non-negotiable and documented in the Technical Document.

---

## D09 — Recipient shadow profile (L10): session-scoped vs cross-session persistent
**Considered:** Persist across sessions (better repeat purchase UX), session-only (simpler, no consent needed)  
**Chose:** Session-scoped by default; persistent storage requires explicit buyer opt-in  
**Why:** India's Digital Personal Data Protection Act (DPDP, 2023) requires consent for storing personal data. Recipient preferences qualify as personal data. Session-scoped by default is DPDP-compliant by design — no data persists without the buyer choosing it. Opt-in persistence is the V1.5 feature once the consent UX is built. Merchant dashboard (L11) receives only aggregated, anonymised signals.

---

## D10 — Social proof (L7): aggregate ratings vs persona-matched reviews
**Considered:** Aggregate star ratings (easy to generate, familiar), persona-matched reviews (requires review_persona metafield, more setup)  
**Chose:** Persona-matched reviews  
**Why:** "4.2 stars, 847 reviews" tells the buyer nothing about whether this product fits their specific situation. A review that says "My daughter bought this for me as a Mother's Day gift and I cried" is 10x more persuasive to a daughter buying a Mother's Day gift. The persona-matching requires the `social_proof` metafield with a structured `{quote, persona}` object — more setup work, dramatically better signal. Aggregate ratings are a commodity; persona-matched proof is differentiation.

---

## D11 — Upsell timing: before recommendation vs after vs before cart
**Considered:** Before recommendation (feels pushy, buyer hasn't decided yet), after cart add (too late, decision is closed), between recommendation and cart  
**Chose:** Between recommendation and cart (after confidence is high, before the buyer commits)  
**Why:** The window where upsell is most effective is: buyer has decided on the main product (confidence is high), but has not yet tapped "add to cart". L9 fires exactly here. Before recommendation feels like being sold to. After cart add is ignored — the buyer is mentally done shopping.

---

## D12 — Failure handling: generic error vs specific response per failure type
**Considered:** Generic "something went wrong" for all failures (simpler), specific defined response per failure type  
**Chose:** Specific response per failure type  
**Why:** A generic error message is useless to the buyer and invisible to debugging. Each failure has a defined detection method, response action, and log behaviour. API down → graceful pause with no LLM call. Malformed JSON → retry once with stricter prompt, then fallback question. Invalid product_id → re-prompt with explicit catalog. The buyer never sees a broken or hallucinated state. Documented in full in Technical Document Section T4.

---

## D13 — Documentation format: Markdown only vs Markdown + PDF
**Considered:** Markdown only (lives in repo, git-trackable), both Markdown and PDF  
**Chose:** Both  
**Why:** DECISION_LOG.md and README.md live in the repo (readable on GitHub, diffable, version-controlled). Product Document and Technical Document are submitted as PDF (required submission format, better for judges to read). The content is the same; the format serves the audience. Duplication is intentional.

---

## D14 — Demo: live demo vs recorded walkthrough
**Considered:** Live demo (shows real system), recorded walkthrough (controlled, no live failure risk)  
**Chose:** Recorded walkthrough, 3-5 minutes, narrated  
**Why:** Live demos fail at the worst moments. A recorded walkthrough with narration demonstrates all 11 logics in sequence, can be edited to show the clearest possible path through each stage, and is replayable by judges. The GitHub repo code is available for verification. The recording is supplemented, not replaced, by the working codebase.

---

## D15 — Node-fetch version: v3 (ESM) vs v2 (CommonJS)
**Considered:** node-fetch v3 (latest, ESM only), node-fetch v2 (CommonJS compatible)  
**Chose:** node-fetch v2 (^2.7.0)  
**Why:** The project uses CommonJS (`require()`). node-fetch v3 is ESM-only and would require converting the entire codebase to ES modules or using dynamic `import()`. The functional difference between v2 and v3 is minimal for our use case (POST requests to Shopify Admin API). v2 is the pragmatic choice that avoids a module system migration in the middle of a build sprint.

---

## D16 — AI provider: Anthropic Claude vs Groq (llama-3.3-70b-versatile)
**Considered:** Anthropic Claude API (paid, high quality output), Groq API (free tier, llama-3.3-70b-versatile)
**Chose:** Groq API (free tier)
**Why:** The hackathon runs on a student timeline with zero budget. Groq's free tier provides sufficient throughput for demo and judging (hundreds of conversations per day at no cost). llama-3.3-70b-versatile handles JSON-structured output, intent parsing, and conversational reasoning at the quality level this use case requires. The AI/deterministic boundary, prompt architecture, and all 11 logics are provider-agnostic by design — switching back to Claude requires changing one environment variable and the SDK import. **Important note:** The Technical Document (drafted before this decision was finalised) references Claude as the AI layer. The production implementation uses Groq. This DECISION_LOG entry documents that change explicitly. All code references reflect the Groq implementation.

---

## D17 — Demo resilience: require seeded Shopify store vs built-in demo catalog fallback
**Considered:** Require a fully seeded Shopify store to run (forces judge to run npm run seed), built-in demo catalog that activates when Shopify returns 0 products
**Chose:** Built-in demo catalog fallback
**Why:** A working demo must not depend on a step the judge might skip. If a judge clones the repo and runs npm start without seeding, the agent must still work and demonstrate all 11 logics. The demo catalog mirrors the real metafield architecture exactly — emotion_tags, personas, occasions, mood_tiles, social_proof, regret_objection — so no logic degrades. When a real seeded catalog exists, it takes precedence automatically. The fallback is never shown to buyers — it is purely a resilience measure.

---

*Log last updated: April 2026. Final version committed with submission.*
