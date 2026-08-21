# Stack decisions (open)

**Status:** decision log, not commitments  
**Date:** 2026-08-20  
**Settled elsewhere:** [ADR-001](ADR/ADR-001-hosting-and-data-plane.md), [ADR-002](ADR/ADR-002-markdown-canonical.md), [ADR-003](ADR/ADR-003-model-routing.md), [ADR-004](ADR/ADR-004-llm-transport.md) (CLI inner loop, HTTP hosted).

Wire adapters now. Choose vendors when the first slice is implemented. Do not let a vendor become the architecture.

| Point | Options in play | Constraint | Status |
|---|---|---|---|
| STT (dictation) | Browser Web Speech, Deepgram, Whisper-class API, Apple/Google on-device later | First-class with typing; latency is a product requirement; transcript is canonical text (`.md`), audio is disposable | **Open** |
| TTS (Listen) | Provider TTS (OpenAI, ElevenLabs, Google, Amazon), OS speech | First-class with read; play from text, do not store audio as source of truth | **Open** |
| Generation (draft + critic) | HTTP and/or LLM CLI behind one adapter | Bounded critic; [context assembly](../02_ARCHITECTURE/CONTEXT_ASSEMBLY.md) | **Policy + HTTP adapter settled** ([ADR-005](ADR/ADR-005-generation-adapter.md)); **exact model ids open** (env catalog) |
| Canonical `.md` | Local folder (inner loop); R2; Vercel Blob; any S3 API | Exportable folder of text if the app vanishes | **Settled shape** (ADR-001); vendor **open** between R2 and Blob |
| Indexes | Neon FTS + pgvector (hosted); local stand-in in inner loop | Disposable; rebuild from `.md`; hybrid keyword + embeddings | **Settled** (ADR-001) |
| Auth | None (one local user); Auth.js; Clerk; Supabase Auth only as identity | One user in the slice; no team | **Open** |
| Destination adapters | Shared adapter + per-destination config | Push *targets* later. Writing *mode* is genre pills, not four apps. | **Lean shared + config**; not implemented |
| Influence / SoR connectors | None in slice | Week three; references not file ownership | **Out of slice** |

When a row is chosen, cut an ADR. Do not bury the choice in chat.

## LLM transport (CLI vs HTTP)

The product never “is” a CLI. Luna / Terra / Sol are tiers. Behind each tier is an adapter with a transport:

| Transport | Where it fits | Where it does not |
|---|---|---|
| **CLI** (`llm`, `ollama`, `claude`, OpenAI-compatible CLIs) | Cursor inner loop, laptop prototype, local Luna (e.g. Ollama) | Vercel preview/prod: no durable binaries, no interactive login, function timeouts |
| **HTTP SDK / API** | Hosted prototype and production; also fine locally | None as a constraint; this is the portable path |

**Lean:** one generation adapter, two transports, same request/response shape (`prose`, `events[]`, `manifest`). Inner loop may call a CLI. Hosted path must call HTTP. Do not make the Vercel app `spawn('claude')`.

**Not this:** Cursor Agent CLI / Cloud Agent as the writing engine. That is how we *build* Second Pen. It is the wrong latency, auth, and product boundary for dictation → draft → listen.

**Luna via CLI** (local Ollama or a cheap `llm` default) is the interesting CLI case: routine jobs stay off frontier HTTP. Terra/Sol on the hosted app stay HTTP until there is a real reason not to.

Still open: which hosted catalog (direct OpenAI vs OpenRouter vs Vercel AI Gateway) and which local Luna binary (`llm` vs Ollama). Policy and adapter are [ADR-005](ADR/ADR-005-generation-adapter.md). When a catalog is chosen as the *default* hosted endpoint, cut a short ADR; pointing `LLM_BASE_URL` does not need one.
