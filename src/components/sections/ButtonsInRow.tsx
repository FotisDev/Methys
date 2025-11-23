"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface DynamicSectionData {
  [key: string]: {
    title: string;
    text: string;
    img_url: string;
  };
}

interface ButtonsInRowProps {
  data: DynamicSectionData | null;
  defaultSelected?: string;
}

export default function ButtonsInRow({
  data,
  defaultSelected,
}: ButtonsInRowProps) {
  
  const keys = data ? Object.keys(data) : [];
  const hasData = data && keys.length > 0;

  const initialKey =
    hasData && defaultSelected && data[defaultSelected]
      ? defaultSelected
      : keys[0] || "";

  const [selectedKey, setSelectedKey] = useState<string>(initialKey);

  if (!hasData) {
    return (
      <section className="flex flex-col items-center py-12 px-4">
        <p className="text-gray-500">No sections available</p>
      </section>
    );
  }

  const selectedContent = data![selectedKey];

  if (!selectedContent) {
    return (
      <section className="flex flex-col items-center py-12 px-4">
        <p className="text-gray-500">Content not found</p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center py-12 px-4 space-y-12">
      {/* Button Row */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10 h-auto rounded-[35px] px-4 py-3 bg-[#F7F7F7]">
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => setSelectedKey(key)}
            className={`text-gray-500 font-poppins text-lg px-6 py-3 rounded-[40px] transition duration-300
              ${selectedKey === key ? "bg-[#dd8d14] text-white" : "hover:bg-[#dce3e9]"}`}
          >
            {data![key].title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedKey}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-5xl overflow-hidden rounded-xl bg-gray-100 shadow-lg p-6 md:p-10 flex flex-col items-center"
        >
          <h2 className="text-2xl md:text-3xl text-black font-bold mb-6 text-center">
            {selectedContent.title}
          </h2>
          <p className="text-black text-center mb-8 max-w-3xl leading-relaxed">
            {selectedContent.text}
          </p>
          <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden shadow-xl">
            <Image
              src={selectedContent.img_url}
              alt={selectedContent.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}