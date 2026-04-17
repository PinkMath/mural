import { useEffect, useRef, useState } from 'react';

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#0a0a0a]">
      {/* Spline 3D Embed - Full Background */}
      <div className="spline-container absolute inset-0 w-full h-full overflow-hidden">
        <iframe
          src="https://my.spline.design/3dcarouselcopycopy-hI6jMfucMCRV6kVYWtCGicQo-6fv/"
          frameBorder="0"
          title="3D Carousel"
          loading="eager"
          style={{
            display: 'block',
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '150vw',
            height: '150vh',
            minWidth: '150%',
            minHeight: '150%',
            transform: 'translate(-50%, -50%) scale(1)',
            border: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent pointer-events-none z-10 hidden md:block" />
      <div className="absolute inset-0 bg-[#0a0a0a]/40 pointer-events-none z-10 md:hidden" />
      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-56 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-10" />

      {/* Vertical rotated text - left edge — desktop only */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-20 bg-[#00ffcc]/40" />
        <span
          className="text-[10px] uppercase tracking-[0.4em] text-white/30 whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Portfolio 2025 — Scroll to Explore
        </span>
        <div className="w-px h-20 bg-[#00ffcc]/40" />
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex absolute inset-0 z-20 flex-col justify-end pb-20 px-16 lg:px-24 pointer-events-none">
        {/* Ghost text */}
        <div
          className="absolute top-1/2 left-16 -translate-y-1/2 bebas text-stroke-white select-none pointer-events-none hidden lg:block"
          style={{ fontSize: 'clamp(120px, 18vw, 260px)', lineHeight: 0.85, letterSpacing: '-0.02em' }}
        >
          VISUAL
        </div>

        {/* Bottom left content */}
        <div
          className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#00ffcc]" />
            <span className="text-[#00ffcc] text-xs uppercase tracking-[0.3em]">Photographer & Visual Artist</span>
          </div>
          <h1
            className="bebas text-white leading-none mb-4"
            style={{ fontSize: 'clamp(56px, 9vw, 130px)', letterSpacing: '-0.01em' }}
          >
            Alex Voss
          </h1>
          <p className="dm-serif italic text-white/50 text-xl mb-8 max-w-md">
            Motion × Emotion × Dimension
          </p>
          <div className="flex items-center gap-4 pointer-events-auto">
            <button
              onClick={scrollToWork}
              className="px-8 py-3 bg-[#00ffcc] text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              View Work
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 border border-white/20 text-white text-xs uppercase tracking-[0.25em] hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </div>

      {/* Stats — desktop top right */}
      <div
        className={`hidden md:flex absolute top-24 right-16 z-20 flex-col items-end gap-6 transition-all duration-1000 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
        style={{ transitionDelay: '0.7s' }}
      >
        {[
          { num: '200+', label: 'Projects' },
          { num: '8', label: 'Years Exp.' },
          { num: '50+', label: 'Clients' },
        ].map(({ num, label }) => (
          <div key={label} className="text-right">
            <div className="bebas text-3xl text-white leading-none">{num}</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/30">{label}</div>
          </div>
        ))}
      </div>

      {/* Scroll indicator — desktop bottom right */}
      <div
        ref={scrollRef}
        className="hidden md:flex absolute bottom-8 right-16 z-20 flex-col items-center gap-2 cursor-pointer pointer-events-auto"
        onClick={scrollToWork}
      >
        <div className="w-12 h-12 rounded-full border border-[#00ffcc]/40 flex items-center justify-center animate-float hover:border-[#00ffcc] transition-colors duration-300">
          <i className="ri-arrow-down-line text-[#00ffcc] text-lg" />
        </div>
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div
        className={`md:hidden absolute inset-0 z-20 flex flex-col justify-end px-6 pb-14 pointer-events-none transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        style={{ transitionDelay: '0.3s' }}
      >
        {/* Label */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-px bg-[#00ffcc]" />
          <span className="text-[#00ffcc] text-[10px] uppercase tracking-[0.3em]">Photographer & Visual Artist</span>
        </div>

        {/* Name */}
        <h1
          className="bebas text-white leading-none mb-2"
          style={{ fontSize: 'clamp(52px, 16vw, 90px)', letterSpacing: '-0.01em' }}
        >
          Alex Voss
        </h1>

        {/* Tagline */}
        <p className="dm-serif italic text-white/50 text-base mb-6">
          Motion × Emotion × Dimension
        </p>

        {/* Stats row — horizontal on mobile */}
        <div className="flex items-center gap-5 mb-7">
          {[
            { num: '200+', label: 'Projects' },
            { num: '8yr', label: 'Experience' },
            { num: '50+', label: 'Clients' },
          ].map(({ num, label }, i) => (
            <div key={label} className="flex items-center gap-5">
              <div>
                <div className="bebas text-xl text-white leading-none">{num}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-0.5">{label}</div>
              </div>
              {i < 2 && <div className="w-px h-6 bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={scrollToWork}
            className="flex-1 py-3 bg-[#00ffcc] text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
          >
            View Work
          </button>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 py-3 border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            Get in Touch
          </button>
        </div>

        {/* Scroll hint */}
        <div
          className="flex items-center gap-2 mt-5 cursor-pointer pointer-events-auto"
          onClick={scrollToWork}
        >
          <div className="w-6 h-6 rounded-full border border-[#00ffcc]/40 flex items-center justify-center">
            <i className="ri-arrow-down-line text-[#00ffcc] text-xs" />
          </div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
