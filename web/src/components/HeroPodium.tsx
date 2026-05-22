"use client";

import { PersonAvatar } from "@/components/PersonAvatar";
import type { Person } from "@/lib/types";

interface HeroPodiumProps {
  topThree: Person[];
  onSelect: (person: Person) => void;
}

const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd for visual layout
const heights = ["h-28", "h-36", "h-24"];
const medals = ["🥈", "🥇", "🥉"];
const labels = ["2nd", "1st", "3rd"];

export function HeroPodium({ topThree, onSelect }: HeroPodiumProps) {
  if (topThree.length < 3) return null;

  return (
    <div className="mt-8 flex items-end justify-center gap-3 sm:gap-5">
      {podiumOrder.map((rankIdx, displayIdx) => {
        const person = topThree[rankIdx];
        const isWinner = rankIdx === 0;

        return (
          <button
            key={person.id}
            type="button"
            onClick={() => onSelect(person)}
            className={`group flex w-[30%] max-w-[140px] flex-col items-center transition-transform hover:-translate-y-1 ${
              isWinner ? "z-10 sm:max-w-[160px]" : ""
            }`}
          >
            <div
              className={`relative mb-2 transition-transform group-hover:scale-105 ${
                isWinner ? "animate-float-slow" : ""
              }`}
            >
              {isWinner && (
                <span
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl"
                  aria-hidden
                >
                  👑
                </span>
              )}
              <PersonAvatar
                person={person}
                size={isWinner ? "xl" : "lg"}
                className={
                  isWinner
                    ? "ring-4 ring-amber-400 shadow-xl shadow-amber-300/40"
                    : "ring-2 ring-amber-200"
                }
              />
            </div>

            <p className="line-clamp-1 w-full text-center text-xs font-bold text-stone-900 sm:text-sm">
              {person.name}
            </p>
            <p className="text-[10px] text-amber-700 sm:text-xs">
              {person.totalPoopScore.toLocaleString()} 💩
            </p>

            <div
              className={`mt-2 flex w-full flex-col items-center justify-end rounded-t-xl bg-gradient-to-t from-amber-800 to-amber-600 px-2 pb-2 pt-3 text-white shadow-md ${heights[displayIdx]}`}
            >
              <span className="text-lg">{medals[displayIdx]}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                {labels[displayIdx]}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
