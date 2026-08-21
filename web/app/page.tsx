"use client";

import { useMemo, useState } from "react";
import "./globals.css";

type Destination = "reel" | "web_copy" | "manual" | "script";

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
  const [brief, setBrief] = useState("");
  const [destination, setDestination] = useState<Destination>("web_copy");
  const [generated, setGenerated] = useState("");
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("Type a brief, or use the mic.");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);

  const canListen = useMemo(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    [],
  );

  async function generate() {
    if (!brief.trim()) {
      setStatus("Add a brief first.");
      return;
    }
    setBusy(true);
    setStatus("Generating…");
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief, destination }),
      });
      const data = (await res.json()) as { prose?: string; error?: string; stub?: boolean };
      if (!res.ok || !data.prose) {
        throw new Error(data.error ?? "Generate failed");
      }
      setGenerated(data.prose);
      setDraft(data.prose);
      setStatus(data.stub ? "Stub draft (no OPENAI_API_KEY)." : "Draft ready.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Generate failed");
    } finally {
      setBusy(false);
    }
  }

  function dictate() {
    const Ctor = speechCtor();
    if (!Ctor) {
      setStatus("Mic unavailable in this browser. Type instead.");
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
      if (text) setBrief((prev) => (prev ? `${prev} ${text}` : text));
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
    if (!draft.trim()) {
      setStatus("Generate a draft first.");
      return;
    }
    if (!canListen) {
      setStatus("Listen unavailable in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(draft);
    u.rate = 1;
    window.speechSynthesis.speak(u);
    setStatus("Playing draft.");
  }

  function pushToDraft() {
    if (!draft.trim()) {
      setStatus("Nothing to push.");
      return;
    }
    const accepted = draft;
    const md = `---
source_class: owned
memory_kind: episodic
destination: ${destination}
stub: true
---

${accepted}
`;
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "accepted.md";
    a.click();
    URL.revokeObjectURL(url);
    console.info("push", {
      generated,
      edited: draft,
      accepted,
    });
    setStatus("Pushed — accepted.md downloaded (stub destination).");
  }

  return (
    <main className="shell">
      {/* Auto / Luna / Terra / Sol picker deferred — not forgotten. No extra nav. */}
      <section className="brief">
        <div className="label">Brief</div>
        <textarea
          value={brief}
          onChange={(e) => setBrief(e.target.value)}
          placeholder="What do you need written?"
        />
        <div className="row">
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value as Destination)}
            aria-label="Destination"
          >
            <option value="reel">Reel</option>
            <option value="web_copy">Web copy</option>
            <option value="manual">Manual</option>
            <option value="script">Script</option>
          </select>
          <button type="button" onClick={dictate} disabled={listening}>
            {listening ? "Listening" : "Mic"}
          </button>
          <button type="button" className="primary" onClick={generate} disabled={busy}>
            Generate
          </button>
        </div>
        <p className="status">{status}</p>
        <p className="note">Stub session. Not context assembly. Typed brief always works.</p>
      </section>
      <section className="draft">
        <div className="label">Draft · pinned</div>
        <textarea
          className="draft-body"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Draft lands here — a document, not a chat turn."
        />
        <div className="row">
          <button type="button" onClick={listen} disabled={!draft}>
            Listen
          </button>
          <button type="button" className="primary" onClick={pushToDraft} disabled={!draft}>
            Push to draft
          </button>
        </div>
      </section>
    </main>
  );
}
