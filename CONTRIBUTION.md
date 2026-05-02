# Contribution Note — ShopMind

## Team Structure

| Role | Responsibilities |
|------|-----------------| 
| **Product Lead** | Problem framing, user journey design, all documentation (Product Document, Technical Document, Decision Log), demo script, scope decisions, judging rubric alignment |
| **Engineering Lead** | Shopify Admin API integration, metafield architecture, Groq prompt engineering, confidence scoring pipeline, failure handling implementation, git history, README |
| **Shared** | Mood canvas UI design, demo video recording, metafield tagging of synthetic product catalog |

## AI Tools Used

- **Groq API (llama-3.3-70b-versatile, free tier):** Core conversational agent — powers L1–L11 reasoning, intent parsing, confidence scoring, regret prevention, and all agent responses in production code.
- **Claude (Anthropic):** Used for documentation drafting and prompt refinement during development. Not used in production code.
- **Cursor:** Code editing acceleration.

All AI tool usage is disclosed per hackathon eligibility rules.

All architectural decisions, product reasoning, and documentation are original work. AI tools were used to accelerate implementation, not replace thinking.

## Time Split (approximate)

- Product thinking and documentation: 40%
- Engineering and implementation: 45%
- Demo, catalog, and submission: 15%

## What Each Person Can Defend

The **engineering lead** can walk through: the Shopify GraphQL queries, the metafield schema design choices, the AI/deterministic boundary in the code, the retry and fallback logic, the session state architecture, and why Admin API was chosen over Storefront API.

The **product lead** can walk through: why each of the 11 logics was included, why gifting was chosen as the beachhead category, every scope cut and the reasoning behind it, the confidence threshold decisions, the DPDP compliance note for L10, and the business model.
