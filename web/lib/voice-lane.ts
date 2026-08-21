export type VoiceLane = "author" | "brand" | "system";

export const VOICE_HARNESSES = [
  "author_journalism",
  "author_youtube",
  "author_writing",
  "brand_client",
  "system_technical",
  "system_legal",
  "system_academic",
  "system_corporate",
] as const;

export type VoiceHarness = (typeof VOICE_HARNESSES)[number];

export type VoiceLaneDef = {
  id: VoiceLane;
  label: string;
  hint: string;
  harnesses: ReadonlyArray<{ id: VoiceHarness; label: string }>;
};

export const VOICE_LANES: ReadonlyArray<VoiceLaneDef> = [
  {
    id: "author",
    label: "Author-dependent",
    hint: "Sound like work you have already done.",
    harnesses: [
      { id: "author_journalism", label: "My journalism" },
      { id: "author_youtube", label: "My YouTube" },
      { id: "author_writing", label: "My writing" },
    ],
  },
  {
    id: "brand",
    label: "Brand-dependent",
    hint: "The client's voice, not yours. Named brands attach after seed — not a brand library.",
    harnesses: [{ id: "brand_client", label: "Client brand" }],
  },
  {
    id: "system",
    label: "System-dependent",
    hint: "The register of the institution, not a personal or brand voice.",
    harnesses: [
      { id: "system_technical", label: "Technical" },
      { id: "system_legal", label: "Legal" },
      { id: "system_academic", label: "Academic" },
      { id: "system_corporate", label: "Corporate reporting" },
    ],
  },
];

export const DEFAULT_VOICE: VoiceHarness = "author_writing";

export function isVoiceHarness(value: string | undefined): value is VoiceHarness {
  return VOICE_HARNESSES.some((item) => item === value);
}

export function laneOf(harness: VoiceHarness): VoiceLaneDef {
  switch (harness) {
    case "author_journalism":
    case "author_youtube":
    case "author_writing":
      return mustLane("author");
    case "brand_client":
      return mustLane("brand");
    case "system_technical":
    case "system_legal":
    case "system_academic":
    case "system_corporate":
      return mustLane("system");
    default: {
      const _exhaustive: never = harness;
      return _exhaustive;
    }
  }
}

function mustLane(id: VoiceLane): VoiceLaneDef {
  const found = VOICE_LANES.find((lane) => lane.id === id);
  if (!found) {
    throw new Error(`missing voice lane: ${id}`);
  }
  return found;
}

export function voiceLabel(harness: VoiceHarness): string {
  const lane = laneOf(harness);
  const detail = lane.harnesses.find((item) => item.id === harness)?.label ?? lane.label;
  if (lane.harnesses.length === 1) {
    return lane.label;
  }
  return `${lane.label} · ${detail}`;
}

export function voiceMechanics(harness: VoiceHarness): string {
  switch (harness) {
    case "author_journalism":
      return "author-dependent: sound like this person's existing journalism — cadence, reporting habits, and restraint from their work, not a generic reporter";
    case "author_youtube":
      return "author-dependent: sound like this person's YouTube/spoken-to-camera work — address, pacing, and asides they actually use";
    case "author_writing":
      return "author-dependent: sound like this person's own writing body of work; do not invent a new personality";
    case "brand_client":
      return "brand-dependent: write in the client brand's voice. Do not use the author's personal voice. Do not flatten into generic marketing";
    case "system_technical":
      return "system-dependent: technical register — terms of art, precise sequence, no personal voice, no brand slogans";
    case "system_legal":
      return "system-dependent: legal register — defined terms, caution, no invented law, no casual voice";
    case "system_academic":
      return "system-dependent: academic register — claims with warrant, citation-ready caution, no blog voice";
    case "system_corporate":
      return "system-dependent: corporate reporting register — institutional, specific, no founder-personal or consumer-brand voice";
    default: {
      const _exhaustive: never = harness;
      return _exhaustive;
    }
  }
}

export function isRegisterHeavy(harness: VoiceHarness): boolean {
  switch (harness) {
    case "system_legal":
    case "system_academic":
    case "system_corporate":
    case "system_technical":
      return true;
    case "author_journalism":
    case "author_youtube":
    case "author_writing":
    case "brand_client":
      return false;
    default: {
      const _exhaustive: never = harness;
      return _exhaustive;
    }
  }
}
