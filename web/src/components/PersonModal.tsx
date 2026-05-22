"use client";

import type { Person } from "@/lib/types";
import { PersonAvatar } from "@/components/PersonAvatar";

interface PersonModalProps {
  person: Person;
  rank: number;
  userContribution: number;
  onClose: () => void;
}

export function PersonModal({
  person,
  rank,
  userContribution,
  onClose,
}: PersonModalProps) {
  const shareText = `${person.name} is ranked #${rank} in the World's Richest in Poop. poopfare.com`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="person-modal-title"
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <PersonAvatar person={person} size="sm" className="h-16 w-16" />
            <div>
              <h2 id="person-modal-title" className="text-xl font-bold text-stone-900">
                {person.name}
              </h2>
              <p className="text-sm text-amber-800">
                {rank > 0 ? `Rank #${rank}` : "Profile"} · {person.category} ·{" "}
                {person.country}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <p className="mt-4 text-2xl font-bold text-stone-800">
          {person.totalPoopScore.toLocaleString()} 💩
        </p>

        <div className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Charges
          </h3>
          <ul className="mt-2 space-y-2">
            {person.charges.map((charge) => (
              <li
                key={charge}
                className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-stone-700"
              >
                {charge}
              </li>
            ))}
          </ul>
        </div>

        {userContribution > 0 && (
          <p className="mt-4 text-sm text-amber-800">
            Your poop contribution: <strong>{userContribution} 💩</strong>
          </p>
        )}

        <button
          type="button"
          className="mt-6 w-full rounded-full bg-stone-900 py-3 text-sm font-semibold text-white hover:bg-stone-800"
          onClick={() => navigator.clipboard.writeText(shareText)}
        >
          Copy share text
        </button>
      </div>
    </div>
  );
}
