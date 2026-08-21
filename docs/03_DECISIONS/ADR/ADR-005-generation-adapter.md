# ADR-005 — Generation adapter: own the policy, do not fork a router

## Status

Accepted

**Date:** 2026-08-20

## Context

Luna / Terra / Sol ([ADR-003](ADR-003-model-routing.md)) still need a way to *call* models. Transport split is already settled ([ADR-004](ADR-004-llm-transport.md)): CLI on the laptop if useful, HTTP on Vercel.

Tempting next step: fork a public “LLM router” git repo. The ones that look like a product (learned routers, mega-proxies) are often ~two years stale. Forking them makes *their* routing the architecture. Second Pen’s routing is a product rule: most writing is cheap-model work; bump only when the job is actually heavy; users (or we) must be able to point a tier at a different model.

“Heavy load” here means **cognitive load** (long / structural / seed), not traffic. Traffic is a later infra problem.

## Decision

**Own a tiny policy router. Buy or point at a transport. Do not fork a router repo.**

```text
job + destination + brief length + optional pin
        →  Luna | Terra | Sol          (policy, ours)
        →  model id from env/config    (catalog, ours or the user's)
        →  OpenAI-compatible HTTP      (transport)
              ↳ OpenAI / Groq / Anthropic-via-gateway
              ↳ OpenRouter or Vercel AI Gateway (optional hosted catalog)
              ↳ Ollama or `llm` serving local HTTP (inner loop / Luna)
```

### Policy (drafts)

Evaluate in this order. Stop at the first match. Internal / seed / pin rules from ADR-003 still win.

1. Internal job → Luna.
2. Seed or reflection → Sol.
3. User pin on a tier → that tier.
4. Draft is **long and structural** (editorial long form, technical, research, journalism, thought leadership, corporate, or script, and brief ≥ 2400 characters) → Sol.
5. Else draft → **Terra**.

Short editorial, conversational, brand & product, speech, and creative stay Terra even when the note is chatty.

### Catalog

Each tier is a **model string**, not a vendor. Defaults (override with env):

| Tier | Default (v1) | Role |
|---|---|---|
| Luna | `gpt-4o-mini` | Routine / cheap |
| Terra | `gpt-4o-mini` | Almost all drafts |
| Sol | `gpt-4o` | Rare heavy jobs |

Users define models by setting `MODEL_LUNA` / `MODEL_TERRA` / `MODEL_SOL` and optionally `LLM_BASE_URL` + `LLM_API_KEY`. Same contract if they point the base URL at OpenRouter, a LiteLLM proxy, Ollama (`/v1`), or OpenAI.

No in-app model marketplace in this slice. Config, not a tour.

### Transport

- **Hosted:** HTTP only. OpenAI-compatible `chat/completions`.
- **Inner loop:** same HTTP against a local endpoint. A CLI (`llm`, Ollama) is fine *behind* that endpoint. The Next.js app does not `spawn('claude')` on Vercel.
- **Gateway (optional later):** point `LLM_BASE_URL` at OpenRouter or Vercel AI Gateway when we want provider failover without changing policy. Do not take a dependency on their *routing* product for Luna/Terra/Sol.

## Why

The policy is ten lines and will change with the product. A 2024 GitHub router will not. OpenAI-compatible HTTP is the lingua franca: one adapter, many backends. Cheap-by-default matches how this writing actually works.

## Alternatives considered

| Option | Verdict |
|---|---|
| Fork a ~2-year-old router (RouteLLM-class, etc.) | **No.** Rotten catalog, their policy, our maintenance. |
| Self-host LiteLLM as the product | **Later, maybe.** Good if we need virtual keys and spend dashboards. Too much ops for the stub. Can sit *under* `LLM_BASE_URL` without a code change. |
| OpenRouter as the only brain | **No as policy.** Fine as a *catalog/transport*. We still decide Luna/Terra/Sol. |
| Vercel AI Gateway as the only brain | **Same.** Convenient because we already host on Vercel. Optional later. Policy stays ours. |
| Always call one frontier model | **No.** Burns money on captions. |
| Learned / quality router (NotDiamond, etc.) | **Not now.** We do not have labels. Rule-based load is enough. |
| Spawn CLI from the Vercel function | **No.** ADR-004. |

## Consequences

- `web/lib/route-job.ts` is the policy. Change the product there, not in a vendor dashboard.
- `/api/draft` returns `tier`, `model`, `reason` so routing is inspectable.
- Stub remains if no API key is set.
- Context assembly and the critic are still unwired. This only replaces “hardcoded gpt-4o-mini or stub.”
