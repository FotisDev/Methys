import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import el from "@/messages/el.json";
import da from "@/messages/da.json";
import de from "@/messages/de.json";

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ""): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === "string") acc[prefix + key] = value;
    else Object.assign(acc, flatten(value, `${prefix}${key}.`));
    return acc;
  }, {});
}

const placeholders = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort();

const english = flatten(en as Tree);
const translations = { el, da, de } as Record<string, Tree>;

describe.each(Object.keys(translations))("messages/%s.json", (locale) => {
  const messages = flatten(translations[locale]);

  it("has every key that en.json has", () => {
    const missing = Object.keys(english).filter((key) => !(key in messages));
    expect(missing).toEqual([]);
  });

  it("has no keys that en.json does not have", () => {
    const extra = Object.keys(messages).filter((key) => !(key in english));
    expect(extra).toEqual([]);
  });

  it("uses the same {placeholders} as English", () => {
    const mismatched = Object.keys(english).filter(
      (key) =>
        key in messages &&
        placeholders(english[key]).join() !== placeholders(messages[key]).join(),
    );
    expect(mismatched).toEqual([]);
  });

  it("has no empty strings", () => {
    const empty = Object.entries(messages).filter(([, value]) => value.trim() === "");
    expect(empty).toEqual([]);
  });
});
