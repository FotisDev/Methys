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
 
  if (!data) {
    return (
      <section className="flex flex-col items-center py-12 px-4">
        <p className="text-gray-500">No sections available</p>
      </section>
    );
  }

  const keys = Object.keys(data);
  
  if (keys.length === 0) {
    return (
      <section className="flex flex-col items-center py-12 px-4">
        <p className="text-gray-500">No sections found</p>
      </section>
    );
  }

  const [selectedKey, setSelectedKey] = useState<string>(
    (defaultSelected && data[defaultSelected]) ? defaultSelected : keys[0]
  );

  const selectedContent = data[selectedKey];

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
            ${
              selectedKey === key
                ? "bg-[#dd8d14] text-white"
                : "hover:bg-[#dce3e9]"
            }`}
          >
            {data[key].title}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedKey}
          layout
          initial={{ width: 110, opacity: 0 }}
          animate={{ width: "70vw", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden rounded-xl bg-gray-100 shadow-lg p-6 flex flex-col items-center shadow-amber-500"
        >
          <h2 className="text-2xl text-black font-bold mb-4">
            {selectedContent.title}
          </h2>
          <p className="text-black mb-6">{selectedContent.text}</p>
          <div className="relative w-full h-96">
            <Image
              src={selectedContent.img_url}
              alt={selectedContent.title}
              fill
              className="object-cover rounded-xl transition duration-300"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}