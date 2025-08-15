"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EXAMPLES = {
  recommended: {
    title: "Recommended",
    textContext: "This would be like dolls at zara of a recommended set of clothes by us.",
    img: "/recommended.jpg",
  },
  trending: {
    title: "Trending",
    textContext: "this will be new fashions.  .",
    img: "/Trending.jpg",
  },
  popular: {
    title: "Popular",
    textContext: "this will be by the most selling one..",
    img: "/popular.jpg",
  },
};

export default function ThreeButtonsInRow() {
  // Start with "recommended" selected by default
  const [selectedButton, setSelectedButton] = useState<keyof typeof EXAMPLES>("recommended");
  const [firstSelected, setFirstSelected] = useState(true);

  const handleButtonClick = (button: keyof typeof EXAMPLES) => {
    setSelectedButton(button);
  };

  // Always get content since we now always have a selection
  const selectedContent = EXAMPLES[selectedButton];

  return (
    <section className="flex flex-col items-center py-12 px-4 space-y-12">
      {/* Button Row */}
      <div className="flex flex-wrap justify-center gap-6 sm:gap-10 h-auto rounded-[35px] px-4 py-3 bg-[#F7F7F7]">
        {Object.keys(EXAMPLES).map((key) => (
          <button
            key={key}
            onClick={() => handleButtonClick(key as keyof typeof EXAMPLES)}
            className={`text-gray-500 font-normal text-lg px-6 py-3 rounded-[40px] transition duration-200 ${
              selectedButton === key
                ? "bg-[#dd8d14] text-white font-semibold"
                : "hover:bg-[#dce3e9]"
            }`}
          >
            {EXAMPLES[key as keyof typeof EXAMPLES].title}
          </button>
        ))}
      </div>

      {/* Animated Content - Now always visible */}
      {firstSelected && (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedButton}
            layout
            initial={{ width: 110, opacity: 0 }}
            animate={{ width: "70vw", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden rounded-xl bg-gray-100 shadow-lg p-6 flex flex-col items-center shadow-amber-500"
          >
            <h2 className="text-2xl text-black font-bold mb-4">{selectedContent.title}</h2>
            <p className="text-black mb-6">{selectedContent.textContext}</p>
            <img
              src={selectedContent.img}
              alt={selectedContent.title}
              className="w-full h-96 object-cover rounded-xl transition duration-300"
            />
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}