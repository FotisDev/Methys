
export const locales = ['en', 'el', 'da'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';