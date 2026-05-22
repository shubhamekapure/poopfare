"use client";

import { UNLIMITED_POOP } from "@/lib/storage";

interface SessionProgressProps {
  allocatedCount: number;
}

export function SessionProgress({ allocatedCount }: SessionProgressProps) {
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-amber-800/80">
        <span>This session</span>
        <span className="tabular-nums">
          {allocatedCount} {allocatedCount === 1 ? "poop" : "poops"} sent
          {UNLIMITED_POOP && (
            <span className="ml-1.5 normal-case text-amber-600">· unlimited</span>
          )}
        </span>
      </div>
      {UNLIMITED_POOP ? (
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {allocatedCount === 0 ? (
            <span className="text-xs text-stone-400">Pick someone to start.</span>
          ) : (
            <>
              {Array.from({ length: Math.min(allocatedCount, 24) }).map((_, i) => (
                <span
                  key={i}
                  className="poop-chip flex h-7 w-7 shrink-0 items-center justify-center text-sm"
                >
                  💩
                </span>
              ))}
              {allocatedCount > 24 && (
                <span className="text-xs font-bold text-amber-800">
                  +{allocatedCount - 24} more
                </span>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="h-2 overflow-hidden rounded-full bg-amber-100/80 ring-1 ring-amber-200/50">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-800 transition-all duration-500 ease-out"
            style={{ width: allocatedCount === 0 ? "0%" : "100%" }}
          />
        </div>
      )}
    </div>
  );
}
