"use client";

import { useState } from "react";
import { CharityStamp } from "@/components/CharityStamp";
import { PoopButton } from "@/components/PoopButton";

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    emoji: "💩",
    title: "Unlimited poop.",
    body: "PoopFare entrusts you with a bottomless allowance of virtual justice. Spend freely. Hoarding is discouraged. Abstaining is forbidden.",
    accent: "from-amber-400 to-amber-600",
  },
  {
    emoji: "⚖️",
    title: "Pick who deserves it more.",
    body: "Each session presents two public figures. You must choose one. No abstaining. No skipping. The universe demands a verdict.",
    accent: "from-amber-500 to-amber-700",
  },
  {
    emoji: "🏆",
    title: "The crowd decides the worst.",
    body: "Your allocation joins a global tally. Together, we poop. Check the World's Richest in Poop leaderboard anytime.",
    accent: "from-amber-600 to-amber-900",
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const slide = slides[step];
  const isLast = step === slides.length - 1;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-stone-900/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <div
          className={`bg-gradient-to-br ${slide.accent} px-8 py-10 text-center text-white transition-all duration-500`}
        >
          <p className="text-6xl drop-shadow-md" aria-hidden>
            {slide.emoji}
          </p>
          <CharityStamp className="mx-auto mt-4 border-amber-300/40 bg-white/10 text-amber-100 [&_span]:text-amber-100" />
        </div>

        <div className="p-8">
          <h2 className="font-display text-2xl font-black text-stone-900">
            {slide.title}
          </h2>
          <p className="mt-3 leading-relaxed text-stone-600">{slide.body}</p>

          <div className="mt-6 flex justify-center gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? "w-6 bg-amber-700" : "w-2 bg-stone-200"
                }`}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <PoopButton
              size="md"
              className="w-full"
              onClick={() => (isLast ? onComplete() : setStep((s) => s + 1))}
            >
              {isLast ? "Make your poop count →" : "Continue"}
            </PoopButton>
            {step >= 1 && (
              <button
                type="button"
                onClick={onComplete}
                className="text-sm font-medium text-stone-400 hover:text-stone-600"
              >
                Skip intro
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
