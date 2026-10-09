import { FAQ } from "@/_lib/types";
import Link from "@/components/LocaleLink/LocaleLink";
import type { Translator } from "@/i18n/translate";

interface FaqSectionProps {
  title: string;
  subtitle: string;
  faqs: FAQ[];
  t: Translator;
}

// Native <details> so answers of any length open fully and work without JS.
export default function FaqSection({
  title,
  subtitle,
  faqs,
  t,
}: FaqSectionProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-6 pb-20 md:pt-10">
      <header className="border-b border-default-color pb-8">
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">
          {subtitle}
        </p>
        <h1 className="text-2xl md:text-3xl font-light tracking-wide">
          {title}
        </h1>
      </header>

      {faqs.length === 0 ? (
        <p className="text-sm text-gray-600 pt-8">{t("help.noFaqs")}</p>
      ) : (
        <div>
          {faqs.map((faq) => (
            <details
              key={faq.id}
              className="group border-b border-default-color py-6"
            >
              <summary className="flex justify-between items-start gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h2 className="text-sm md:text-base font-medium">
                  {faq.title}
                </h2>
                <span
                  aria-hidden="true"
                  className="text-lg leading-none transition group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <div className="mt-4 text-sm text-gray-700 leading-relaxed">
                {faq.subtitle && (
                  <p className="font-medium text-vintage-green mb-2">
                    {faq.subtitle}
                  </p>
                )}
                <p className="whitespace-pre-line">{faq.description}</p>
              </div>
            </details>
          ))}
        </div>
      )}

      <aside className="mt-16 border-t border-default-color pt-8 text-sm">
        <p className="font-medium mb-1">{t("help.questionsTitle")}</p>
        <p className="text-gray-600">
          {t("help.questionsText")}{" "}
          <Link
            href="/customer-support"
            className="underline underline-offset-4 hover:text-default-cold"
          >
            {t("legal.contactUs")}
          </Link>
        </p>
      </aside>
    </div>
  );
}
