---
name: voice-draft
description: >-
  Stand-in client of the Second Pen voice engine. Use when the user asks to
  test the voice-draft skill, draft through the engine contract, or turn a
  brief plus a writing kind and voice harness into prose and a manifest.
---

# Voice draft

This skill is a client of the voice engine. It is not the content driver. Do not plan a calendar, slate, cadence, or scheduled run. Do not add those ideas to Second Pen.

## Inputs

Require all three. If one is missing, ask for it and stop.

- `brief_text` — the note to draft from.
- `writing` — a writing kind from `web/lib/writing-mode.ts`. The test kind is `script`. `linkedin_post` is not a kind yet.
- `voice` — a harness id from `web/lib/voice-lane.ts`. The test harness is `author_writing`. A file path is not a voice reference.

## Call

The dev server must already be running at `http://localhost:3000` (`cd web && npm run dev`).

Build the body with `buildDraftRequest` in `web/lib/draft-contract.ts`. Post that JSON only:

```bash
curl -sS -X POST http://localhost:3000/api/draft \
  -H 'content-type: application/json' \
  -d '{"brief":"BRIEF","writing":"WRITING","voice":"VOICE"}'
```

Replace `BRIEF`, `WRITING`, and `VOICE` with the validated values. Send no other fields.

## Output

From the JSON, keep `prose`, `stub`, `tier`, `model`, `reason`, `writing`, and `voice`. Build the manifest with `buildDraftManifest`: those fields plus `source_class: generated` and `memory_kind: episodic`.

Show the prose, then the manifest. If `prose` is empty or the response has `error`, show the error and stop.

Generated prose is not authentic voice. Do not mark it accepted. Do not merge influence into the voice.
