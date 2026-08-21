# Context assembly

**Status:** spec for implementation  
**Risk:** this is the mechanism that decides whether generated copy sounds like the user. Do not start generation code without this order.

Source: engine keep-list in [PATH_FORWARD.md](../BRAINSTORMING/PATH_FORWARD.md), destinations in the [Blueprint](../BRAINSTORMING/Second-Pen-BLUEPRINT.md).

AI sits **above** this pipeline. Retrieval and stacking happen first. A model does not invent voice from a “write like me” instruction.

Authentic ~70% applies **only** to author-dependent sessions. Brand-dependent retrieves the brand corpus, not the author's personal voice. System-dependent retrieves register/guardrails for that institution (legal, academic, technical, corporate reporting). Influence stays a later, separate lane and never merges into authentic.

## Pipeline I/O

**Pipeline in (session)**

| Field | Required | Surface? | Notes |
|---|---|---|---|
| `brief_text` | yes | yes | Typed or STT transcript |
| `writing` | yes | yes | Genre pills. CTA, not a tab bar. |
| `voice` | yes | yes | `author_*` \| `brand_client` \| `system_*`. Session CTA each write, not onboarding. Selects which corpus/register to retrieve. Named brands after seed — not a library. |
| `routing_tier` | yes | picker | `luna` \| `terra` \| `sol` after [ADR-003](../03_DECISIONS/ADR/ADR-003-model-routing.md) |
| `auto` | yes | toggle | Structure-extraction mode; does not skip this pipeline |
| `audience` | no | **no** | Inferred or taken from brief; never a home-screen control |
| `objective` | no | **no** | Parsed from brief |
| `guardrails_extra` | no | **no** | Session-only overrides; not a settings page |

**Pipeline out (context package + manifest)**

A single JSON context package passed to the generator, plus a provenance manifest stored with the draft `.md`. Every retrieved passage includes `id`, `source_class`, `memory_kind`.

---

### Step 1 — Voice lane (author / brand / system)

**In:** `voice` (session CTA).  
**Out:** which profile and example set to load.

- **Author-dependent:** `authentic_profile` from `source_class = owned`, harnessed to the chosen body of work (journalism, YouTube, general writing). Mix: authentic dominant.
- **Brand-dependent:** `brand_profile` from `source_class = brand`. **Must not** use the author's personal voice. Named brand ids attach after seed; the picker is not a brand CMS.
- **System-dependent:** register profile + guardrails for technical / legal / academic / corporate reporting. **Must not** flatten into personal or consumer-brand voice.

If the chosen corpus is empty, mark `voice_status: unseeded` for that lane and still generate under the lane's constraints (generic until seed). That is a product failure for author-dependent day one; less fatal for system register.

**Must not:** pull influence traits into this object. Influence is still step 6 and off in this slice.

### Step 2 — Communication objective

**In:** `brief_text`.  
**Out:** `objective` enum or short string (e.g. announce, follow up, explain, correct, sell-without-selling).  
**How:** parse from the brief. No extra UI.  
**Must not:** become a dropdown on the home screen.

### Step 3 — Intended audience

**In:** `brief_text`, optional `audience` if already on the session.  
**Out:** `audience` (e.g. existing customers, suppliers, self, public).  
**How:** parse or reuse. **Not a home-screen setting.** If it appears as one, that is a flag, not a feature.

### Step 4 — Writing-mode mechanics

**In:** `writing`.  
**Out:** `mechanics` — what this draft is allowed to be (length, spoken-vs-read, evidence rules, heading policy).  
**Retrieve:** semantic mechanics `.md` for that writing kind (`web/lib/writing-mode.ts` is the stub catalog).  
**Must:** change allowed moves, not only “tone.” Editorial long form and conversational writing in the same voice are not the same job.

### Step 5 — Relevant examples for the active lane

**In:** `brief_text`, `writing`, `voice`, `objective`, `audience`, embedding of the brief.  
**Out:** up to 5 episodic passages from the **active lane** (owned for author, brand for brand, reference/register for system).  
**Must not:** include `generated` unless it was later accepted (accepted copy is `owned`). Author-dependent must not pull `brand`. Brand-dependent must not pull personal `owned` as if it were the brand.  
**Must:** attach passage ids to the manifest.

### Step 6 — Optional influence profile

**In:** influence profile id if the session has one (v1: none).  
**Out:** `influence` structured techniques only, or omit.  
**Retrieve:** `source_class = influence`, `memory_kind = semantic`. Raw influence passages stay out of the generation prompt in v1; techniques only.  
**Must not:** merge into `authentic_profile`. Phrase overlap with influence sources is a defect (overlap check after generate).

### Step 7 — Explicit writing guardrails

**In:** semantic guardrails (prohibited phrases, required constraints) plus any session extras.  
**Out:** `guardrails` list.  
**How:** loaded from semantic store, not from a home-screen settings wall. Extra constraints may be parsed from the brief (“keep it warm, not salesy”).  
**Must not:** ship as a browsable rules CMS.

### Step 8 — Factual / subject-matter context

**In:** facts the brief already contains; later, knowledge lane.  
**Out:** `facts[]` with source ids, `source_class` in `owned` \| `reference` \| `authorized`. Never `influence` as fact.  
**v1:** only what is in the brief and session notes. No web crawl.

---

## After the eight steps

1. **Generate** (picker tier) → draft `.md` (`source_class: generated`, `memory_kind: episodic`).
2. **Critic once** → structured scores + optional one rewrite (same bound if Auto is on).
3. **Overlap check** if step 6 fired.
4. **Human** reads / listens / edits.
5. **Push** writes accepted `.md` (`owned`, episodic) and a reflective candidate (derived; does not overwrite seed).

## Failure

If step 1 is `unseeded` and step 5 returns nothing, do not pretend the draft is in-voice. Surface a quiet seed affordance, not a library.
