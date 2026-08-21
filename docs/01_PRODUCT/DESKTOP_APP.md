# Desktop App

Source: [Blueprint](../BRAINSTORMING/Second-Pen-BLUEPRINT.md). Mockups: `docs/UI:UX/`.

## Purpose

The same product as mobile, on a surface that can show the draft as a document. Desktop is not a more complete product. It does not lead the information architecture. Mobile, dictation-first use governs; desktop follows.

## Core Responsibilities

- Host the hybrid working surface: an input stream (chat or notes) plus a pinned draft panel.
- Destination as a visible parameter (tabs or equivalent): Reel, web copy, manual, script.
- Type and dictate into the session.
- Show the draft as a stable, editable object with Listen, Edit, and Push to draft.
- Visual system: black, white, grays only. Flat, matte. No photographic backdrops, gradients, or glass.

Locked interaction model: the draft is not a message in the stream. It has its own identity (document with save / edit / version history).

## Local Capabilities

Undecided pending architecture. Product constraints that will apply:

- Few durable UI states. No deep navigation tree.
- History, settings, and any seed/import live as quiet corners, not rails of equal weight.
- Generation and playback latency are in-scope as product behavior, wherever they run.

## Cloud Dependencies

Undecided. Expected eventually: model-backed generation, speech-to-text, text-to-speech, and later destination push. The first slice may stub Push outbound while still committing locally. Do not treat connectors (mail, Docs, social publish) as desktop-only features.

## Desktop layout directions

All three share the hybrid model and the monochrome system.

| Direction | Structure | Fits | Cost |
|---|---|---|---|
| A — conventional SaaS | Icon rail, chat left, draft right | Familiar, easy to extend | Least distinctive; rail will not survive mobile |
| B — command bar | No nav chrome; draft fills the page | Starkest "does one thing" | History and settings become corners |
| C — manuscript | Notes column, serif draft, destination tabs | Authored-voice; Listen and Push visible | Less familiar on first use; still two-panel |

Option C is in-repo at `docs/UI:UX/OptionC@2x.png`. The frosted-glass screenshot in that folder is a rejected reference, not a candidate.

Two of three directions share a two-panel skeleton. That is a likely consequence of locking hybrid interaction, not automatically a failed exploration. Option B is the only direction that breaks the skeleton. A direction still needs to be chosen; it is not chosen here.

## Open Questions

- Which of A / B / C (or a deliberate two-panel lock) is the desktop direction?
- How quiet corners (history, seed, settings) appear without becoming a rail.
- How the desktop surface shares session and draft identity with mobile.
- Brand name. "Second Pen" remains a placeholder.
