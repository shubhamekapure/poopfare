"use client";

const FLOATERS = [
  { emoji: "💩", left: "8%", top: "12%", size: "text-2xl", delay: "0s", duration: "18s" },
  { emoji: "💩", left: "88%", top: "18%", size: "text-xl", delay: "2s", duration: "22s" },
  { emoji: "💩", left: "72%", top: "65%", size: "text-lg", delay: "4s", duration: "20s" },
  { emoji: "💩", left: "15%", top: "72%", size: "text-xl", delay: "1s", duration: "24s" },
  { emoji: "🏆", left: "92%", top: "45%", size: "text-lg", delay: "3s", duration: "19s" },
  { emoji: "⚖️", left: "5%", top: "42%", size: "text-base", delay: "5s", duration: "21s" },
];

export function PoopBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden
    >
      {FLOATERS.map((f, i) => (
        <span
          key={i}
          className={`absolute ${f.size} select-none opacity-[0.07]`}
          style={{
            left: f.left,
            top: f.top,
            animation: `drift ${f.duration} ease-in-out ${f.delay} infinite alternate`,
          }}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
