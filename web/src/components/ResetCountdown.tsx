"use client";

import { useEffect, useState } from "react";
import { formatCountdown, getMsUntilMidnight } from "@/lib/storage";

export function ResetCountdown() {
  const [ms, setMs] = useState(getMsUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => setMs(getMsUntilMidnight()), 1000);
    return () => clearInterval(interval);
  }, []);

  const urgent = ms < 3600000; // under 1 hour

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 ${
        urgent
          ? "bg-red-50 text-red-900 ring-red-200"
          : "bg-amber-50 text-amber-900 ring-amber-200/60"
      }`}
    >
      <span aria-hidden>{urgent ? "⏰" : "🕐"}</span>
      <span>
        Poop resets in{" "}
        <span className="font-bold tabular-nums">{formatCountdown(ms)}</span>
      </span>
    </div>
  );
}
