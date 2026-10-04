"use client";

import { createContext, useContext, useMemo } from "react";
import { defaultLocale, type Locale } from "@/i18n.config";
import { createTranslator, formatPrice, type Translator } from "./translate";

const LocaleContext = createContext<Locale>(defaultLocale);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useT(): Translator {
  const locale = useLocale();
  return useMemo(() => createTranslator(locale), [locale]);
}

export function useFormatPrice() {
  const locale = useLocale();
  return (amount: number | string) => formatPrice(amount, locale);
}
