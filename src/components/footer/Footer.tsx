"use client";

import Image from "next/image";
import { LinkedIn } from "@/svgs/linkedIn";
import { JSX } from "react";
import { Youtube } from "@/svgs/youtube";
import { X } from "@/svgs/X";
import { Instagram } from "@/svgs/instagram";
import { Facebook } from "@/svgs/facebook";
import { Tiktok } from "@/svgs/tiktok";
import { WorldShpereSvg } from "@/svgs/worldShpere";
import Link from "@/components/LocaleLink/LocaleLink";
import FoldableSectionComponent from "../foldableComponent/FoldableSection";
import { useAuth } from "../providers/AuthProvider";
import { useT } from "@/i18n/client";
import { rich } from "@/i18n/rich";
import NewsletterForm from "./NewsletterForm";
import { NEWSLETTER_DISCOUNT_PERCENT } from "@/_lib/constants";

export default function Footer() {
  const { isAuthenticated, isLoading } = useAuth();
  const t = useT();

  const socials: Array<{
    name: string;
    icon: (() => JSX.Element) | null;
    url: string;
  }> = [
    { name: "facebook", icon: Facebook, url: "" },
    { name: "instagram", icon: Instagram, url: "" },
    { name: "X", icon: X, url: "" },
    { name: "tiktok", icon: Tiktok, url: "" },
    { name: "linkedin", icon: LinkedIn, url: "" },
    { name: "youtube", icon: Youtube, url: "" },
  ];

  const [legalPolicyColumn, quickLinksColumn, paymentMethods] = [
    {
      category: t("footer.legalPolicy"),
      items: [
        { name: t("footer.termsConditions"), href: "/terms-conditions" },
        { name: t("footer.privacyPolicy"), href: "/privacy-policy" },
        { name: t("footer.legalNotice"), href: "/legal-notice" },
        { name: t("footer.collections"), href: "/collections" },
      ],
    },
    {
      category: t("footer.quickLinks"),
      items: [
        { name: t("footer.home"), href: "/" },
        { name: t("footer.about"), href: "/about" },
        { name: t("footer.help"), href: "/help" },
      ],
    },
    {
      category: t("footer.paymentMethods"),
      items: [
        {
          name: "Stripe",
          href: "/",
          Ιcon: "/stripe2.png",
        },
      ],
    },
  ];

  return (
    <footer className="w-full font-robboto bg-white padding-x">
      <section
        className="
          grid
          grid-cols-1
          sm:grid-cols-1
          md:grid-cols-1
          lg:grid-cols-4
          gap-12
          px-3
          py-10
         
          
        "
      >
        <div className="flex flex-col gap-6 w-full sm:w-96 lg:w-full">
          <h3 className="font-bold text-vintage-green">
            {t("footer.joinCommunity")}
          </h3>

          <p className="text-sm">
            {t("footer.newsletterText", {
              percent: NEWSLETTER_DISCOUNT_PERCENT,
            })}
          </p>

          <NewsletterForm />

          <div className="flex gap-4">
            {socials.map((social, index) => {
              const Icon = social.icon;
              return (
                <div key={index} className="w-5 h-5 cursor-pointer text-black">
                  {Icon ? <Icon /> : social.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <FoldableSectionComponent
            title={legalPolicyColumn.category}
            items={legalPolicyColumn.items}
          />
        </div>
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <FoldableSectionComponent
            title={quickLinksColumn.category}
            items={quickLinksColumn.items}
          />
        </div>
        <div className="flex flex-col gap-2 text-center lg:text-left">
          <h3 className="text-vintage-green font-bold">
            {paymentMethods.category}
          </h3>
          <div className="flex gap-2 justify-center lg:justify-start">
            {paymentMethods.items.map((item, index) => (
              <Image
                key={index}
                src={item.Ιcon}
                alt={item.name}
                width={50}
                height={50}
              />
            ))}
          </div>
          <div className="flex flex-col gap-1 pt-5 ">
            <h3 className="text-vintage-green font-bold">
              {t("footer.country")}
            </h3>
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <WorldShpereSvg />
              <p className="text-sm underline">{t("footer.international")}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center lg:items-start gap-6"></div>
      </section>
      <hr className="" />

      <div className="relative px-4 py-6">
        <div className="text-center text-sm">
          {rich(t("footer.copyright", { year: new Date().getFullYear() }), {
            brand: (
              <span className="text-vintage-green font-bold">Methys.</span>
            ),
          })}
        </div>

        {!isLoading && !isAuthenticated && (
          <div
            className="
              flex
              flex-col
              sm:flex-row
              items-center
              gap-4
              text-sm
              mt-6
              lg:absolute
              lg:right-5
              lg:bottom-6
            "
          >
            <span className="text-vintage-green text-center">
              {rich(t("footer.specialOffers"), {
                offers: (
                  <span className="text-red-500">{t("footer.offers")}</span>
                ),
              })}
            </span>

            <Link
              href="/login"
              className="w-[130px] h-[40px] border border-vintage-green bg-white text-vintage-green flex items-center justify-center rounded hover:bg-vintage-green hover:text-white"
            >
              {t("footer.signUpSignIn")}
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
}
