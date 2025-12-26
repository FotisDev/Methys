"use client";

import { useState } from "react";
import Link from "next/link";

interface FoldableItem {
  name: string;
  href: string;
}

interface FoldableSectionProps {
  title: string;
  items: FoldableItem[];
  defaultOpen?: boolean;
}

export default function FoldableSectionComponent({
  title,
  items,
  defaultOpen = false,
}: FoldableSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-2 text-center lg:text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-bold flex items-center justify-center lg:justify-start gap-2 w-full lg:cursor-default"
      >
        <span>{title}</span>
        <span className="lg:hidden text-xl">{isOpen ? "−" : "+"}</span>
      </button>

      <div
        className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } lg:max-h-none lg:opacity-100`}
      >
        {items.map((item: FoldableItem, index: number) => (
          <Link
            key={index}
            href={item.href}
            className="hover:text-vintage-green transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
