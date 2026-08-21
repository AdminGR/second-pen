# Context assembly

**Status:** spec for implementation  
**Risk:** this is the mechanism that decides whether generated copy sounds like the user. Do not start generation code without this order.

Source: engine keep-list in [PATH_FORWARD.md](../BRAINSTORMING/PATH_FORWARD.md), destinations in the [Blueprint](../BRAINSTORMING/Second-Pen-BLUEPRINT.md).

AI sits **above** this pipeline. Retrieval and stacking happen first. A model does not invent voice from a “write like me” instruction.

Authentic voice stays dominant. Conceptual mix (not a metric): authentic ~70%, influence ~15%, destination mechanics ~10%, task direction ~5%. If a later step would drown authentic voice, drop that step’s payload, do not average it in.

## Pipeline I/O

**Pipeline in (session)**

| Field | Required | Surface? | Notes |
|---|---|---|---|
| `brief_text` | yes | yes | Typed or STT transcript |
| `destination` | yes | yes | `reel` \| `web_copy` \| `manual` \| `script` |
| `routing_tier` | yes | picker | `luna` \| `terra` \| `sol` after [ADR-003](../03_DECISIONS/ADR/ADR-003-model-routing.md) |
| `auto` | yes | toggle | Structure-extraction mode; does not skip this pipeline |
| `audience` | no | **no** | Inferred or taken from brief; never a home-screen control |
| `objective` | no | **no** | Parsed from brief |
| `guardrails_extra` | no | **no** | Session-only overrides; not a settings page |

**Pipeline out (context package + manifest)**

A single JSON context package passed to the generator, plus a provenance manifest stored with the draft `.md`. Every retrieved passage includes `id`, `source_class`, `memory_kind`.

---

### Step 1 — Authentic voice

**In:** workspace id, person id.  
**Out:** `authentic_profile` (current semantic snapshot: tone, rhythm, vocabulary, avoid-list, evidence ids) and `profile_version`.  
**Retrieve:** `memory_kind = semantic`, `source_class = owned`, type = voice profile. If none exists, run quiet seed analysis first (Sol unless picker says otherwise) or proceed with an empty profile and mark `voice_status: unseeded` (drafts will be generic; that is a product failure for the slice).  
**Must not:** pull influence traits into this object.

### Step 2 — Communication objective

**In:** `brief_text`.  
**Out:** `objective` enum or short string (e.g. announce, follow up, explain, correct, sell-without-selling).  
**How:** parse from the brief. No extra UI.  
**Must not:** become a dropdown on the home screen.

### Step 3 — Intended audience

**In:** `brief_text`, optional `audience` if already on the session.  
**Out:** `audience` (e.g. existing customers, suppliers, self, public).  
**How:** parse or reuse. **Not a home-screen setting.** If it appears as one, that is a flag, not a feature.

### Step 4 — Destination / format mechanics

**In:** `destination`.  
**Out:** `mechanics` — sentence-length band, pause/line-break rules, spoken-vs-read flag, typical duration or word count, heading policy.  
**Retrieve:** semantic destination-mechanics `.md` for that destination.  
**Must:** change pacing, not only “tone.” A Reel and a manual step in the same voice are not paced the same way.

### Step 5 — Relevant authentic examples

**In:** `brief_text`, `destination`, `objective`, `audience`, embedding of the brief.  
**Out:** up to 5 episodic passages, `source_class` in `owned` \| `authorized`, not deleted, preferably same destination or nearby, ranked by hybrid index (see DATA_MODEL).  
**Must not:** include `generated` unless it was later accepted (accepted copy is `owned`).  
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
