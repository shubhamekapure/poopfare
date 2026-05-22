export function VsBadge() {
  return (
    <div className="relative flex shrink-0 flex-col items-center justify-center px-1 sm:px-2">
      <div className="animate-vs-pulse flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 shadow-lg shadow-amber-500/30 ring-4 ring-white sm:h-14 sm:w-14">
        <span className="font-display text-sm font-black italic text-white sm:text-base">
          VS
        </span>
      </div>
      <span className="mt-1 hidden text-[9px] font-bold uppercase tracking-widest text-amber-700/70 sm:block">
        Pick one
      </span>
    </div>
  );
}
