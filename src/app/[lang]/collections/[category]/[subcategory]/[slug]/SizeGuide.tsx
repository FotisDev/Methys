"use client";

import { useState } from "react";
import Image from "next/image";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productImages?: string[];
}

export default function SizeGuideModal({
  isOpen,
  onClose,
  productName,
  productImages = [],
}: SizeGuideModalProps) {
  const [unit, setUnit] = useState<"cm" | "inch">("cm");

  if (!isOpen) return null;

  const sizeData = {
    cm: [
      { size: "XS", chest: "89-93" },
      { size: "S", chest: "93-97" },
      { size: "M", chest: "97-101" },
      { size: "L", chest: "101-105" },
      { size: "XL", chest: "105-109" },
      { size: "XXL", chest: "109-113" },
    ],
    inch: [
      { size: "XS", chest: "35-37" },
      { size: "S", chest: "37-38" },
      { size: "M", chest: "38-40" },
      { size: "L", chest: "40-41" },
      { size: "XL", chest: "41-43" },
      { size: "XXL", chest: "43-44" },
    ],
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-4 right-4 top-24 bottom-4 z-50 flex items-start justify-center">
        <div
          className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-xl font-light">Size guide</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Name */}
            <h3 className="text-lg font-normal">{productName}</h3>

            {/* Product Images */}
            {productImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.slice(0, 6).map((image, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden"
                  >
                    <Image
                      src={image}
                      alt={`${productName} view ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Fit Information */}
            <div className="space-y-2 text-sm">
              <p>- Loose fit</p>
              <p>- The model is 185 cm and wears a size M</p>
              <p>
                - This style has a loose fit and will sit more relaxed on your
                body.
              </p>
            </div>

            {/* Measurement Unit Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Measurement unit</span>
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <button
                  onClick={() => setUnit("cm")}
                  className={`px-4 py-1.5 text-sm transition ${
                    unit === "cm"
                      ? "bg-vintage-green text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  cm
                </button>
                <button
                  onClick={() => setUnit("inch")}
                  className={`px-4 py-1.5 text-sm transition ${
                    unit === "inch"
                      ? "bg-vintage-green text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  inch
                </button>
              </div>
            </div>

            {/* Size Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="text-left py-3 px-4 text-sm font-medium">
                      Size
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium">
                      A: Chest
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData[unit].map((row, index) => (
                    <tr
                      key={row.size}
                      className={
                        index !== sizeData[unit].length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }
                    >
                      <td className="py-3 px-4 text-sm">{row.size}</td>
                      <td className="py-3 px-4 text-sm">{row.chest}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* How to Measure */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">How to measure</h3>
              <p className="text-sm">
                A: Measure the circumference around your chest
              </p>

              {/* Measurement Diagram */}
              <div className="flex justify-center py-6">
                <div className="relative w-48 h-64">
                  {/* Body outline */}
                  <svg
                    viewBox="0 0 200 300"
                    className="w-full h-full text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    {/* Head */}
                    <circle cx="100" cy="30" r="20" />

                    {/* Neck */}
                    <line x1="100" y1="50" x2="100" y2="70" />

                    {/* Shoulders */}
                    <line x1="60" y1="80" x2="140" y2="80" />

                    {/* Torso */}
                    <line x1="60" y1="80" x2="70" y2="180" />
                    <line x1="140" y1="80" x2="130" y2="180" />
                    <line x1="100" y1="70" x2="100" y2="180" />

                    {/* Arms */}
                    <line x1="60" y1="80" x2="40" y2="160" />
                    <line x1="140" y1="80" x2="160" y2="160" />

                    {/* Legs */}
                    <line x1="85" y1="180" x2="80" y2="280" />
                    <line x1="115" y1="180" x2="120" y2="280" />

                    {/* Chest measurement line */}
                    <line
                      x1="60"
                      y1="110"
                      x2="140"
                      y2="110"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-vintage-green"
                    />

                    {/* Measurement points A */}
                    <circle
                      cx="60"
                      cy="110"
                      r="4"
                      fill="white"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-vintage-green"
                    />
                    <circle
                      cx="140"
                      cy="110"
                      r="4"
                      fill="white"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-vintage-green"
                    />

                    {/* Labels */}
                    <text
                      x="50"
                      y="115"
                      fontSize="12"
                      className="fill-vintage-green font-medium"
                    >
                      A
                    </text>
                    <text
                      x="145"
                      y="115"
                      fontSize="12"
                      className="fill-vintage-green font-medium"
                    >
                      A
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
