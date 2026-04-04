

import type { Locale } from './i18n.config'; 

const dictionaries: Record<string, () => Promise<any>> = {
  en: () => import('../src/locales/en.json').then((m) => m.default),
  el: () => import('../src/locales/el.json').then((m) => m.default),
  da: () => import('../src/locales/da.json').then((m) => m.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale]?.() ?? dictionaries['en']();
};