export function CharityStamp({ className = "" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-dashed border-amber-400/60 bg-amber-50/80 px-3 py-1.5 ${className}`}
    >
      <span className="text-sm" aria-hidden>
        ✦
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-800">
        Est. 2026 · Satirical 501(c)(3)
      </span>
      <span className="text-sm" aria-hidden>
        ✦
      </span>
    </div>
  );
}
