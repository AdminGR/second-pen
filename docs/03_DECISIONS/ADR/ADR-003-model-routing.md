# ADR-003 — Auto plus Luna / Terra / Sol routing

## Status

Accepted

**Date:** 2026-08-20

## Context

Tether hid Luna / Terra / Sol and made Auto the only feeling. Second Pen needs cost and latency control, and the product asked to expose a picker from day one as routing, not as a tour. Auto is a toggle for dumps and large projects: keep structure.

“Keep it as routing, not a tour” only holds if the rule is written down. The rule below is **engine logic**. The UI may show Auto + a compact picker. Internal jobs never show a picker.

## Decision

### Tiers (names stable; models behind adapters)

| Tier | Job | Typical use |
|---|---|---|
| Luna | Cheap / routine | Embeddings, FTS-adjacent tasks, overlap score, schema-only critic, TTS from existing text, tag/summary regen |
| Terra | Default work | Destination-aware draft generation, critic when a rewrite might be needed |
| Sol | Hard reasoning | First voice-profile extraction from seed; influence-technique extraction (later); reflective profile-diff proposals |

### Auto (toggle, not a fourth model)

When **on**: the turn may emit structured events (`create markdown`, `link`, `add relationship`) and split dumps into `.md` files. Draft generation still uses the selected tier (default Terra). **Auto does not** mean unbounded rewrite. The critic bound still applies to drafts.

When **off**: one brief → one draft path. No dump-splitting.

### Selection logic (engine)

Evaluate in this order. Stop at the first match.

1. **Internal job** (index, embed, overlap, TTS of existing draft, schema-only critic): **Luna**. Ignore the picker. Do not surface a tour.
2. **User pinned** Luna, Terra, or Sol on the working surface: use that tier for **draft generation and rewrite**.
3. **Seed analysis or reflection diff** and picker is still default/unpinned: **Sol**.
4. **Else draft generation: Terra.**

Auto on or off does not change 1–4 except that Auto on additionally allows structure events on the same turn.

Mobile: compact Auto + picker. If one-handed use fights the picker, collapse to Auto + Terra default and keep this table — do not hide cost behind mystery latency.

## Why

Visible routing keeps models from becoming the product. Forced Luna on internal jobs keeps the demo fast and cheap. Sol is reserved for the few jobs that invent structure (profiles, diffs), not for every caption.

## Alternatives Considered

- Auto only, no picker: hides why a run is slow or expensive.
- Always Sol: quality theater; blows latency budget.
- Hidden internal router with no user control: fine for step 1; not for draft generation given the product request.

## Consequences

- Provider adapters map to Luna / Terra / Sol; swap models without renaming tiers. Transport may be HTTP or a local CLI; hosted Vercel uses HTTP only.
- Prompts and event schemas must run on all three.
- Telemetry should record `tier`, `auto`, `job_kind` (internal | draft | seed | reflect).
