# ADR-006 — Content driver is a client of the voice engine

## Status

Proposed

**Date:** 2026-09-29

## Context

Second Pen drafts in a person's voice, shaped for a writing kind. Scope stays narrow on purpose ([PATH_FORWARD](../../BRAINSTORMING/PATH_FORWARD.md), [PROTOTYPE_GUARDRAILS](../PROTOTYPE_GUARDRAILS.md)).

A second use case needs founder-voice scripts on a schedule: a daily Instagram Reel, LinkedIn two or three times a week, and YouTube weekly, planned a week ahead, with event run-ups, dictated plans and recaps, and a handoff to an edit tool. That use case is a content driver. It needs a calendar, slates, cadence, and scheduled runs. Those are the browsable lists and planning surfaces the guardrails keep out of this product.

Both use cases need the same core: a brief, a writing kind, and a voice lane produce a draft.

## Decision

Split into three layers with one contract between the driver and the engine.

| Layer | Owns | Lives in |
|---|---|---|
| **1. Voice engine** | Context assembly, generation, critic, provenance | Second Pen. The eight-step assembly in [CONTEXT_ASSEMBLY](../../02_ARCHITECTURE/CONTEXT_ASSEMBLY.md) is not wired in this decision. |
| **2. Voice data** | A person's voice profile, samples, dictations, accepted copy | The person's own store (`.md`, per [ADR-002](ADR-002-markdown-canonical.md)) |
| **3. Content driver** | Calendar, event run-ups, weekly slates, cadence, scheduled runs, edit-tool handoff | A separate repo, outside Second Pen |

**Contract (layer 3 → layer 1):** `brief_text`, `writing`, `voice` → `prose` + manifest.

`writing` is a writing kind. `voice` is a voice harness id the engine already knows. The HTTP body key for `brief_text` is `brief`. The request does not carry `routing_tier`; tier selection stays engine policy ([ADR-003](ADR-003-model-routing.md), [ADR-005](ADR-005-generation-adapter.md)). The manifest records `writing`, `voice`, `tier`, `model`, `reason`, `stub`, `source_class: generated`, and `memory_kind: episodic`.

Mechanics stay on the writing kind. They are not fields of the voice file. A path to a private note is not a voice reference until a seed store exists.

The driver does not reach into Second Pen internals. Second Pen does not learn calendars, slates, cadence, or scheduled runs.

**What Second Pen gains:** a dogfood client. `linkedin_post` (read, not heard) is a backlog writing kind plus a mechanics row. It is not added in this decision.

## Why

- A calendar inside the app is the dashboard the product refuses.
- The driver can call the current draft route before context assembly exists.
- Voice data owned by the person stays readable if either tool disappears (ADR-002).

## Alternatives Considered

- **Build the driver inside Second Pen.** That adds browsable lists and a planning surface, and it bends a multi-person product around one person's calendar.
- **Give the driver its own voice logic.** Two engines drift, and Second Pen loses the dogfood client.
- **Store voice only in the driver's private formats.** The seeding path into ADR-002 Markdown breaks.

## Consequences

- Second Pen does not gain calendar, slate, or scheduling concepts.
- `linkedin_post` waits on the backlog until writing kinds are next touched.
- The driver repo keeps its own ADRs and talks only through this contract.
- Dogfood misses are logged in [EXPERIMENTS](../../05_RESEARCH/EXPERIMENTS.md), not as feature requests.
- Influence sources stay `source_class: influence`, technique only, and never merge into authentic voice.
- Open: whether hand-built voice files become the quiet seed, or only check what Sol extracts from raw seed writing.
