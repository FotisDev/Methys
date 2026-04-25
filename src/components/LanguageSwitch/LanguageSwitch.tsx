"use client";

import { usePathname, useRouter, useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { locales } from "@/i18n.config";

const LOCALE_LABELS: Record<string, string> = {
  en: "🇬🇧",
  el: "🇬🇷",
  da: "🇩🇰",
  de: "🇩🇪",
};

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params.lang as string;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const switchLocale = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1 text-xs font-medium uppercase hover:opacity-80 transition-opacity"
      >
        {LOCALE_LABELS[currentLocale] ?? currentLocale.toUpperCase()}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50">
          {locales.map((locale) => (
            <li key={locale}>
              <button
                onClick={() => switchLocale(locale)}
                className={`w-full text-left px-4 py-2 text-xs uppercase hover:bg-gray-50 transition-colors
                  ${
                    currentLocale === locale
                      ? "font-bold text-vintage-green bg-gray-50"
                      : "text-gray-700"
                  }`}
              >
                {LOCALE_LABELS[locale] ?? locale.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
