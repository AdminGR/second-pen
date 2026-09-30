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

Build the body with `buildDraftRequest` in `web/lib/draft-contract.ts` (or `JSON.stringify` of `{ brief, writing, voice }` with the same validated values). Post that JSON only. Do not paste the brief into a single-quoted `curl -d '…'` argument — apostrophes and newlines in the brief will break the shell.

Post the serialized body with a quoted heredoc or `--data-binary @-` so the brief stays inside the JSON string:

```bash
curl -sS -X POST http://localhost:3000/api/draft \
  -H 'content-type: application/json' \
  --data-binary @- <<'EOF'
PASTE_JSON_FROM_buildDraftRequest_OR_JSON.stringify_HERE
EOF
```

You can also pipe JSON from a small script (tsx, node after compile, etc.) into `--data-binary @-`. Send no other fields.

## Output

From the JSON response, read `prose` separately from the manifest. The manifest is only metadata: `writing`, `voice`, `tier`, `model`, `reason`, `stub`, plus `source_class: generated` and `memory_kind: episodic`. Build it with `buildDraftManifest` from the engine fields (`prose` is validated by that helper but is not stored on `DraftManifest`).

Show the prose first, then the manifest (JSON). If `prose` is empty or the response has `error`, show the error and stop.

Generated prose is not authentic voice. Do not mark it accepted. Do not merge influence into the voice.
