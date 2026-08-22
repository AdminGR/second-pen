/** Client-side Push payload: generated + edited + accepted in one .md download. */

export type PushVersions = {
  generated: string;
  edited: string;
  accepted: string;
  writing: string;
  voice: string;
};

export function buildPushMarkdown(v: PushVersions): string {
  const generated = v.generated.trimEnd();
  const edited = v.edited.trimEnd();
  const accepted = v.accepted.trimEnd();
  return `---
source_class: owned
memory_kind: episodic
writing: ${v.writing}
voice: ${v.voice}
stub: true
versions: generated, edited, accepted
---

## Generated

${generated}

## Edited

${edited}

## Accepted

${accepted}
`;
}
