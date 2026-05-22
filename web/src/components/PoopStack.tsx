"use client";

import { DAILY_POOP, UNLIMITED_POOP } from "@/lib/storage";

interface PoopStackProps {
  remaining: number;
  compact?: boolean;
  /** Poops sent this session — shown when unlimited */
  sessionAllocated?: number;
}

export function PoopStack({
  remaining,
  compact,
  sessionAllocated = 0,
}: PoopStackProps) {
  const spent = UNLIMITED_POOP ? 0 : DAILY_POOP - remaining;

  if (UNLIMITED_POOP && compact) {
    return (
      <div
        className="flex flex-col items-end gap-0.5"
        aria-label={`${sessionAllocated} poops sent this session, unlimited`}
      >
        <span className="rounded-full bg-gradient-to-r from-amber-100 to-amber-50 px-2.5 py-1 text-xs font-bold tabular-nums text-amber-900 ring-1 ring-amber-200">
          {sessionAllocated} sent · ∞
        </span>
      </div>
    );
  }

  if (UNLIMITED_POOP && !compact) {
    return (
      <div
        className="flex flex-col items-center gap-3"
        aria-label="Unlimited poop"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-800/90">
          Your Allowance
        </p>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-2xl shadow-lg shadow-amber-500/30 ring-4 ring-white">
          ∞
        </div>
        {sessionAllocated > 0 && (
          <p className="text-sm text-stone-600">
            <span className="font-display text-lg font-bold text-amber-900">
              {sessionAllocated}
            </span>{" "}
            sent this session
          </p>
        )}
        <p className="text-sm text-stone-600">
          <span className="font-display text-lg font-bold text-amber-900">
            Unlimited
          </span>{" "}
          poop
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center ${compact ? "gap-1" : "gap-3"}`}
      aria-label={`${remaining} of ${DAILY_POOP} poop remaining`}
    >
      {!compact && (
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-800/90">
          Daily Allowance
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-1.5">
        {Array.from({ length: DAILY_POOP }).map((_, i) => {
          const isSpent = i < spent;
          const isNext = i === spent && remaining > 0;
          return (
            <div
              key={i}
              className={`poop-chip flex h-9 w-9 items-center justify-center text-base sm:h-10 sm:w-10 sm:text-lg ${
                isSpent ? "poop-chip-spent" : ""
              } ${!isSpent ? "animate-[wobble_2.5s_ease-in-out_infinite]" : ""} ${
                isNext ? "ring-2 ring-amber-300 ring-offset-1" : ""
              }`}
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {!isSpent && "💩"}
            </div>
          );
        })}
      </div>
      {!compact && (
        <p className="text-sm text-stone-600">
          <span className="font-display text-lg font-bold text-amber-900">
            {remaining}
          </span>{" "}
          left today
        </p>
      )}
    </div>
  );
}
