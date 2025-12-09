"use client";

import { FAQ } from "@/_lib/types";
import { useState } from "react";
import { HeaderProvider } from "../providers/HeaderProvider";
import Footer from "../footer/Footer";

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  faqs: FAQ[];
}

export default function FaqSection({ title, subtitle, faqs }: FaqSectionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <HeaderProvider  forceOpaque={false}>
      <section className="w-full custom-container-4xl padding-x padding-y font-poppins p-5 bg-default-color pt-20 md:pt-24">
        <div className="flex flex-col justify-center items-center">
          <p className="text-vintage-brown text-lg font-semibold pt-20">{subtitle}</p>
          <h2 className="text-vintage-green text-5xl mb-8 pt-5">{title}</h2>

          {faqs.length === 0 ? (
            <p>No FAQs found.</p>
          ) : (
            <div className="w-full max-w-3xl">
              {faqs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-300 py-12">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex justify-between items-start w-full text-left group"
                  >
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-vintage-green transition-colors">
                        {faq.title}
                      </h3>
                    </div>
                    <span className="text-2xl font-light  text-vintage-green ml-4 transition-transform duration-300">
                      {openId === faq.id ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out  rounded-3xl bg-vintage-white ${
                      openId === faq.id ? "max-h-96 mt-4 p-5" : "max-h-0"
                    }`}
                  >
                    <div className="text-vintage-brown">
                      {faq.subtitle && (
                        <p className="font-medium mb-2">{faq.subtitle}</p>
                      )}
                      <p className="text-black font-semibold font-roboto text-lg">{faq.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer showNewsLetter={false}/>
    </HeaderProvider>
  );
}
