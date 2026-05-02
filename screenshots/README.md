# ShopMind — Screenshots

## Screenshot checklist

| # | Filename | What to capture | Judging criterion |
|---|----------|-----------------|-------------------|
| 1 | `01_mood_canvas.png` | Opening screen — all 12 mood tiles, none selected yet | Originality (L6) |
| 2 | `02_mood_selected.png` | 3 tiles selected (e.g. Warm, Handmade, Gentle) + submit active | Originality (L6) |
| 3 | `03_first_question.png` | ShopMind's warm opening question — one question, not a form | Product Thinking (L2) |
| 4 | `04_narrowing.png` | Second turn — one smart follow-up, showing progress from turn 1 | Product Thinking (L2) |
| 5 | `05_recommendation.png` | Full recommendation card: title, price, confidence bar (e.g. 87%), reason text | Product Experience (L4) |
| 6 | `06_social_proof.png` | Persona-matched quote — someone like the buyer, not star ratings | Product Experience (L7) |
| 7 | `07_regret_card.png` | Regret prevention card — objection surfaced, answer given, before cart | Business Relevance (L8) |
| 8 | `08_upsell_card.png` | Silent upsell card with experience framing, not pushy cross-sell | Business Relevance (L9) |
| 9 | `09_cart_added.png` | Checkout banner after one-tap cart add — no redirect, link delivered in chat | Product Experience (L5) |
| 10 | `10_comparison_card.png` | L3 comparison card when two products are close (trigger: ask about two similar items) | Technical (L3) |
| 11 | `11_return_banner.png` | L10 return visit banner — "Shopping for [name] again?" — appears on 2nd session | Business Relevance (L10) |
| 12 | `12_merchant_insights.png` | /insights dashboard — emotion tags, stage funnel, top products, catalog gaps | Technical (L11) |

## How to trigger each screenshot

**Screenshot 10 (comparison card):** Type something like "I'm torn between the hand cream and the candle — which would my mom prefer more?" after a recommendation has appeared.

**Screenshot 11 (return banner):** Start a new conversation (new session ID), type something mentioning the same recipient as before. If the backend has a recipient profile stored, the banner fires.

**Screenshot 12 (insights dashboard):** Visit localhost:3000/insights after having at least 3-4 conversations. More conversations = richer data.

## Tips

- Crop to browser content only — no OS taskbar or other windows visible
- Minimum resolution: 1280×800
- Screenshots 5, 6, 7, 8 should come from the same single conversation flow — they stack in the UI
- If confidence is low in early turns, that's intentional — it shows the system is genuinely uncertain and asks one more question
