# Desktop App

Source: [Blueprint](../BRAINSTORMING/Second-Pen-BLUEPRINT.md). Mockups: `docs/UI:UX/`.

## Purpose

The same product as mobile, on a surface that can show the draft as a document. Desktop is not a more complete product. It does not lead the information architecture. Mobile, dictation-first use governs; desktop follows.

## Native OS chrome (locked for Mac desktop)

The Mac desktop app **operates as a document app on the OS**, not as a website with fake chrome.

The top-left Mac menu bar is real OS menus (Electron / Tauri / native — TBD). Minimum:

- **File** — New, Open, Close, Save / Save As as they map to Markdown drafts
- **Folder** — open a folder of writing (Finder-backed `.md`, not an in-app library)
- **Projects** — named folders of work, still files on disk, not a project-page CMS

These items live in the **system menu bar**, top-left, like Pages or TextEdit. Do not paint a CSS menu in the page to stand in for this. The `web/` clickable stub cannot do this; it is a browser preview of the session loop only.

**Guardrail call-out:** Folder / Projects in the Mac File menu are OS document operations over Markdown on disk. They are not a browsable in-app library, Galaxy, or writing-OS sidebar. Do not add an in-app Projects rail “because the menu said Projects.”

## Holding hero (reference only — not approved)

`docs/UI:UX/holding-hero-reference.png` is a **holding mockup** for a possible hero / working surface (notes column, destination tabs, serif draft, Listen, Push). It will grow. It is **not** the chosen layout and **not** a spec to implement.

It also omits the native Mac menu bar. Treat that omission as a gap in the picture, not as permission to skip OS menus. A later desktop shell must show File / Open / Close / Folder / Projects in the real menu bar even if the in-window layout still changes.

## Core Responsibilities

- Host the hybrid working surface: an input stream (chat or notes) plus a pinned draft panel.
- Writing mode as a visible parameter: one CTA pill, then soft genre pills.
- Voice lane as a second CTA under it: author-dependent / brand-dependent / system-dependent, each write.
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

Option C is also at `docs/UI:UX/OptionC@2x.png`. The holding hero above is the same family of sketch — still undecided. The frosted-glass screenshot in that folder is a rejected reference, not a candidate.

Two of three directions share a two-panel skeleton. That is a likely consequence of locking hybrid interaction, not automatically a failed exploration. Option B is the only direction that breaks the skeleton. A direction still needs to be chosen; it is not chosen here.

## Open Questions

- Which of A / B / C (or a deliberate two-panel lock) is the desktop direction? Holding hero does not close this.
- How quiet corners (history, seed, settings) appear without becoming a rail.
- How the desktop surface shares session and draft identity with mobile.
- Exact File-menu verbs and whether “Projects” is only a folder alias.
- Brand name. "Second Pen" remains a placeholder.
