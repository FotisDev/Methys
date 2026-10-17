"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "@/components/LocaleLink/LocaleLink";
import Image from "next/image";
import myImageLoader from "@/_lib/utils/myImageLoader";
import { cn } from "@/_lib/utils/cn";

export default function BuyNow() {
  return (
    <section
      className={cn(
        "flex justify-center p-6 sm:p-12 lg:p-20 bg-white mb-12 lg:mb-24",
      )}
    >
      <div
        className={cn(
          "flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl rounded-[72px] px-6 sm:px-12 lg:px-32 bg-amber-500 min-h-[670px] gap-10",
        )}
      >
        {/* Animated Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className={cn(
            "flex flex-col items-center lg:items-start text-white text-center lg:text-left w-full lg:w-1/2",
          )}
        >
          <h1
            className={cn("text-3xl sm:text-4xl font-bold mt-4 leading-tight")}
          >
            Ready to Wear the New Trend?
            <br className={cn("hidden lg:block")} />
            <span className={cn("text-white/90")}> Buy it now!</span>
          </h1>
          <p
            className={cn(
              "text-sm sm:text-base md:text-lg mb-10 mt-4 text-white/90",
            )}
          >
            Our friendly customer service team is here to help.
            <br className={cn("hidden sm:block")} />
            Contact us anytime for support and inquiries.
          </p>
          <button
            className={cn(
              "px-10 py-4 bg-white text-cyan-800 font-semibold rounded-full text-base hover:bg-gray-200 transition",
            )}
          >
            <Link href="/collections">Buy Now</Link>
          </button>
        </motion.div>

        {/* Animated Image Section */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className={cn("w-full lg:w-1/2")}
        >
          <Image
            loader={myImageLoader}
            width={250}
            height={250}
            src="/urbanValor.jpg"
            alt="A stylish cloth ready to wear"
            className={cn("w-full h-auto rounded-3xl mb-5 shadow-xl")}
          />
        </motion.div>
      </div>
    </section>
  );
}
