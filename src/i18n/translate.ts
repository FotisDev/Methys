import en from "@/messages/en.json";
import el from "@/messages/el.json";
import da from "@/messages/da.json";
import de from "@/messages/de.json";
import { defaultLocale, type Locale } from "@/i18n.config";

export type Messages = typeof en;

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never;
type Paths<T> = {
  [K in keyof T]: T[K] extends string ? K : Join<K, Paths<T[K]>>;
}[keyof T];

export type MessageKey = Paths<Messages>;
export type TranslateVars = Record<string, string | number>;
export type Translator = (key: MessageKey, vars?: TranslateVars) => string;

// Other locales may lag behind en.json while keys are added, so they are typed loosely.
const MESSAGES: Record<Locale, unknown> = { en, el, da, de };

export function getMessages(locale: Locale) {
  return MESSAGES[locale] ?? MESSAGES[defaultLocale];
}

function lookup(messages: unknown, key: string): string | undefined {
  let node: unknown = messages;
  for (const part of key.split(".")) {
    if (node === null || typeof node !== "object") return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

// "Hello {name}" + { name: "Ana" } -> "Hello Ana"
function interpolate(template: string, vars?: TranslateVars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function createTranslator(locale: Locale): Translator {
  const messages = getMessages(locale);
  const fallback = getMessages(defaultLocale);

  return (key, vars) =>
    interpolate(lookup(messages, key) ?? lookup(fallback, key) ?? key, vars);
}

// For keys built at runtime (e.g. category slugs from the DB), with a fallback text.
export function translateDynamic(t: Translator, key: string, fallback: string) {
  const value = t(key as MessageKey);
  return value === key ? fallback : value;
}

// Category names come from the DB in English; translations live under "categories.<slug>".
export function translateCategory(
  t: Translator,
  slugOrName: string | null | undefined,
  name: string,
) {
  const slug = (slugOrName ?? name).toLowerCase().trim().replace(/\s+/g, "-");
  return translateDynamic(t, `categories.${slug}`, name);
}

// Picks "<key>_one" or "<key>_other" (all supported locales use one/other plural forms).
export function translateCount(t: Translator, baseKey: string, count: number) {
  return t(`${baseKey}_${count === 1 ? "one" : "other"}` as MessageKey, {
    count,
  });
}

export function formatPrice(
  amount: number | string,
  locale: Locale,
  currency = "EUR",
) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    Number(amount),
  );
}
