# Data Model

**Status:** first architecture iteration  
**Law for storage, not for first-login UI:**

```text
ENTITY + RESOURCE + RELATIONSHIP + optional ingestion
```

## Core Entities

Entities are people and containers. They are not screens.

| Entity | Meaning |
|---|---|
| Person | The author. One in the first slice. |
| Workspace | Personal boundary. Later: team. |
| Day | Calendar membership. Chronology. |
| Project | A body of work a .md can belong to. |
| Writing mode | Genre of this draft (editorial long/short, script, corporate, technical, journalism, research, speech, thought leadership, creative, conversational, brand & product). Mechanics, not templates. |
| Craft | Broader membership a .md can belong to over time. Optional. Distinct from this session’s writing mode. |
| Push destination | Where accepted copy ships later. Not the genre pills. |

A resource may belong to a day, a project, a craft, and a person at once.

## Resources

The principal object is a **.md** — all text, copy in/out.

| Resource | Role | Source class |
|---|---|---|
| Seed writing | Authentic corpus, quiet import | owned |
| Session notes / brief | Cognitive context for one loop | owned |
| Draft version | Generated or user-edited copy | generated or owned |
| Accepted copy | Result of Push | owned (after accept) |
| Influence excerpt | Technique evidence | influence |
| Reference stub | Pointer-only, optional ingested text | reference |

Frontmatter (or an equivalent sidecar) records identity, timestamps, membership, source class, and destination. Body is human or generated prose. Derived fields (tags, summary, embedding id, cluster) are stored in indexes, not as the only copy, and must be regenerable.

Human body text is not overwritten by regeneration unless the user overrides that in settings.

## Relationships

First-class. The Galaxy visualizes them; it is not them.

Examples:

- `session` has_draft `draft`
- `draft` version_of `draft`
- `push` accepts `draft`
- `md` belongs_to `day` | `project` | `person` | `craft`
- `md` retrieved_for `draft` (provenance)
- `md` derived_from `md` (critic rewrite, user edit)
- `reference` points_at external SoR
- `influence` informs `draft` (technique only)

Backlinks are implied by relationships and must be queryable once indexes exist.

## Ownership

- The person owns authentic `.md` and accepted copy.
- Generated drafts are workspace-owned until accepted; they do not join the authentic lane automatically.
- Influence sources are never owned as the person's voice.
- External SoR owns the remote file. Second Pen owns the reference row and any optionally ingested excerpt, with consent and deletion that must propagate.

## Classification: memory kind vs source class

These are different axes. Both are set at write time in frontmatter. A `.md` is **one** `memory_kind` and **one** `source_class`. One user action may write multiple files (e.g. accepted copy + a reflective candidate).

### `source_class` (who is this)

| Value | Rule |
|---|---|
| owned | The person authored it, or accepted it on Push. Retrieved for **author-dependent** sessions. |
| authorized | Collaborator writing the person is allowed to treat as close to owned (v1: unused) |
| brand | Client / website brand corpus. Retrieved for **brand-dependent** sessions. Never mixed into authentic. |
| influence | Someone else’s writing, for technique only |
| reference | Pointer / optional ingest; not voice. Style manuals may feed **system-dependent** register. |
| generated | Model output not yet accepted |

Generated never becomes authentic because of indexing. Only Push flips a draft to `owned`.

### `memory_kind` (what job this file does)

**Decider:** the writer (the app), not a classifier model guessing after the fact. If a file would fit two kinds, split it into two files.

| Kind | Becomes this when | Examples | Indexed how |
|---|---|---|---|
| **episodic** | It *is* the writing or the session: raw text the retriever might quote as “how they wrote” | Seed paste, session brief, draft versions, accepted copy, dictation transcript, user edits | **Both:** Postgres FTS (keyword + metadata filters) **and** pgvector embeddings on passages |
| **semantic** | It *describes* writing: structured claims, not examples | Voice profile snapshot, destination mechanics, guardrail list, influence technique profile | **Structured first** (JSON/frontmatter query). FTS on readable fields. Embeddings optional on summary text, never treated as authentic examples |
| **reflective** | It *records a change to semantic memory* and the evidence for it | Profile diff proposal, accepted/rejected reflection, rollback note | FTS on rationale + pointers to episodic ids. Not in the default example retriever |

Default retrieval for generation step 5 (authentic examples) is **episodic + owned/authorized only**, hybrid FTS filter then vector rank.

Default load for step 1 (voice) is **semantic + owned**, type = voice profile, latest version.

Reflection files are **not** blended into step 5.

## Persistence

Two planes:

1. **Canonical (durable).** Markdown files. Exportable. Readable if the app is gone.
2. **Operational (disposable).** Neon Postgres: graph cache, **FTS**, **pgvector** embeddings, routing logs, permissions. Rebuildable from (1). Hybrid index is required: keyword/metadata filters plus semantic similarity. See [ADR-001](../03_DECISIONS/ADR/ADR-001-hosting-and-data-plane.md).

Voice profiles, tags, summaries, embeddings, and cluster assignments are derived from resources. They live on plane 2 unless snapshotted into a versioned `.md` the user can read.

## Open Questions

- File tree convention (recommended sketch: `people/{id}/accepted/`, `sessions/{id}/`, `seeds/`, `drafts/{id}/vN.md`).
- Frontmatter schema freeze (minimum: id, created_at, source_class, destination, parent_id).
- How Auto-structured dumps are split into multiple `.md` without surprising the author.
