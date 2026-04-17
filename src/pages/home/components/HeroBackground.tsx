import { useEffect, useState, useRef } from 'react';
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
const FADE_DURATION = 1200;

const HeroBackground = ({ months }: Props) => {
  const slides: Slide[] = months
    .filter((m) => m.photos.length > 0)
    .map((m) => ({ url: m.photos[0].url, label: m.label, month: m.month }));

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = () => {
    if (slides.length <= 1) return;
    setTransitioning(true);
    timerRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % slides.length);
      setTransitioning(false);
    }, FADE_DURATION);
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(advance, SLIDE_DURATION);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  // No photos yet → gradient fallback
  if (slides.length === 0) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, #00ffcc 0%, transparent 60%)' }} />
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Photo layer */}
      <div
        key={current}
        className="absolute inset-0 hero-bg-slide"
        style={{ opacity: transitioning ? 0 : 1, transition: `opacity ${FADE_DURATION}ms ease` }}
      >
        <img
          src={slide.url}
          alt={slide.label}
          className="absolute inset-0 w-full h-full object-cover object-center hero-bg-zoom"
          draggable={false}
        />
      </div>

      {/* Overlays for text readability */}
      <div className="absolute inset-0 bg-[#0a0a0a]/55 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent to-transparent z-10 hidden md:block" />

      {/* Month label — bottom right corner */}
      <div
        className="absolute bottom-20 sm:bottom-16 md:bottom-10 right-4 md:right-16 z-20 text-right transition-all duration-700"
        style={{ opacity: transitioning ? 0 : 1 }}
      >
        <span className="text-white/20 text-[10px] uppercase tracking-[0.4em]">{slide.label}</span>
      </div>

      {/* Dots indicator — bottom center */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setTransitioning(false); }}
              className={`transition-all duration-400 cursor-pointer rounded-full ${
                i === current
                  ? 'w-4 h-1.5 bg-[#00ffcc]'
                  : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Ir para ${slides[i].label}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBackground;
