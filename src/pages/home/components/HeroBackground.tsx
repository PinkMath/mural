import { useEffect, useState } from 'react';
import { MonthData } from '@/mocks/photoWall';

interface Slide {
  url: string;
  label: string;
  month: number;
}

interface Props {
  months: MonthData[];
}

const SLIDE_DURATION = 4500;
const FADE_DURATION  = 1100;
const KB_VARIANTS    = ['hero-kb-a', 'hero-kb-b', 'hero-kb-c', 'hero-kb-d'] as const;
const KB_DURATIONS   = [14, 12, 16, 13]; // seconds — each variant has its own pace

const HeroBackground = ({ months }: Props) => {
  const slides: Slide[] = months
    .filter((m) => m.photos.length > 0)
    .map((m) => ({ url: m.photos[0].url, label: m.label, month: m.month }));

  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [slides.length]);

  const goTo = (i: number) => {
    if (i === current) return;
    setCurrent(i);
    setProgressKey((k) => k + 1);
  };

  /* ── fallback: no photos yet ── */
  if (slides.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, #C2003E 0%, transparent 60%)' }}
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* ── All slides stacked: CSS crossfade ── */}
      {slides.map((slide, i) => {
        const variant  = KB_VARIANTS[i % 4];
        const duration = KB_DURATIONS[i % 4];
        const isActive = i === current;

        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity   : isActive ? 1 : 0,
              transition: `opacity ${FADE_DURATION}ms cubic-bezier(0.45, 0, 0.55, 1)`,
              zIndex    : isActive ? 2 : 1,
            }}
          >
            <img
              src={slide.url}
              alt={slide.label}
              className="absolute inset-0 w-full h-full object-cover object-center"
              draggable={false}
              style={{
                animation          : `${variant} ${duration}s ease-in-out infinite`,
                animationPlayState : isActive ? 'running' : 'paused',
                willChange         : 'transform',
              }}
            />
          </div>
        );
      })}

      {/* ── Dark overlays ── */}
      <div className="absolute inset-0 bg-[#0a0a0a]/50 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/10 to-[#0a0a0a]/25 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/65 via-transparent to-transparent z-10 hidden md:block" />

      {/* ── Subtle vignette ring ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(10,10,10,0.55) 100%)',
        }}
      />

      {/* ── Month label — bottom right ── */}
      <div className="absolute bottom-20 sm:bottom-16 md:bottom-10 right-4 md:right-16 z-20 text-right">
        <span
          className="text-white/25 text-[10px] uppercase tracking-[0.4em] transition-opacity duration-700"
          style={{ opacity: 1 }}
        >
          {slides[current].label}
        </span>
      </div>

      {/* ── Progress bar — very bottom ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] z-20 bg-white/5 overflow-hidden">
          <div
            key={progressKey}
            className="h-full bg-[#C2003E]/50 hero-progress"
            style={{ animationDuration: `${SLIDE_DURATION}ms` }}
          />
        </div>
      )}

      {/* ── Dots indicator ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Ir para ${slides[i].label}`}
              className={`transition-all duration-500 cursor-pointer rounded-full ${
                i === current
                  ? 'w-5 h-[5px] bg-[#C2003E]'
                  : 'w-[5px] h-[5px] bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBackground;
