# ADR-001 — Hosting and data plane for the first hosted prototype

## Status

Accepted

**Date:** 2026-08-20  
**Second read:** punch-list review in the same session. Decision stands. Amendments below name the index method and keep STT/TTS/generation providers out of this ADR.

## Context

Second Pen must be built in Cursor, previewable at a URL, then hosted. Canonical persistence is Markdown. Operational indexes are disposable. The kickoff suggested Next.js + PostgreSQL + pgvector. Candidates named: Cursor environment, Vercel, Postgres, Neon, Supabase, Cloudflare.

Cursor Cloud Agents and Cloud dev environments are for **building and reviewing code**, not for a public product URL. A Cloud Agent session URL is an agent run, not the writing app. Local `next dev` (and Cursor's simple browser) is the inner loop. A shareable product preview needs a web host.

The durable-layer law: if the app disappeared, the writing would still be readable as text. That argues against storing prose only as Postgres rows.

Latency is a product requirement (Blueprint). Neon scale-to-zero can add hundreds of milliseconds on cold compute; a hosted demo must not sleep the database.

## Decision

**Build in Cursor. Preview and host the app on Vercel. Canonical copy is Markdown objects (local folder in the inner loop; R2 or any S3-compatible blob store when hosted). Operational indexes live in Neon Postgres. Indexing is hybrid: Postgres full-text search plus pgvector embeddings.** See [DATA_MODEL.md](../../02_ARCHITECTURE/DATA_MODEL.md).

Do not use Supabase or Cloudflare D1 as the system of record for writing. Do not use a Cursor Cloud Agent URL as the product preview.

Phased:

1. **Inner loop:** Next.js in this repo, Cursor IDE, local preview. One-user. Markdown on local disk under a workspace folder (still exportable text). Local Postgres or SQLite-for-indexes is allowed only as a stand-in; the hosted shape is Neon + FTS + pgvector.
2. **Shareable prototype:** Vercel preview deployments (per-branch URLs). Neon with a **pinned minimum compute** (no scale-to-zero on the demo). R2 or Vercel Blob for `.md`. Auth when the URL is not just local.
3. **Later:** Cloudflare where it is best (R2; optionally CDN). Workers/D1 are not the app. Supabase Auth is a fallback identity option, not a reason to move prose into Supabase rows.

STT, TTS, and generation models are **not** chosen in this ADR. They are open points in [STACK_DECISIONS.md](../STACK_DECISIONS.md), behind adapters.

## Why

- **Vercel + Next.js** is a single-app first slice (UI + Route Handlers) with preview URLs, without copying Oracle.
- **Neon** is Postgres with pgvector and preview branching. It is a database, not a product UI kit — which fits “indexes are disposable.” SQL remains portable if the vendor changes.
- **Markdown objects** keep export and disaster readability real.
- **Hybrid index** is required by retrieval: keyword/metadata filters (source_class, destination, date) plus semantic similarity on authentic passages. Neither alone is enough for “find how this person writes.”
- **Not Supabase as the data plane:** pulls the prototype toward a BaaS-shaped app. Auth can still be added later.
- **Not D1:** no pgvector; not a folder of Markdown.
- **Not Cursor-hosted product:** Cursor is the factory. Vercel is the storefront URL.

## Alternatives Considered

| Option | Use | Reject as primary because |
|---|---|---|
| Cursor Cloud Agent URL | Build agents | Not a product preview |
| Vercel + Supabase (db+auth+storage) | Faster auth/storage bundle | Prose and graph become platform-shaped |
| Vercel + Neon + Vercel Blob only | Fewer vendors | Fine; R2 vs Blob is interchangeable if S3 API and export work |
| Cloudflare Pages + Workers + D1 | Edge-native | D1 is the wrong store |
| Oracle AI Database | Kickoff reference | Research only |
| Git repo as the only store | Beautiful durability | Weak live retrieval; keep as export target |
| Embeddings-only index | Simpler | Cannot filter source_class / destination reliably |
| FTS-only index | Simpler | Will not retrieve “same cadence, different words” |

## Consequences

- Scaffolding, when explicitly allowed, is Next.js. Preview URLs come from Vercel.
- A rebuild-from-Markdown job is required (index is not source of truth).
- Hosted Neon must stay warm on the demo.
- Vendor count: Vercel + Neon + blob store (+ model/STT/TTS providers). Do not add Supabase on top “just in case.”
- This ADR does not authorize `src/` by itself. Implementation still needs an explicit start.
