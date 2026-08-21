# Second Pen Blueprint

**Role:** product-surface contract  
**Status:** working brief for engineering  
**Date:** 2026-08-20  
**Canonical surface contract:** this file. It is the Second Pen Blueprint written in the 20 Aug 2026 session (problem, one job, core loop, hybrid draft, listen, monochrome, mobile-first). Promoted product docs cite it. If another “blueprint” appears, reconcile here before citing.

**Does not cover:** voice-model internals, data stores, integrations, scaffolding — those are in `docs/02_ARCHITECTURE/` and ADRs. This file still wins on what the person sees.

This is a working brief for engineering: what we're building, why, and the product and interface decisions made so far, before any architecture or scaffolding work begins.

## The problem

Every AI writing session starts from zero. A person who generates social copy on Monday and a user-manual paragraph on Thursday gets two pieces of writing that don't read like they came from the same author, because the model has no memory of how they write between sessions. Stack twenty of these outputs together and the seams show immediately. This is the gap a professional in-house copywriter normally fills: they carry a brand's voice in their head across every deliverable, so a landing page, a caption, and a support doc all sound like one person wrote them. Second Pen is that role, externalized into a tool — a persistent author a person can call on for any piece of writing, across any medium, and get their own voice back.

## What the product actually is

The product is not a content generator with a template picker. It's a single, continuous action: take an input (spoken or typed), run it through a model of how this specific person writes, shape the result for wherever it's going, and hand back a draft that can be reviewed by eye or by ear before it ships. The medium — a Reel script, a paragraph of web copy, a step in a manual — is a parameter on that one action, not a separate mode or screen. Holding that discipline matters for scope: the temptation with tools like this is to accrete a dashboard, a content library, a settings sprawl, and the product stops being the thing it was supposed to be. Second Pen should stay legible as one job done well.

## The core loop

Functionally, every session is the same shape: a person dictates or types a brief, optionally naming a destination; the system generates a draft in their voice, shaped for that destination's mechanics (sentence length, rhythm, where pauses fall — a Reel script and a manual step are not paced the same way even in the same voice); the person reviews the draft either by reading it or by listening to it read aloud, since text that scans cleanly on the page can trip on the ear and vice versa; and then the draft is pushed forward — out of the tool and into wherever it's actually going to be used. Read and listen are both first-class review paths, not one primary and one accessibility fallback, because a meaningful share of what this tool produces is written to be spoken.

## Design principles, and what they mean for engineering

The product should feel light, fast, obvious, and singular — not a heavy multi-purpose app. In engineering terms, that argues for a small number of durable UI states rather than a deep navigation tree, for generation and playback latency being treated as a product requirement and not a nice-to-have, and for restraint on adding secondary features (history browsing, a template library, account settings) as anything more than quiet, secondary affordances. The main surface should make it obvious what to do within a second of looking at it, with no onboarding required.

## Requirements gathered so far

Input needs to support both typing and dictation as equally normal ways to start a session, since the primary usage pattern is expected to be mobile and voice-first, with the desktop surface tying into the same model rather than being a separate product. Output needs a listen path — text-to-speech playback of the draft — sitting alongside the ability to read and edit it, because reviewing spoken-for copy by eye alone misses problems that only surface in the ear. Generation needs to be destination-aware: a selector for where the copy is going (Reels, website copy, a user manual, a video script, and so on) that changes not just tone but structural mechanics like pacing and sentence length. And there needs to be a clear "push to draft" action at the end of a session — the point where a reviewed piece of copy leaves the tool, which implies an eventual integration surface even though that wiring hasn't been designed yet.

## Interface direction settled so far

Two structural decisions are locked in for the main working surface. First, the interaction model is a hybrid: a chat-style input stream drives the session, but the current draft doesn't live inside that scrolling stream — it pins to its own persistent panel, so it behaves as a stable, reviewable, editable object rather than a message that scrolls out of view. That has a real implication for how the draft should be modeled in software: it needs its own identity, not just a position in a message log — something closer to a document with a save/edit/version history than a chat turn. Second, the visual system is pure monochrome — black, white, and grays only, flat and matte, with no photographic backdrops, gradients, or translucent "glass" panel effects. That choice was made deliberately against a reviewed reference that used a frosted-glass UI over a moody photo background: it looked distinctive in a portfolio shot, but it works against legibility in a tool whose core job is careful reading and listening, and it reads as a dated visual trend rather than a considered system.

## Concepts explored on the desktop surface

Three desktop layout directions were mocked up to react to, all sharing the hybrid interaction model and monochrome system but differing in structure. One keeps a conventional SaaS shape — a slim icon rail, chat on the left, the draft pinned to a panel on the right — the most familiar and easiest to extend, but also the least distinctive of the three. A second drops navigation chrome entirely in favor of a single centered command bar with the draft filling the page like a document, which is the starkest expression of "does one thing" but pushes history and settings into less visible corners. A third replaces the chat log with a notes column and sets the draft in serif type like a manuscript, leaning hardest into the idea that this tool has an authored voice, at some cost to how immediately familiar it feels on first use. All three are visible on one published canvas for comparison.

Reference mockups in this repo:

- `docs/UI:UX/OptionC@2x.png` — manuscript / notes direction (destination tabs, Listen, Push to draft)
- `docs/UI:UX/Screenshot 2026-08-20 at 1.42.56 PM.png` — rejected frosted-glass reference, not a candidate

## Open questions and what's next

The product's real name hasn't been decided — the mockups use "Second Pen" as a placeholder because it's the working project name, not a confirmed brand decision. The mobile layout hasn't been designed yet beyond the general principle that dictation-first, one-handed use should govern it; the desktop rail-based nav in particular won't translate directly and will need a mobile-native equivalent. A structural question is still open on the desktop concepts themselves: two of the three directions share more of the same two-panel skeleton than originally intended, which may simply be an inherent consequence of the hybrid interaction model rather than a problem, but it's worth a deliberate decision either way. And architecture and scaffolding are intentionally out of scope for this phase — separate documents are expected to define how the voice model, destination logic, and integrations actually work; this brief only covers what the product is and how it should look and feel on the surface.

See [PATH_FORWARD.md](PATH_FORWARD.md) for how this contract sits above the kickoff engine notes.
