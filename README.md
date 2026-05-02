# ShopMind — AI Shopping Agent

> **The invisible decision brain for agentic commerce.**  
> Built for **Kasparro Agentic Commerce Hackathon, April 2026** — Track 1: AI Shopping Agent.

**[▶ Demo Video](https://drive.google.com/file/d/1sTmgXyCLk_L-P4AJdEHZvietXVzu7xNC/view?pli=1) | **[Product Document](docs/ShopMind_Product_Document.pdf)** | **[Technical Document](docs/ShopMind_Technical_Document.pdf)** | **[Decision Log](DECISION_LOG.md)**

---

## The Problem

Shopping online means browsing through lists, applying filters, comparing specs, and still not being sure. AI shopping assistants today are glorified search bars with a chat interface — they find products, but they don't help you decide.

ShopMind replaces the entire browse-search-filter-compare loop with a single conversation. It understands what the buyer actually needs, narrows intelligently through one smart question at a time, recommends with a confidence score and plain-English reason, and supports a clean one-tap path to purchase — without showing a single product list.

**The gap ShopMind fills:** the decision layer of commerce — the moment between "I want something" and "I bought it" — is owned by nobody today.

---

## 11 Integrated Logics

| Logic | Feature | What it satisfies |
|-------|---------|------------------|
| L1 | Emotional intent parser | Understand what the user actually needs |
| L2 | One-question progressive narrowing | Narrow options intelligently |
| L3 | Dimension-aware comparison card | Compare products on what matters |
| L4 | Confidence score + plain-English reason | Explain recommendations clearly |
| L5 | One-tap cart (no redirect) | Clean path to checkout |
| L6 | Mood canvas (non-verbal entry) | Originality — zero typing required |
| L7 | Persona-matched social proof | Build trust naturally |
| L8 | Regret prevention before checkout | Reduce returns |
| L9 | Silent upsell (experience framing) | Higher AOV without pushiness |
| L10 | Recipient shadow profile + return banner | LTV and repeat purchase engine |
| L11 | Merchant insights dashboard at /insights | Commerce infrastructure signal |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Free Shopify Partner account → [partners.shopify.com](https://partners.shopify.com)
- Free Groq API key → [console.groq.com](https://console.groq.com)

### 1. Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/shopmind.git
cd shopmind
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Fill in your values — see .env.example for instructions
```

Required values:
```
SHOPIFY_STORE_DOMAIN=shopmind-a48eho1s.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=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
SHOPIFY_API_VERSION=2024-01
PORT=3000
NODE_ENV=development
SESSION_SECRET=shopmind-secret-change-this-in-production

GROQ_API_KEY=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

```

**Shopify Admin API scopes needed:**
`read_products`, `write_products`, `write_draft_orders`, `read_draft_orders`, `read_inventory`

> Why Admin API (not Storefront)? The Storefront API doesn't expose custom metafields.
> Our entire intelligence layer lives in metafields. See Decision D01 in DECISION_LOG.md.

### 3. Create metafield definitions (run once)
```bash
npm run setup
```

### 4. Seed the product catalog (run once)
```bash
npm run seed
```
Creates 40 curated gifting products with full ShopMind metafield architecture:
`emotion_tags`, `persona`, `occasion`, `mood_tiles`, `social_proof`, `complementary`, `regret_objection`, `regret_answer`

### 5. Start
```bash
npm start
```

- Buyer interface: [http://localhost:3000](http://localhost:3000)
- Merchant insights: [http://localhost:3000/insights](http://localhost:3000/insights)

---

## Project Structure

```
shopmind/
├── src/
│   ├── agent/
│   │   ├── shopmind.js        # Core agent — all 11 logics (Groq-powered)
│   │   └── insights.js        # L11 merchant insight collector
│   ├── shopify/
│   │   ├── client.js          # Shopify Admin API GraphQL client
│   │   └── catalog.js         # Catalog cache + gap tracking
│   ├── routes/
│   │   ├── chat.js            # /api/chat endpoints
│   │   ├── cart.js            # /api/cart/add (deterministic)
│   │   └── insights.js        # /api/insights
│   └── server.js
├── public/
│   ├── index.html             # Buyer chat UI — mood canvas, all 11 logic cards
│   └── insights.html          # Merchant insights dashboard
├── scripts/
│   ├── seed-products.js       # Seeds 40 synthetic gifting products with metafields
│   └── setup-metafields.js    # Creates metafield definitions in Shopify
├── docs/
│   ├── ShopMind_Product_Document.pdf
│   ├── ShopMind_Technical_Document.pdf
│   └── ShopMind_Decision_Log_formatted.pdf
├── screenshots/               # UI screenshots — see screenshots/README.md
├── DECISION_LOG.md            # 15 documented build decisions
├── CONTRIBUTION.md            # Team roles and AI tools used
└── README.md
```

---

## Architecture

```
Buyer input
    ↓
[AI layer — Groq llama-3.3-70b-versatile, free tier]
  L1 intent parsing, L2 narrowing, L3 comparison,
  L4 confidence scoring, L7 social proof framing,
  L8 regret prevention, L9 upsell framing
    ↓
[Deterministic layer — rule-based, never LLM]
  L5 cart add, product handle validation, confidence threshold,
  L10 recipient profile update, L11 insight recording
    ↓
[Shopify Admin API — GraphQL]
  Full catalog, custom metafields, draft order creation
    ↓
[Dev store — 40 synthetic gifting products]
```

---

## Screenshots

See [`screenshots/README.md`](screenshots/README.md) for the screenshot guide.

---

## Documentation

| File | Contents |
|------|---------|
| [Product Document](docs/ShopMind_Product_Document.pdf) | What/why/who, scope decisions, tradeoffs, what NOT built |
| [Technical Document](docs/ShopMind_Technical_Document.pdf) | Architecture, metafield schema, failure handling, AI/deterministic boundary |
| [Technical Document Addendum](docs/TECHNICAL_DOCUMENT_ADDENDUM.md) | AI provider update: Claude → Groq (D16). Read alongside Technical Document. |
| [Decision Log](DECISION_LOG.md) | 15 documented build decisions with reasoning |
| [Contribution Note](CONTRIBUTION.md) | Team roles, AI tools used, time split |

---

## Hackathon

- **Track:** Track 1 — AI Shopping Agent
- **Event:** Kasparro Agentic Commerce Hackathon, April 2026
- **Submit to:** grandmaster@kasparro.com
