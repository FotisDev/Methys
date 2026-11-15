// Pure helpers for Journal posts and Drops (kept free of I/O so they're testable).

export type BodyBlock =
  { type: "heading"; text: string } | { type: "paragraph"; text: string };

// Journal bodies are plain text: blank lines split paragraphs and a line that
// starts with "## " is a heading. No HTML is ever rendered from the database.
export function parseBody(body: string | null | undefined): BodyBlock[] {
  if (!body) return [];
  const blocks: BodyBlock[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
    if (text) blocks.push({ type: "paragraph", text });
    paragraph = [];
  };

  for (const rawLine of body.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      flush();
      const text = line.slice(3).trim();
      if (text) blocks.push({ type: "heading", text });
    } else if (line === "") {
      flush();
    } else {
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

// Rough reading time at ~200 words per minute, at least 1.
export function readingMinutes(body: string | null | undefined) {
  const words = (body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export type DropPhase = "upcoming" | "live" | "ended";

export function dropPhase(
  drop: { starts_at: string; ends_at?: string | null },
  now = Date.now(),
): DropPhase {
  if (now < new Date(drop.starts_at).getTime()) return "upcoming";
  if (drop.ends_at && now >= new Date(drop.ends_at).getTime()) return "ended";
  return "live";
}

// Splits a duration into the parts a countdown shows. Never negative.
export function countdownParts(msLeft: number) {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
