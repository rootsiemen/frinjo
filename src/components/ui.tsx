// Inline SVG icons (no external dependencies).
export function Icon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    cart: (
      <path d="M3 3h2l2.4 12.4A2 2 0 0 0 9.4 17H18a2 2 0 0 0 2-1.6L21.6 8H6" strokeLinecap="round" strokeLinejoin="round" />
    ),
    globe: (
      <g>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9S14.5 18.4 12 21c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3z" />
      </g>
    ),
    dashboard: (
      <g>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </g>
    ),
    card: (
      <g>
        <rect x="2" y="5" width="20" height="14" rx="2.5" />
        <path d="M2 10h20" strokeLinecap="round" />
      </g>
    ),
    chat: (
      <path d="M21 12a8 8 0 0 1-8 8H4l2-3a8 8 0 1 1 15-5z" strokeLinejoin="round" />
    ),
    search: (
      <g>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </g>
    ),
    check: (
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    ),
    star: (
      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" strokeLinejoin="round" />
    ),
    arrow: (
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    ),
    quote: (
      <path d="M10 8c-3 1-5 3.5-5 7v1h5v-6H7.5C8 9 9 8.5 10 8.2V8zm9 0c-3 1-5 3.5-5 7v1h5v-6h-2.5c.5-1 1.5-1.5 2.5-1.8V8z" strokeLinejoin="round" />
    ),
    rocket: (
      <g>
        <path d="M12 15c5-4 8-9 8-14-5 0-10 3-14 8l-3 1 4 4-4 1 3 4 4-1 2-3z" strokeLinejoin="round" />
        <circle cx="14" cy="10" r="1.6" />
      </g>
    ),
    shield: (
      <path d="M12 2l8 3v6c0 5-3.5 9.3-8 11-4.5-1.7-8-6-8-11V5l8-3z" strokeLinejoin="round" />
    ),
    bolt: (
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" strokeLinejoin="round" />
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      {paths[name] ?? paths.globe}
    </svg>
  );
}

/** Section heading block used across public pages. */
export function SectionHead({
  eyebrow, title, sub, center = true,
}: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`${center ? "text-center mx-auto" : ""} max-w-2xl mb-12`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3 text-emerald-700">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display text-3xl sm:text-4xl font-bold text-stone-900">{title}</h2>
      {sub && <p className="mt-4 text-stone-600">{sub}</p>}
    </div>
  );
}

/** Gold star rating row. */
export function Stars({ rating, className = "w-4 h-4" }: { rating: number; className?: string }) {
  return (
    <div className="flex gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rating ? "" : "opacity-25"}>
          <Icon name="star" className={className} />
        </span>
      ))}
    </div>
  );
}

/** CTA button styles shared across pages. */
export const btnPrimary =
  "inline-flex items-center gap-2 rounded-full bg-amber-400 text-emerald-950 font-bold px-7 py-3.5 hover:bg-amber-300 transition shadow-lg shadow-amber-400/20";
export const btnOutline =
  "inline-flex items-center gap-2 rounded-full border-2 border-emerald-700 text-emerald-800 font-semibold px-7 py-3 hover:border-emerald-800 hover:bg-emerald-50 transition";
export const btnDark =
  "inline-flex items-center gap-2 rounded-full bg-emerald-950 text-white font-bold px-7 py-3.5 hover:bg-emerald-900 transition";
