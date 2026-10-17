import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("joins classes and drops falsy values", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });

  it("resolves conflicting Tailwind classes, last one wins", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});
