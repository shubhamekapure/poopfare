"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PersonAvatar } from "@/components/PersonAvatar";
import { PoopButton } from "@/components/PoopButton";
import { COUNTRIES } from "@/lib/matchups";
import {
  loadNominations,
  MAX_NOMINATIONS,
  removeNomination,
  submitNomination,
} from "@/lib/nominations";
import type { Category, Gender, NominationInput, Person } from "@/lib/types";

const CATEGORIES: Category[] = [
  "Politician",
  "Corporate",
  "Celebrity",
  "Historical",
];

const GENDERS: Gender[] = ["Male", "Female", "Other"];

const emptyForm: NominationInput = {
  name: "",
  country: "USA",
  category: "Politician",
  gender: "Male",
  crime: "",
  wiki: "",
};

export function NominateForm() {
  const [form, setForm] = useState<NominationInput>(emptyForm);
  const [nominees, setNominees] = useState<Person[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<Person | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = () => setNominees(loadNominations());

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("poopfare-nominations-updated", handler);
    return () => window.removeEventListener("poopfare-nominations-updated", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const result = await submitNomination(form);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.person) {
      setSuccess(result.person);
      setForm(emptyForm);
      refresh();
    }
  };

  const handleRemove = (id: string) => {
    if (
      !window.confirm(
        "Remove this nomination? They'll leave your matchup pool and leaderboard.",
      )
    ) {
      return;
    }
    removeNomination(id);
    refresh();
    if (success?.id === id) setSuccess(null);
  };

  const fieldClass =
    "w-full rounded-xl border border-amber-200/70 bg-white px-4 py-3 text-stone-900 shadow-sm ring-1 ring-amber-100/50 transition focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300/60";

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="poop-card rounded-3xl p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
            Nomination form
          </p>
          <h2 className="font-display mt-1 text-2xl font-black text-stone-900">
            Who&apos;s missing from the roster?
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Tell us who deserves a spot. Your nominee joins{" "}
            <strong>your</strong> matchup pool instantly — and climbs the
            leaderboard as you (and others) allocate poop.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-stone-700">
              Full name *
            </span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Martin Shkreli"
              className={fieldClass}
              maxLength={80}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">
                Country *
              </span>
              <select
                required
                value={form.country}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value }))
                }
                className={fieldClass}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold text-stone-700">
                Category *
              </span>
              <select
                required
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as Category,
                  }))
                }
                className={fieldClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-stone-700">
              Gender *
            </span>
            <select
              required
              value={form.gender}
              onChange={(e) =>
                setForm((f) => ({ ...f, gender: e.target.value as Gender }))
              }
              className={fieldClass}
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-stone-700">
              What did they do? *
            </span>
            <textarea
              required
              value={form.crime}
              onChange={(e) => setForm((f) => ({ ...f, crime: e.target.value }))}
              placeholder="One punchy line — satire, not a legal brief."
              className={`${fieldClass} min-h-[88px] resize-y`}
              maxLength={200}
            />
            <span className="mt-1 block text-xs text-stone-400">
              This becomes their headline charge in matchups.
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-stone-700">
              Wikipedia page{" "}
              <span className="font-normal text-stone-400">(optional)</span>
            </span>
            <input
              type="text"
              value={form.wiki ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, wiki: e.target.value }))}
              placeholder="Exact Wikipedia title for their photo"
              className={fieldClass}
              maxLength={120}
            />
          </label>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 ring-1 ring-red-200">
            {error}
          </p>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-4 rounded-xl bg-emerald-50 px-4 py-4 ring-1 ring-emerald-200 animate-fade-in-up">
            <PersonAvatar person={success} size="md" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-emerald-900">
                {success.name} is in the pool!
              </p>
              <p className="text-sm text-emerald-700">
                {success.photoUrl
                  ? "Photo found. Ready for matchups."
                  : "No photo yet — they'll still appear. Add a Wikipedia title next time."}
              </p>
            </div>
            <Link
              href="/play"
              className="shrink-0 text-sm font-bold text-emerald-800 underline"
            >
              Play →
            </Link>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PoopButton
            type="submit"
            disabled={submitting}
            className={submitting ? "opacity-70" : ""}
          >
            {submitting ? "Vetting nominee…" : "Submit nomination 💩"}
          </PoopButton>
          <p className="text-xs text-stone-500">
            {nominees.length}/{MAX_NOMINATIONS} nominations used on this device
          </p>
        </div>
      </form>

      {nominees.length > 0 && (
        <section>
          <h3 className="font-display text-xl font-black text-stone-900">
            Your nominees
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Stored on this device. They appear in your matchups and leaderboard.
          </p>
          <ul className="mt-4 space-y-2">
            {nominees.map((person) => (
              <li
                key={person.id}
                className="flex items-center gap-4 rounded-2xl border border-amber-200/60 bg-white px-4 py-3 shadow-sm"
              >
                <PersonAvatar person={person} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-stone-900">
                    {person.name}
                  </p>
                  <p className="truncate text-xs text-stone-500">
                    {person.country} · {person.crime}
                  </p>
                </div>
                <span className="poop-chip shrink-0 px-2 py-1 text-[10px]">
                  Nominee
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(person.id)}
                  className="shrink-0 text-xs font-semibold text-stone-400 hover:text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
