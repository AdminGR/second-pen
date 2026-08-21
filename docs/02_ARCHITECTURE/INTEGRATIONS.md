# Integrations

**Status:** first architecture iteration

External apps stay systems of record. Second Pen is lightweight: it stores references and edges. Optional ingestion is for search and AI, not for owning the file.

Do not clone a project-page UI. OAuth, sync, webhooks, and workers exist so week-three connections work — not so first login becomes a connector wizard.

## Planned Integrations

### Day one (not SoR)

- LLM providers behind Luna / Terra / Sol / Auto — OpenAI-compatible HTTP; catalog is env (`MODEL_LUNA` / `MODEL_TERRA` / `MODEL_SOL`). Optional later: OpenRouter or Vercel AI Gateway as the endpoint, not as the policy.
- STT (dictation)
- TTS (Listen)
- Canonical Markdown storage
- Operational Postgres (indexes)

Copy in/out is `.md` paste, upload, and export.

### Week three (SoR and destinations)

Push targets and authentic-source connectors, each as a reference:

`provider`, `external_id`, `canonical_url`

Candidates (not a commitment): Google Docs, a CMS, a social draft box, mail. Kickoff's Gmail / LinkedIn / Docs list remains deferred until the session loop is real.

Influence sources in the first architecture are paste, upload, or a URL the user supplied — not a crawl.

## Authentication Requirements

- Model/STT/TTS: server-side secrets. Never in the client.
- SoR: OAuth with least scopes, per connector, when that connector ships.
- No OAuth required to complete the primary flow.

## Data Exchanged

| Direction | What | Stored as |
|---|---|---|
| In (seed) | Person's writing | Canonical `.md`, source_class=owned |
| In (optional ingest) | Excerpt from SoR | Reference + optional derived text |
| Out (Push stub) | Accepted copy | Canonical `.md`; outbound no-op or file download |
| Out (Push later) | Accepted copy | Reference edge to SoR; SoR remains owner |
| To models | Brief, voice, examples, destination mechanics | Ephemeral prompt; manifest kept |

## Risks / Dependencies

- Provider lock-in: adapters required (see kickoff keep-list).
- Ingested SoR text mistaken for authentic voice: source_class is mandatory.
- Workers and webhooks expanding into a sync product: out of scope for the first slice.
- Galaxy or a connector wall becoming the home screen: product violation.
