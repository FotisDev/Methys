import { describe, expect, it } from "vitest";
import {
  countdownParts,
  dropPhase,
  parseBody,
  readingMinutes,
} from "./content";

describe("parseBody", () => {
  it("splits paragraphs on blank lines and joins wrapped lines", () => {
    expect(parseBody("First line\ncontinues.\n\nSecond.")).toEqual([
      { type: "paragraph", text: "First line continues." },
      { type: "paragraph", text: "Second." },
    ]);
  });

  it("recognizes ## headings", () => {
    expect(parseBody("Intro\n## How to layer\nStart thin.")).toEqual([
      { type: "paragraph", text: "Intro" },
      { type: "heading", text: "How to layer" },
      { type: "paragraph", text: "Start thin." },
    ]);
  });

  it("keeps HTML as plain text", () => {
    expect(parseBody("<script>x</script>")).toEqual([
      { type: "paragraph", text: "<script>x</script>" },
    ]);
  });

  it("handles empty input and Windows newlines", () => {
    expect(parseBody(null)).toEqual([]);
    expect(parseBody("a\r\n\r\nb")).toHaveLength(2);
  });
});

describe("readingMinutes", () => {
  it("is at least one minute", () => expect(readingMinutes("hi")).toBe(1));
  it("counts ~200 words a minute", () =>
    expect(readingMinutes("word ".repeat(1000))).toBe(5));
});

describe("dropPhase", () => {
  const now = new Date("2026-11-15T12:00:00Z").getTime();
  it("is upcoming before the start", () =>
    expect(dropPhase({ starts_at: "2026-11-16T00:00:00Z" }, now)).toBe(
      "upcoming",
    ));
  it("is live after the start with no end", () =>
    expect(dropPhase({ starts_at: "2026-11-01T00:00:00Z" }, now)).toBe("live"));
  it("is ended after the end", () =>
    expect(
      dropPhase(
        { starts_at: "2026-11-01T00:00:00Z", ends_at: "2026-11-10T00:00:00Z" },
        now,
      ),
    ).toBe("ended"));
});

describe("countdownParts", () => {
  it("splits milliseconds into days, hours, minutes, seconds", () => {
    expect(countdownParts(((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
    });
  });
  it("never goes negative", () =>
    expect(countdownParts(-5000)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }));
});
