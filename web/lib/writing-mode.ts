export const WRITING_KINDS = [
  "editorial_long",
  "editorial_short",
  "script",
  "corporate",
  "technical",
  "journalism",
  "research",
  "speech",
  "thought_leadership",
  "creative",
  "conversational",
  "brand_product",
] as const;

export type WritingKind = (typeof WRITING_KINDS)[number];

export type WritingCategoryId =
  | "editorial"
  | "script"
  | "corporate"
  | "technical"
  | "journalism"
  | "research"
  | "speech"
  | "thought_leadership"
  | "creative"
  | "conversational"
  | "brand_product";

export type WritingCategory = {
  id: WritingCategoryId;
  label: string;
  kinds: ReadonlyArray<{ id: WritingKind; label: string }>;
};

export const WRITING_CATEGORIES: ReadonlyArray<WritingCategory> = [
  {
    id: "editorial",
    label: "Editorial",
    kinds: [
      { id: "editorial_long", label: "Long form" },
      { id: "editorial_short", label: "Short form" },
    ],
  },
  { id: "script", label: "Script writing", kinds: [{ id: "script", label: "Script" }] },
  { id: "corporate", label: "Corporate", kinds: [{ id: "corporate", label: "Business" }] },
  { id: "technical", label: "Technical", kinds: [{ id: "technical", label: "Technical" }] },
  { id: "journalism", label: "Journalism", kinds: [{ id: "journalism", label: "Journalism" }] },
  { id: "research", label: "Research", kinds: [{ id: "research", label: "Research" }] },
  { id: "speech", label: "Speech", kinds: [{ id: "speech", label: "Speech" }] },
  {
    id: "thought_leadership",
    label: "Thought leadership",
    kinds: [{ id: "thought_leadership", label: "Thought leadership" }],
  },
  { id: "creative", label: "Creative", kinds: [{ id: "creative", label: "Literary" }] },
  {
    id: "conversational",
    label: "Conversational",
    kinds: [{ id: "conversational", label: "Conversational" }],
  },
  {
    id: "brand_product",
    label: "Brand & product",
    kinds: [{ id: "brand_product", label: "Brand & product" }],
  },
];

export const DEFAULT_WRITING: WritingKind = "editorial_short";

export function isWritingKind(value: string | undefined): value is WritingKind {
  return WRITING_KINDS.some((kind) => kind === value);
}

function mustCategory(id: WritingCategoryId): WritingCategory {
  const found = WRITING_CATEGORIES.find((category) => category.id === id);
  if (!found) {
    throw new Error(`missing writing category: ${id}`);
  }
  return found;
}

export function categoryOf(kind: WritingKind): WritingCategory {
  switch (kind) {
    case "editorial_long":
    case "editorial_short":
      return mustCategory("editorial");
    case "script":
      return mustCategory("script");
    case "corporate":
      return mustCategory("corporate");
    case "technical":
      return mustCategory("technical");
    case "journalism":
      return mustCategory("journalism");
    case "research":
      return mustCategory("research");
    case "speech":
      return mustCategory("speech");
    case "thought_leadership":
      return mustCategory("thought_leadership");
    case "creative":
      return mustCategory("creative");
    case "conversational":
      return mustCategory("conversational");
    case "brand_product":
      return mustCategory("brand_product");
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function writingLabel(kind: WritingKind): { cta: string; draft: string } {
  const category = categoryOf(kind);
  const detail = category.kinds.find((item) => item.id === kind)?.label ?? category.label;
  const nested = category.kinds.length > 1;
  const cta = nested ? `${category.label} · ${detail}` : category.label;
  return { cta, draft: cta };
}

export function writingMechanics(kind: WritingKind): string {
  switch (kind) {
    case "editorial_long":
      return "long-form editorial: sustained argument or narrative, sectioned prose, no listicle padding, no invented reporting";
    case "editorial_short":
      return "short-form editorial: one idea, tight lede, a few hundred words at most, no throat-clearing";
    case "script":
      return "script writing: spoken performance, short beats, hearable rhythm, not a page of paragraphs";
    case "corporate":
      return "corporate / business writing: clear memos and updates, precise, no slogans, no fake warmth";
    case "technical":
      return "technical writing: procedures and definitions, concrete verbs, accurate sequence, no marketing";
    case "journalism":
      return "journalism: lede then facts, attributable, no invented quotes or unsourced claims";
    case "research":
      return "research writing: claims with caution, structured findings, no hype, mark uncertainty";
    case "speech":
      return "speech: oral cadence for a live audience, breath and emphasis, not an essay read aloud";
    case "thought_leadership":
      return "thought leadership: a point of view with earned authority, not a pitch deck or a list of tips";
    case "creative":
      return "creative / literary: image, rhythm, and voice; not SEO, not a brief dressed as a poem";
    case "conversational":
      return "conversational writing: talk like a person, short turns, no brochure voice";
    case "brand_product":
      return "brand and product writing: name the thing honestly, benefits without empty slogans unless asked";
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

export function isStructuralWriting(kind: WritingKind): boolean {
  switch (kind) {
    case "editorial_long":
    case "technical":
    case "research":
    case "journalism":
    case "thought_leadership":
    case "corporate":
    case "script":
      return true;
    case "editorial_short":
    case "speech":
    case "creative":
    case "conversational":
    case "brand_product":
      return false;
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}
