import { CharityStamp } from "@/components/CharityStamp";
import { NominateForm } from "@/components/NominateForm";

export const metadata = {
  title: "Nominate — PoopFare",
  description:
    "Someone missing from the roster? Nominate a public figure for your personal PoopFare matchup pool.",
};

export default function NominatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <div className="text-center">
        <CharityStamp className="mx-auto" />
        <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.15em] text-amber-700">
          Community intake
        </p>
        <h1 className="font-display mt-2 text-3xl font-black text-stone-900 sm:text-4xl">
          Nominate a villain
        </h1>
        <p className="mx-auto mt-3 max-w-md text-stone-600">
          PoopFare can&apos;t list everyone who deserves it. You tell us who we
          forgot — Jared&apos;s interns will pretend to review it while your
          nominee goes straight into play.
        </p>
      </div>

      <div className="mt-10">
        <NominateForm />
      </div>

      <p className="mt-10 text-center text-xs text-stone-400">
        Satire only. Nominate real public figures. No private individuals.{" "}
        <a href="/legal" className="underline hover:text-amber-800">
          Legal Poop
        </a>
      </p>
    </div>
  );
}
