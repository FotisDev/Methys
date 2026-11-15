"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { countdownParts } from "@/_lib/utils/content";
import { useT } from "@/i18n/client";
import { cn } from "@/_lib/utils/cn";

// Ticks down to the launch, then refreshes the page so the products appear.
export default function Countdown({
  target,
  className,
}: {
  target: string;
  className?: string;
}) {
  const t = useT();
  const router = useRouter();
  const targetMs = new Date(target).getTime();
  // null until mounted: the server and browser clocks differ, so rendering a
  // number on the server would cause a hydration mismatch.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= targetMs) {
        clearInterval(timer);
        // The drop data is cached for a minute; give it a moment.
        setTimeout(() => router.refresh(), 2000);
      }
    };
    const first = setTimeout(tick, 0);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [targetMs, router]);

  const parts = countdownParts(now === null ? 0 : targetMs - now);
  const units = [
    { value: parts.days, label: t("drops.days") },
    { value: parts.hours, label: t("drops.hours") },
    { value: parts.minutes, label: t("drops.minutes") },
    { value: parts.seconds, label: t("drops.seconds") },
  ];

  return (
    <div
      role="timer"
      aria-live="off"
      className={cn("flex gap-3 sm:gap-5", className)}
    >
      {units.map(({ value, label }) => (
        <div key={label} className={cn("text-center min-w-[3.5rem]")}>
          <div className={cn("text-3xl sm:text-5xl font-light tabular-nums")}>
            {now === null ? "--" : String(value).padStart(2, "0")}
          </div>
          <div className={cn("text-[10px] uppercase tracking-widest mt-1")}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
