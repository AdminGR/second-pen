# ADR-004 — LLM transport: CLI inner loop, HTTP hosted

## Status

Accepted

**Date:** 2026-08-20  
**Agreed:** stack discussion in session; CLI as transport, not as the product.

## Context

Luna / Terra / Sol need a way to call models. Options are HTTP APIs, LLM CLIs, or Cursor Agent CLI. The inner loop is Cursor on a laptop. The hosted prototype is Vercel.

## Decision

One generation adapter, two transports, same contract (`prose`, `events[]`, `manifest`).

- **Inner loop (Cursor / laptop):** may use an LLM CLI (Ollama, `llm`, or similar), especially for **Luna**.
- **Hosted (Vercel preview/prod):** HTTP only. Do not `spawn` a CLI.
- **Cursor Agent / Cloud Agent:** how we build Second Pen, not the writing engine.

Vendors behind each tier remain open ([STACK_DECISIONS.md](../STACK_DECISIONS.md)).

## Why

CLIs are right where binaries and local models exist. They are wrong on a serverless host. Mixing factory (Cursor Agent) with storefront (dictation → draft) would blow latency and auth boundaries.

## Alternatives Considered

- CLI everywhere: fails on Vercel.
- HTTP everywhere, including local Luna: works, but skips cheap local routine jobs.
- Cursor Agent as generator: wrong product boundary.

## Consequences

- Adapter interface is written once; transports are swappable.
- Local prototype can run without frontier keys for Luna jobs.
- Hosted path needs API keys as secrets, not a logged-in CLI.
