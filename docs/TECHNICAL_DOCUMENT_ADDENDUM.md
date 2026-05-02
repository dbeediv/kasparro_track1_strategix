# Technical Document — Addendum

**Date:** April 30, 2026  
**Ref:** ShopMind_Technical_Document.pdf + ShopMind_Product_Document.pdf

## AI Provider Update

Both the Technical Document PDF and the Product Document PDF were drafted with **Claude via Anthropic API** as the AI layer reference. During the build, the team switched to **Groq API (llama-3.3-70b-versatile, free tier)** for the production implementation.

This decision is documented as **D16** in `DECISION_LOG.md` with full reasoning. `DECISION_LOG.md` is the authoritative statement on AI provider — both PDFs predate that decision and should be read alongside D16.

Specific inconsistencies in the PDFs:
- **Technical Document PDF:** Section T2 "AI layer (Claude)", all Claude/Anthropic references → actual implementation uses Groq
- **Product Document PDF:** Section 3.4 "Claude via Anthropic API", Section 11.1 "Claude (Anthropic) used for: conversational agent core" → actual implementation uses Groq

### What changed
- AI provider: Anthropic Claude → Groq (llama-3.3-70b-versatile)
- SDK: `@anthropic-ai/sdk` → `groq-sdk`
- Message format: Anthropic messages API → OpenAI-compatible chat completions

### What did NOT change
- All 11 logics (L1–L11) — identical behaviour
- The AI/deterministic boundary — unchanged, same enforcement
- The system prompt architecture — same 4-section structure
- JSON output schema — identical fields
- Retry logic, fallback handling — same implementation
- Every product/architecture decision in both documents

### Verification
Run `grep -r "groq\|Groq\|GROQ" src/` to confirm the production implementation uses Groq throughout. Zero Anthropic/Claude references exist in `src/`.
