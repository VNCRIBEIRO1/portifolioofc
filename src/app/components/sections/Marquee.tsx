export function Marquee() {
  return (
    <div className="border-t border-b border-[var(--border)] py-3 overflow-hidden space-y-2 bg-[var(--bg)]">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="flex items-center">
            {["Web Design", "Frontend", "UI/UX", "Next.js", "React", "SEO", "Responsive", "Tailwind CSS"].map((t, j) => (
              <span key={j} className="flex items-center">
                <span className="text-sm font-medium text-[var(--muted)] mx-8">{t}</span>
                <span className="glow-dot" />
              </span>
            ))}
          </span>
        ))}
      </div>
      <div className="animate-marquee-reverse flex whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="flex items-center">
            {["Performance", "TypeScript", "Figma", "Vercel", "Node.js", "Git", "Acessibilidade", "LGPD"].map((t, j) => (
              <span key={j} className="flex items-center">
                <span className="text-xs text-[var(--border-strong)] mx-8 uppercase tracking-widest">{t}</span>
                <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
