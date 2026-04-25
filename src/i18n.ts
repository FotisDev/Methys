type Dictionary = Record<string, string | Record<string, string>>;

const dictionaries: Record<string, () => Promise<Dictionary>> = {
  en: () => import("./locales/en.json").then((m) => m.default),
  el: () => import("./locales/el.json").then((m) => m.default),
  da: () => import("./locales/da.json").then((m) => m.default),
  de: () => import("./locales/de.json").then((m) => m.default),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  return dictionaries[locale]?.() ?? dictionaries["en"]();
};
