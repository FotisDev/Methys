
export const locales = ['en', 'el', 'da',"de"] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';