import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-amber-200/50 bg-gradient-to-b from-amber-50/60 to-amber-100/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-base font-bold text-stone-800">
            PoopFare
          </p>
          <p className="mt-0.5 text-sm text-stone-600">
            Because the world&apos;s worst deserve your worst.
          </p>
        </div>
        <p className="text-xs text-stone-500">
          Purely satirical. No real poop is harmed.{" "}
          <Link
            href="/legal"
            className="font-semibold text-amber-800 underline decoration-amber-300 underline-offset-2 hover:text-amber-950"
          >
            Legal Poop
          </Link>
        </p>
      </div>
    </footer>
  );
}
