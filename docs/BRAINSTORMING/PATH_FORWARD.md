# Path forward

**Status:** working split of roles, not an implementation plan  
**Date:** 2026-08-20  
**Sources:** [Second-Pen-BLUEPRINT.md](Second-Pen-BLUEPRINT.md), [Second-Pen-product-definition.md](Second-Pen-product-definition.md), [Second-Pen-KICKOFF_BASELINE.md](Second-Pen-KICKOFF_BASELINE.md)

The two kickoff files and the Blueprint describe the same product at different layers. They conflict when either layer pretends to be the other. This document says what each layer is for, what to keep from the kickoff, what to hide, and the order of work.

## The split

| Layer | Document | Job | Allowed to show in the product |
|---|---|---|---|
| Surface | Blueprint | What the person does in one session, and how it should feel | Yes. This is the product. |
| Session objects | Architecture + data model | Session, Draft, Destination, Push as software identities | Indirectly. The person sees a draft panel and a push button, not a schema. |
| Engine | Product definition + Kickoff baseline | How voice is learned, retrieved, constrained, and improved | No, except as quiet secondary affordances later. |

Rejected alternatives:

1. **Kickoff as MVP.** Would ship library, profiles, compose, evaluations. That is the dashboard the Blueprint refuses.
2. **Blueprint with no memory.** Would ship a destination-aware generator that starts from zero every session. That abandons the problem statement.

The path is layered: Blueprint governs the first surface. Kickoff is mined for engine constraints. Nothing from the kickoff becomes a first-class screen until the one-job loop is real.

## What / when / where / how

### Surface — Blueprint

**What.** One action: spoken or typed brief → voice model → destination-shaped draft → review by eye or ear → push out of the tool. Medium is a parameter, not a mode.

**When.** Every session. This is the daily loop. It is also the first thing to prove.

**Where.** The **primary surface is the phone.** One-handed dictation should start and finish the job (brief → destination → listen → push). Mobile layout is not designed yet; that does not make desktop the lead. Desktop mockups exist (`docs/UI:UX/OptionC@2x.png`) as the same product on a larger screen, not as a separate or more complete app.

**How.** Few durable UI states. Hybrid input stream plus pinned draft. Monochrome, matte, no glass. Type and dictate as equals. Listen and read as equals. Latency is a product requirement. History, library, and settings only as quiet corners.

### Session objects — not a screen, a model

**What.** Four identities the surface needs even before architecture is filled in:

- **Session** — the brief, notes, destination, and conversation that produced this draft.
- **Draft** — a document with identity, edits, and versions. Not a chat turn.
- **Destination** — Reel, web copy, manual, script. Changes pacing, sentence length, pause placement, not only tone.
- **Push** — the session-ending commit. The copy leaves. This is also the learning event.

**When.** Modeled now. Implemented when the first vertical slice is built. Not postponed until integrations exist: Push can write to a stub destination and still count as a commit.

**Where.** Desktop: destination tabs, draft panel, Listen, Edit, Push to draft. Mobile: one-handed equivalent, not a shrunk icon rail.

**How.** Draft has save / edit / version history. Session notes drive generation; they do not own the draft. Push stores generated version, edited version, and accepted version even if the outbound integration is later.

### Engine — extracted from the two kickoff files

**What.** A memory-driven author that does not rely on “write like me.” Authentic writing defines identity. Optional influence defines technique. Factual context is a third lane. Conservative reflection. Inspectable drafts.

**When.** Under the surface from the first generating slice, but seeded quietly. Influence, profile editors, and evaluation labs are not a precondition of the first session loop.

**Where.** Behind generation. Not in `dashboard/`, `library/`, `profiles/`, or `evaluations/` as product routes. Those repository folders in the kickoff are a map of an engine, not a map of the app.

**How.** Keep the mechanisms below. Do not keep the kickoff’s UI tree, its “mobile deferred” sequencing, or its phase gate that blocks implementation until influence ingestion and an evaluation harness are fully specified.

## Keep from the kickoff (engine constraints)

These survive as rules, even though the person never sees a “memory” screen.

1. **Authentic voice vs influence never share a profile.** Influence is technique, not identity. Phrase-copying from influence sources is a defect.
2. **Context assembly order.** Authentic voice → objective → audience → destination/format → authentic examples → optional influence → guardrails → facts. Authentic voice stays dominant. Kickoff’s 70/15/10/5 split is conceptual, not a metric.
3. **Three memory kinds, not three product tabs.** Episodic (examples and corrections), semantic (structured voice and destination habits), reflective (versioned profile changes with rollback).
4. **The proprietary learning signal.** Generated draft → user edit → accepted version. Bind this to **Push**. If Push only exports, the product cannot improve.
5. **Bounded generation.** Draft → one critic pass → one controlled rewrite → human review. No multi-agent rewrite loops.
6. **Draft provenance.** A generated draft should be able to explain voice version, destination, retrieved authentic example IDs, influence (if any), guardrails, model, and which user edits became learning signals. Inspectability can be a quiet affordance, not a dashboard.
7. **Source class on every passage.** owned / authorized / influence / reference / generated. Generated drafts do not become authentic examples automatically.
8. **Provider wrapper.** Generation, embeddings, and TTS/STT sit behind adapters. Do not bind the product to Oracle, one embedding dimension, or one model.
9. **Destination as mechanics.** Extend kickoff “format” (email, social, article) with Blueprint destinations (Reel, web copy, manual, script) and spoken-pacing rules. A Reel script and a manual step are not paced the same way in the same voice.
10. **STT in, TTS out.** Missing from the kickoff. Required by the Blueprint. They are part of the loop, not accessories.

## Hide until later (engine, not v1 chrome)

Do these jobs without first-class screens in the MVP.

| Kickoff idea | Quiet form |
|---|---|
| Authentic corpus import | One-time or rare seed. Paste / upload. Not a library browser. |
| Voice profile | Generated and used. Optional later inspect/correct. Not a profile workshop to start. |
| Influence profiles | Deferred past the first proving loop. Architecture must not merge them in, so they can be added without a rewrite. |
| Reflection and rollback | Runs on Push commits. User-facing rollback can wait. |
| Evaluation harness | Internal, if at all, in `prototypes/`. Not a product surface. |
| History | Secondary affordance. Must not become a content CMS. |

## Drop or invert from the kickoff (for the first surface)

- **App routes:** dashboard, library, profiles, compose, evaluations.
- **Prototype objective as a user flow.** “Import → build profile → add influences → retrieve → draft → …” is an engine pipeline. The user flow is the Blueprint loop.
- **Email and social-post as the first formats.** First destinations are Reel, web copy, manual, script.
- **Mobile deferred.** Invert. **Phone dictation is the primary surface.** Desktop shares the model and does not lead. Kickoff’s “defer the mobile application” line is rejected.
- **Phase 0–7 as the build order.** That order builds corpus UI before the session. Reverse it: session loop first, seed voice underneath, influence later.
- **Oracle stack as default.** Keep Oracle as a researched reference ([REFERENCES.md](../05_RESEARCH/REFERENCES.md)). Do not copy VECTOR(1024) or OCI coupling. Hosting is [ADR-001](../03_DECISIONS/ADR/ADR-001-hosting-and-data-plane.md) (Proposed).
- **Kickoff phase gate.** Do not wait for a full influence-ingestion model and evaluation strategy before proving the session. Do wait until authentic vs influence vs facts cannot be accidentally merged.

## The hole that still has to be named

The Blueprint says the tool “learns how you write.” The core loop never shows a library. Until the seed path is chosen, engineering will either rebuild the kickoff dashboard or ship a generator with no memory.

Three options, in preference order:

1. **Quiet seed, then sessions.** A one-time paste/upload of the person’s own writing, then the daily loop. Profile is used, not edited, unless it is obviously wrong.
2. **Learn from Pushes only.** No import. Voice emerges from accepted drafts. Slow to become “the same author,” and early sessions will sound generic.
3. **Both.** Seed for day one, Push-deltas for improvement. This is the kickoff’s actual learning story, without its UI.

Option 3 is the path unless a later decision kills the seed step. Option 2 is a fallback, not the design.

## Order of work

Do not introduce `src/`, tests, infra, or a component tree until the numbered docs below have been filled from this split. `AGENTS.md` still holds.

1. **This folder stays the engine and brief set.** Blueprint, product definition, kickoff, and this path. Do not copy the kickoff into `docs/02_ARCHITECTURE/ARCHITECTURE.md`.
2. **Promote surface into product docs.** Done 2026-08-20. `docs/00_VISION/` and `docs/01_PRODUCT/` are filled from the Blueprint. `docs/06_ROADMAP/MVP.md` holds the product boundary.
3. **Promote engine into architecture docs.** Done 2026-08-20. `docs/02_ARCHITECTURE/` holds the six-layer map, `.md` data model, boundaries, APIs, and integrations. Influence is a reserved lane with no v1 UI.
4. **Record the stack as an ADR when chosen.** [ADR-001](../03_DECISIONS/ADR/ADR-001-hosting-and-data-plane.md) **Accepted** 2026-08-20: Cursor to build, Vercel to preview/host, Neon hybrid FTS+pgvector indexes, Markdown objects for copy. Open vendor rows: [STACK_DECISIONS.md](../03_DECISIONS/STACK_DECISIONS.md).
5. **Design the mobile surface** as the dictation → destination → listen → push loop. Desktop follows; it does not lead.
6. **Clickable stub.** `web/` — two-panel session, browser STT/TTS, stub generate, Push downloads `.md`. Not eight-step assembly. See [CLICKABLE_SLICE.md](../06_ROADMAP/CLICKABLE_SLICE.md).

## What the numbered tree is for

`docs/00_VISION/`, `docs/01_PRODUCT/`, `docs/02_ARCHITECTURE/`, proposed ADRs, privacy, and research references are promoted. Brainstorming files remain the engine-noodling archive.

| Promote into | From |
|---|---|
| `00_VISION` | Blueprint problem + product definition (one persistent author) |
| `01_PRODUCT` | Blueprint loop, desktop concepts, mobile-governs, destination list |
| `02_ARCHITECTURE` | This document’s engine keep-list, not the kickoff repo tree |
| `03_DECISIONS/ADR` | Stack, draft-as-document, push-as-learn, authentic vs influence |
| `04_RISK_SECURITY` | Source class, consent, deletion propagation, no mixing generated into authentic |
| `05_RESEARCH` | Oracle article and repo as reference, not fork |
| `06_ROADMAP` | Order of work above as MVP: session loop first |

## Current phase gate (replaces the kickoff’s)

The numbered docs now contain:

- The product is one session action with destination as a parameter.
- Draft is a document identity, not a chat turn.
- Push is the commit and the learning signal.
- Authentic, influence, and facts cannot be stored as one soup.
- STT and TTS are in the loop.
- Voice is seeded quietly; the library is not the product.
- `.md` is canonical; indexes rebuild.

Implementation starts only after scaffolding is **explicitly allowed**. ADR-001 is accepted; it does not by itself authorize `src/`.

## Cross-reference (2026-08-20)

Checked against Blueprint, this path, product-definition, kickoff, and the promoted architecture.

**Aligned (keep).** Dual-source never merged; Push as learning signal; bounded critic; source class; STT/TTS; destination as mechanics; draft as document; no dashboard/library/profiles; mobile inverted to governing; Oracle as research not runtime; SoR later; Markdown canonical.

**Patched in this pass.** Context assembly I/O spec and memory-kind criteria are written. Quiet seed is core-but-quiet. Session objects are numbered. Kickoff baseline now has a corrections table (it was the second stale file). Path forward states phone dictation as the primary surface, not only “governing.”

**Still in tension (do not pretend they match).**

| Item | Blueprint / this path | Engine files | Promoted architecture |
|---|---|---|---|
| First-proof loop | Session: brief → draft → listen → push | Import → profile → influences → retrieve → … | Session loop. Product-definition and kickoff now carry override text. |
| Mobile | Phone dictation is the primary surface | Deferred in original engine files | Path forward, Mobile doc, kickoff corrections table, and README now say primary = phone. |
| Implementation gate | Session + no soup | Influence ingestion + evaluation harness required | Path-forward gate. Product-definition gate is stale. |
| Day-one chrome | Few states, obvious in one second | (silent) | Adds Auto + Luna/Terra/Sol picker. Extra controls vs Blueprint restraint. |
| Galaxy / graph | Not the product | Kickoff had library/profiles | Layer 1 names Galaxy as visualization, not home. Watch accretion. |
| Formats | Reel, web, manual, script | Email + social in prototype scope | Blueprint destinations. |
| Audience + guardrails | Not surface controls | Assembly steps 3 and 7 | Now in architecture as session fields, not home-screen jobs. |
| Evaluation set | Not a product | Prototype must-have | Hidden / `prototypes/` only. |

**Broken pointer.** Product-definition still links `docs/02_ARCHITECTURE/PROTOTYPE_ARCHITECTURE.md` (never created). Canonical architecture is `docs/02_ARCHITECTURE/ARCHITECTURE.md`.
