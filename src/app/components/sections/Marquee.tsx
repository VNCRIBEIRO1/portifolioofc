export function Marquee() {
  return (
    <div className="border-t border-b border-white/10 py-4 overflow-hidden space-y-2 bg-black">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="flex items-center">
            {["sites que vendem", "landing de conversão", "automação", "CRM sob medida", "chatbot com IA", "identidade visual", "SEO técnico", "performance"].map((t, j) => (
              <span key={j} className="flex items-center">
                <span className="text-sm font-medium text-white/55 mx-8 uppercase tracking-[0.2em]">{t}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              </span>
            ))}
          </span>
        ))}
      </div>
      <div className="animate-marquee-reverse flex whitespace-nowrap">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="flex items-center">
            {["Next.js", "TypeScript", "Figma", "Vercel", "GSAP", "Lottie", "Lenis", "LGPD"].map((t, j) => (
              <span key={j} className="flex items-center">
                <span className="text-xs text-white/55 mx-8 uppercase tracking-[0.25em]">{t}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
