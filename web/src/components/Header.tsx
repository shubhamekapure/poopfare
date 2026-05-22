"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PoopStack } from "@/components/PoopStack";
import { DAILY_POOP, UNLIMITED_POOP, loadUserState } from "@/lib/storage";

const links = [
  { href: "/", label: "Home" },
  { href: "/play", label: "Play" },
  { href: "/nominate", label: "Nominate" },
  { href: "/leaderboard", label: "Board" },
];

export function Header() {
  const pathname = usePathname();
  const [poopRemaining, setPoopRemaining] = useState<number | null>(null);

  useEffect(() => {
    setPoopRemaining(loadUserState().coinsRemaining);
  }, [pathname]);

  const showPoopStack =
    !UNLIMITED_POOP &&
    poopRemaining !== null &&
    poopRemaining < DAILY_POOP &&
    pathname !== "/summary";
  const onPlay = pathname === "/play";

  return (
    <header className="sticky top-0 z-50 border-b border-amber-200/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="group flex min-w-0 shrink items-center gap-2.5">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-700 text-xl shadow-md shadow-amber-500/25 ring-2 ring-white transition group-hover:scale-105"
            aria-hidden
          >
            💩
          </span>
          <div className="min-w-0">
            <p className="font-display truncate text-lg font-black tracking-tight text-stone-900">
              PoopFare
            </p>
            <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-amber-700 sm:block">
              The world&apos;s first poop charity
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {showPoopStack && (
            <div className="hidden sm:block">
              <PoopStack remaining={poopRemaining} compact />
            </div>
          )}
          {showPoopStack && (
            <span className="rounded-full bg-gradient-to-r from-amber-100 to-amber-50 px-2.5 py-1 text-xs font-bold text-amber-900 ring-1 ring-amber-200 sm:hidden">
              {poopRemaining} 💩
            </span>
          )}
          <nav className="flex gap-1" aria-label="Main">
            {links.map((link) => {
              const active = pathname === link.href;
              const isPlay = link.href === "/play";
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-2.5 py-1.5 text-sm font-semibold transition sm:px-3 ${
                    active
                      ? isPlay
                        ? "bg-gradient-to-r from-amber-700 to-amber-900 text-white shadow-md"
                        : "bg-amber-800 text-amber-50"
                      : isPlay && !onPlay
                        ? "bg-amber-100 text-amber-900 ring-1 ring-amber-300 hover:bg-amber-200"
                        : "text-stone-600 hover:bg-amber-50 hover:text-amber-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
