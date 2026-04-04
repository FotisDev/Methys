

import type { locales } from './i18n.config'; 

const dictionaries: Record<string, () => Promise<any>> = {
  en: () => import('./locales/en.json').then((m) => m.default),
  el: () => import('./locales/el.json').then((m) => m.default),
  da: () => import('./locales/da.json').then((m) => m.default),
};

export const getDictionary = async (locale: string) => {
  return dictionaries[locale]?.() ?? dictionaries['en']();
};