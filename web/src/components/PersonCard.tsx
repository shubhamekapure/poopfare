"use client";

import type { Person } from "@/lib/types";
import { PersonAvatar } from "@/components/PersonAvatar";

interface PersonCardProps {
  person: Person;
  score: number;
  onSelect: () => void;
  onInfo?: () => void;
  disabled?: boolean;
  selected?: boolean;
  rejected?: boolean;
  consensus?: number | null;
}

export function PersonCard({
  person,
  score,
  onSelect,
  onInfo,
  disabled,
  selected,
  rejected,
  consensus,
}: PersonCardProps) {
  return (
    <div
      className={`relative flex min-w-0 flex-1 flex-col transition-all duration-300 ease-out ${
        rejected ? "scale-[0.92] opacity-30 blur-[0.5px]" : selected ? "z-10 scale-[1.03]" : ""
      }`}
    >
      {onInfo && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInfo();
          }}
          className="absolute right-1.5 top-1.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-[10px] font-bold text-stone-600 shadow-md ring-1 ring-stone-200 backdrop-blur hover:bg-amber-50 hover:text-amber-900 sm:right-2 sm:top-2 sm:h-8 sm:w-8 sm:text-xs"
          aria-label={`View charges for ${person.name}`}
        >
          i
        </button>
      )}
      <button
        type="button"
        onClick={onSelect}
        disabled={disabled}
        aria-label={`Donate poop to ${person.name}`}
        className={`group relative flex h-full w-full flex-col items-center rounded-2xl border-2 bg-white p-3 shadow-md transition-all duration-300 ease-out focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 disabled:pointer-events-none sm:rounded-3xl sm:p-5 ${
          selected
            ? "border-amber-500 bg-gradient-to-b from-amber-50 to-white shadow-xl shadow-amber-300/40 ring-4 ring-amber-300/50"
            : rejected
              ? "border-stone-200 bg-stone-50"
              : "border-stone-200/80 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-200/30 active:scale-[0.98]"
        }`}
      >
        <PersonAvatar
          person={person}
          size="xl"
          className={
            selected
              ? "ring-4 ring-amber-400 shadow-lg"
              : "ring-2 ring-stone-100 group-hover:ring-amber-200"
          }
        />

        {selected && consensus != null && (
          <p className="mt-2 animate-consensus-pop rounded-full bg-gradient-to-r from-amber-700 to-amber-900 px-3 py-1 text-[10px] font-bold text-white shadow-md sm:mt-3 sm:text-xs">
            {consensus}% agreed with you
          </p>
        )}

        <span className="mt-2 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800 ring-1 ring-amber-200/60 sm:text-xs">
          {person.country}
        </span>
        <h3 className="mt-1.5 text-center text-sm font-bold leading-tight text-stone-900 sm:text-xl">
          {person.name}
        </h3>
        {person.isNominee && (
          <span className="mt-1 rounded-full bg-violet-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-violet-800 ring-1 ring-violet-200">
            Your nominee
          </span>
        )}
        {person.isDailyPick && (
          <span className="mt-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200">
            New today
          </span>
        )}
        <p className="mt-1.5 line-clamp-2 text-center text-[10px] italic leading-snug text-stone-500 sm:text-xs">
          &ldquo;{person.crime}&rdquo;
        </p>
        <p className="mt-2 rounded-full bg-stone-100 px-2.5 py-0.5 text-[10px] font-semibold text-stone-600 sm:text-xs">
          {score.toLocaleString()} 💩 total
        </p>
        {!disabled && (
          <span className="mt-3 inline-block rounded-full bg-gradient-to-r from-amber-700 to-amber-900 px-4 py-2 text-xs font-bold text-white shadow-md sm:mt-4 sm:px-5 sm:py-2.5 sm:text-sm">
            Donate 💩
          </span>
        )}

        {selected && (
          <>
            <span
              className="pointer-events-none absolute left-1/2 top-[30%] -translate-x-1/2 text-4xl animate-poop-throw sm:text-5xl"
              aria-hidden
            >
              💩
            </span>
            <span
              className="pointer-events-none absolute inset-0 rounded-2xl bg-amber-400/25 animate-flash-win sm:rounded-3xl"
              aria-hidden
            />
          </>
        )}
      </button>
    </div>
  );
}
