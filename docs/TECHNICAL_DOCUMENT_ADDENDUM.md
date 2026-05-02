# Technical Document — Addendum

**Date:** April 30, 2026  
**Ref:** ShopMind_Technical_Document.pdf

## AI Provider Update

The Technical Document (PDF) was drafted with **Claude via Anthropic API** as the AI layer reference. During the build, the team switched to **Groq API (llama-3.3-70b-versatile, free tier)** for the production implementation.

This decision is documented as **D16** in `DECISION_LOG.md` with full reasoning.

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
- Every product/architecture decision in the Technical Document

### Verification
Run `grep -r "groq\|Groq\|GROQ" src/` to confirm the production implementation uses Groq throughout.

The Technical Document PDF is submitted as-is (with Claude references) alongside this addendum. All judges should treat this addendum as the authoritative statement on AI provider.
