interface WorkArchiveHeroProps {
  count: number;
}

const WorkArchiveHero = ({ count }: WorkArchiveHeroProps) => (
  <section className="relative pt-32 md:pt-44 pb-16 md:pb-24 px-8 md:px-16 lg:px-24 overflow-hidden">
    {/* Ghost background text */}
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      <span
        className="bebas text-white/[0.025] leading-none whitespace-nowrap"
        style={{ fontSize: 'clamp(120px, 22vw, 340px)', letterSpacing: '-0.02em' }}
      >
        ARCHIVE
      </span>
    </div>

    {/* Cyan accent line */}
    <div className="flex items-center gap-4 mb-8 relative z-10">
      <div className="w-12 h-px bg-[#00ffcc]" />
      <span className="text-[#00ffcc] text-[10px] uppercase tracking-[0.5em]">Full Archive</span>
      <div className="flex-1 h-px bg-white/5" />
      <span className="text-white/20 text-[10px] uppercase tracking-[0.3em]">{count} Works</span>
    </div>

    {/* Main heading */}
    <div className="relative z-10">
      <h1
        className="bebas text-white leading-none"
        style={{ fontSize: 'clamp(80px, 14vw, 220px)', letterSpacing: '-0.02em' }}
      >
        Every
        <br />
        <span className="text-[#00ffcc]">Frame</span>
        <br />
        Counts.
      </h1>
    </div>

    {/* Sub copy */}
    <div className="relative z-10 mt-10 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-16">
      <p className="text-white/30 text-sm leading-relaxed max-w-sm">
        The complete body of work — editorial, conceptual, commercial, and everything in between. No filters. No curation. Just the work.
      </p>
      <div className="flex items-center gap-8">
        <div>
          <div className="bebas text-[#00ffcc] text-4xl leading-none">2024</div>
          <div className="text-white/20 text-[10px] uppercase tracking-[0.3em] mt-1">Since</div>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div>
          <div className="bebas text-white text-4xl leading-none">{count}</div>
          <div className="text-white/20 text-[10px] uppercase tracking-[0.3em] mt-1">Projects</div>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div>
          <div className="bebas text-white text-4xl leading-none">3</div>
          <div className="text-white/20 text-[10px] uppercase tracking-[0.3em] mt-1">Years</div>
        </div>
      </div>
    </div>

    {/* Decorative bottom line */}
    <div className="relative z-10 mt-16 flex items-center gap-4">
      <div className="flex-1 h-px bg-white/5" />
      <div className="w-2 h-2 border border-[#00ffcc]/40 rotate-45" />
      <div className="flex-1 h-px bg-white/5" />
    </div>
  </section>
);

export default WorkArchiveHero;
