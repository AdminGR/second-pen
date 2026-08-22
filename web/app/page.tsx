"use client";

import { useState } from "react";
import "./globals.css";
import {
  DEFAULT_VOICE,
  VOICE_LANES,
  laneOf,
  voiceLabel,
  type VoiceHarness,
  type VoiceLane,
} from "@/lib/voice-lane";
import {
  DEFAULT_WRITING,
  WRITING_CATEGORIES,
  categoryOf,
  writingLabel,
  type WritingCategoryId,
  type WritingKind,
} from "@/lib/writing-mode";
import { buildPushMarkdown } from "@/lib/push-md";

type SpeechRec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((ev: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function speechCtor(): (new () => SpeechRec) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRec;
    webkitSpeechRecognition?: new () => SpeechRec;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function Page() {
  const [notes, setNotes] = useState("");
  const [composer, setComposer] = useState("");
  const [writing, setWriting] = useState<WritingKind>(DEFAULT_WRITING);
  const [modeOpen, setModeOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<WritingCategoryId>(
    categoryOf(DEFAULT_WRITING).id,
  );
  const [voice, setVoice] = useState<VoiceHarness>(DEFAULT_VOICE);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [openLane, setOpenLane] = useState<VoiceLane>(laneOf(DEFAULT_VOICE).id);
  const [generated, setGenerated] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [editing, setEditing] = useState(false);

  const label = writingLabel(writing);
  const voiceCta = voiceLabel(voice);
  const expanded = WRITING_CATEGORIES.find((item) => item.id === openCategory);
  const expandedLane = VOICE_LANES.find((item) => item.id === openLane);

  function chooseKind(kind: WritingKind) {
    setWriting(kind);
    setOpenCategory(categoryOf(kind).id);
    setModeOpen(false);
  }

  function chooseCategory(id: WritingCategoryId) {
    const category = WRITING_CATEGORIES.find((item) => item.id === id);
    if (!category) return;
    setOpenCategory(id);
    if (category.kinds.length === 1) {
      const leaf = category.kinds[0];
      if (leaf) chooseKind(leaf.id);
    }
  }

  function chooseVoice(next: VoiceHarness) {
    setVoice(next);
    setOpenLane(laneOf(next).id);
    setVoiceOpen(false);
  }

  function chooseLane(id: VoiceLane) {
    const lane = VOICE_LANES.find((item) => item.id === id);
    if (!lane) return;
    setOpenLane(id);
    if (lane.harnesses.length === 1) {
      const leaf = lane.harnesses[0];
      if (leaf) chooseVoice(leaf.id);
    }
  }

  async function generateFrom(brief: string) {
    if (!brief.trim()) {
      setStatus("Add a note first.");
      return;
    }
    setBusy(true);
    setStatus("Generating…");
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, writing, voice }),
      });
      const data = (await res.json()) as {
        prose?: string;
        error?: string;
        stub?: boolean;
        tier?: string;
        model?: string;
        reason?: string;
      };
      if (!res.ok || !data.prose) {
        throw new Error(data.error ?? "Generate failed");
      }
      setGenerated(data.prose);
      setDraft(data.prose);
      setEditing(false);
      setStatus(
        [data.stub ? "stub" : data.tier, data.model, data.reason]
          .filter(Boolean)
          .join(" · "),
      );
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Generate failed");
    } finally {
      setBusy(false);
    }
  }

  async function commitNote(spoken?: string) {
    const addition = (spoken ?? composer).trim();
    const brief = [notes, addition].filter(Boolean).join("\n\n");
    if (!brief.trim()) {
      setStatus("Add a note first.");
      return;
    }
    setNotes(brief);
    setComposer("");
    await generateFrom(brief);
  }

  function dictate() {
    const Ctor = speechCtor();
    if (!Ctor) {
      setStatus("Mic unavailable. Type instead.");
      return;
    }
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (ev) => {
      const text = Array.from(ev.results)
        .map((r) => r[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (text) void commitNote(text);
    };
    rec.onerror = () => {
      setListening(false);
      setStatus("Mic error. Type instead.");
    };
    rec.onend = () => setListening(false);
    try {
      rec.start();
      setListening(true);
      setStatus("Listening…");
    } catch {
      setStatus("Mic could not start. Type instead.");
    }
  }

  function listen() {
    if (!draft.trim()) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setStatus("Listen unavailable in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(draft);
    u.rate = 1;
    window.speechSynthesis.speak(u);
  }

  function pushToDraft() {
    if (!draft.trim()) return;
    const accepted = draft;
    const edited = draft;
    const md = buildPushMarkdown({
      generated: generated || draft,
      edited,
      accepted,
      writing,
      voice,
    });
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "accepted.md";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Pushed — accepted.md (generated + edited + accepted).");
  }

  return (
    <main className="app">
      {/* Writing mode + voice lane are session parameters each write, not onboarding and not a library. */}
      <div className="mode-bar">
        <button
          type="button"
          className="mode-cta"
          aria-expanded={modeOpen}
          onClick={() => {
            setModeOpen((open) => !open);
            setVoiceOpen(false);
          }}
        >
          {label.cta}
        </button>
        {modeOpen ? (
          <div className="mode-panel">
            <p className="mode-hint">What this draft is allowed to be.</p>
            <div className="pills">
              {WRITING_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="pill"
                  aria-pressed={openCategory === category.id || categoryOf(writing).id === category.id}
                  onClick={() => chooseCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
            {expanded && expanded.kinds.length > 1 ? (
              <div className="pills subpills">
                {expanded.kinds.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="pill"
                    aria-pressed={writing === item.id}
                    onClick={() => chooseKind(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="mode-bar dependence">
        <button
          type="button"
          className="mode-cta"
          aria-expanded={voiceOpen}
          onClick={() => {
            setVoiceOpen((open) => !open);
            setModeOpen(false);
          }}
        >
          {voiceCta}
        </button>
        {voiceOpen ? (
          <div className="mode-panel">
            <p className="mode-hint">{expandedLane?.hint ?? "Whose language this draft uses."}</p>
            <div className="pills">
              {VOICE_LANES.map((lane) => (
                <button
                  key={lane.id}
                  type="button"
                  className="pill"
                  aria-pressed={openLane === lane.id || laneOf(voice).id === lane.id}
                  onClick={() => chooseLane(lane.id)}
                >
                  {lane.label}
                </button>
              ))}
            </div>
            {expandedLane && expandedLane.harnesses.length > 1 ? (
              <div className="pills subpills">
                {expandedLane.harnesses.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="pill"
                    aria-pressed={voice === item.id}
                    onClick={() => chooseVoice(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="shell">
        <section className="notes">
          <div className="label">Notes</div>
          <div className={`notes-body${notes ? "" : " empty"}`}>
            {notes || `${label.cta} · ${voiceCta} · say what this piece is for.`}
          </div>
          <p className="status">{status}</p>
          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              void commitNote();
            }}
          >
            <input
              value={composer}
              onChange={(e) => setComposer(e.target.value)}
              placeholder="Add a note, or speak a revision…"
              disabled={busy}
              aria-label="Add a note"
            />
            <button
              type="button"
              className="mic"
              onClick={dictate}
              disabled={listening || busy}
              aria-label="Speak"
            >
              <svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true">
                <rect x="3.25" y="0.75" width="4.5" height="8" rx="2.25" stroke="#111" strokeWidth="1.2" />
                <path d="M1.2 7.2a4.3 4.3 0 0 0 8.6 0" stroke="#111" strokeWidth="1.2" fill="none" />
                <path d="M5.5 11.4V13.2" stroke="#111" strokeWidth="1.2" />
              </svg>
            </button>
          </form>
        </section>
        <section className="draft">
          <div className="draft-head">
            <div className="label">Draft · {label.draft}</div>
            <button type="button" className="listen" onClick={listen} disabled={!draft}>
              Listen
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
                <path d="M1 4.2h2.2L6.4 1.6v8.8L3.2 7.8H1V4.2Z" stroke="#111" strokeWidth="1.1" />
                <path d="M8.4 4.1a2.4 2.4 0 0 1 0 3.8" stroke="#111" strokeWidth="1.1" />
                <path d="M10.1 2.6a4.4 4.4 0 0 1 0 6.8" stroke="#111" strokeWidth="1.1" />
              </svg>
            </button>
          </div>
          <textarea
            className="draft-body"
            value={draft}
            readOnly={!editing}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Every piece of writing your brand puts out should sound like it came from the same person —"
          />
          <div className="draft-foot">
            <button
              type="button"
              className="edit"
              aria-pressed={editing}
              disabled={!draft}
              onClick={() => setEditing((v) => !v)}
            >
              Edit
            </button>
            <button type="button" className="push" onClick={pushToDraft} disabled={!draft}>
              Push to draft
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
