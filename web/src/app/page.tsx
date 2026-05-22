"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CharityStamp } from "@/components/CharityStamp";
import { PoopStack } from "@/components/PoopStack";
import { HeroPodium } from "@/components/HeroPodium";
import { Onboarding } from "@/components/Onboarding";
import { PersonModal } from "@/components/PersonModal";
import { PoopButton } from "@/components/PoopButton";
import { DailyVillainsSection } from "@/components/DailyVillainsSection";
import { getAllPersons } from "@/lib/person-pool";
import { refreshDailyPersons, isDailyBatchStale } from "@/lib/daily-villains";
import {
  getPersonsWithScores,
  loadUserState,
  saveUserState,
} from "@/lib/storage";
import { useLiveScores } from "@/lib/use-live-scores";
import type { Person } from "@/lib/types";

const TICKER_LINES = [
  "Justice, one poop at a time.",
  "Fresh poopanthropists added daily. Zero mercy.",
  "Unlimited poop. Infinite outrage.",
  "The crowd decides who stinks most.",
];

export default function HomePage() {
  const liveScores = useLiveScores("all", 5000);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [topThree, setTopThree] = useState<Person[]>([]);
  const [selected, setSelected] = useState<Person | null>(null);
  const [contributions, setContributions] = useState<Record<string, number>>({});
  const [allRanked, setAllRanked] = useState<Person[]>([]);
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const refresh = async () => {
      if (isDailyBatchStale()) {
        await refreshDailyPersons();
      }
      const state = loadUserState();
      setContributions(state.personalContributions);
    };

    if (!loadUserState().onboardingComplete) setShowOnboarding(true);
    refresh();
    window.addEventListener("poopfare-daily-villains-updated", refresh);
    return () => {
      window.removeEventListener("poopfare-nominations-updated", refresh);
      window.removeEventListener("poopfare-daily-villains-updated", refresh);
    };
  }, []);

  useEffect(() => {
    const ranked = getPersonsWithScores(getAllPersons(), liveScores)
      .filter((p) => p.totalPoopScore > 0)
      .sort((a, b) => b.totalPoopScore - a.totalPoopScore);
    setAllRanked(ranked);
    setTopThree(ranked.slice(0, 3));
  }, [liveScores]);

  useEffect(() => {
    const interval = setInterval(
      () => setTickerIdx((i) => (i + 1) % TICKER_LINES.length),
      4000,
    );
    return () => clearInterval(interval);
  }, []);

  const completeOnboarding = () => {
    const state = loadUserState();
    saveUserState({ ...state, onboardingComplete: true });
    setShowOnboarding(false);
  };

  return (
    <>
      {showOnboarding && <Onboarding onComplete={completeOnboarding} />}

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        {/* Hero */}
        <section className="relative text-center">
          <div className="animate-fade-in-up">
            <CharityStamp className="mx-auto" />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-amber-700 animate-fade-in-up stagger-1">
            Because someone has to take the blame
          </p>

          <h1 className="font-display mt-4 text-4xl font-black leading-[1.1] tracking-tight sm:text-6xl animate-fade-in-up stagger-2">
            <span className="text-gradient-poop">Make your poop</span>
            <br />
            <span className="text-stone-900">count.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-stone-600 animate-fade-in-up stagger-3">
            Change starts with a single 💩. Allocate as much as you want. Pick
            who deserves it most. The crowd builds the ranking.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up stagger-4">
            <span className="poop-chip px-3 py-1.5">Fresh daily</span>
            <span className="poop-chip px-3 py-1.5">Unlimited 💩</span>
            <span className="poop-chip px-3 py-1.5">Global roster</span>
          </div>
        </section>

        {/* CTA card */}
        <section className="poop-card poop-card-glow relative mt-10 overflow-hidden rounded-3xl p-8 sm:p-10">
          <div
            className="pointer-events-none absolute -right-8 -top-8 text-[120px] opacity-[0.04] select-none"
            aria-hidden
          >
            💩
          </div>

          <div className="relative flex flex-col items-center gap-6">
            <PoopStack remaining={10} />

            <p
              key={tickerIdx}
              className="min-h-[1.5rem] text-sm font-medium italic text-amber-800/80 animate-fade-in-up"
            >
              &ldquo;{TICKER_LINES[tickerIdx]}&rdquo;
            </p>

            <PoopButton href="/play" size="lg">
              Start Pooping →
            </PoopButton>
          </div>
        </section>

        {/* Podium */}
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-black text-stone-900 sm:text-3xl">
                World&apos;s Richest in Poop
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Live global rankings — tap a face to see their charges
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="shrink-0 text-sm font-bold text-amber-800 underline decoration-amber-300 underline-offset-4 hover:text-amber-950"
            >
              Full board →
            </Link>
          </div>

          <HeroPodium topThree={topThree} onSelect={setSelected} />
        </section>

        <DailyVillainsSection />

        {/* Manifesto strip */}
        <section className="mt-14 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-900 to-amber-800 px-6 py-8 text-center text-amber-50 sm:px-10">
          <p className="font-display text-lg font-semibold italic sm:text-xl">
            &ldquo;We don&apos;t judge. We allocate.&rdquo;
          </p>
          <p className="mt-2 text-sm text-amber-200/80">
            — Jared, Founder & Chief Poop Officer
          </p>
          <Link
            href="/nominate"
            className="mt-5 inline-block rounded-full border border-amber-400/50 bg-white/10 px-5 py-2 text-sm font-bold text-amber-50 transition hover:bg-white/20"
          >
            Someone missing? Nominate them →
          </Link>
        </section>
      </div>

      {selected && (
        <PersonModal
          person={selected}
          rank={allRanked.findIndex((p) => p.id === selected.id) + 1}
          userContribution={contributions[selected.id] ?? 0}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
