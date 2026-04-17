import { useState, useEffect, useCallback } from 'react';
import { works } from '@/mocks/portfolio';

interface GalleryModalProps {
  workId: number | null;
  onClose: () => void;
}

const GalleryModal = ({ workId, onClose }: GalleryModalProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const work = works.find((w) => w.id === workId);

  useEffect(() => {
    setActiveIndex(0);
  }, [workId]);

  const handlePrev = useCallback(() => {
    if (!work) return;
    setActiveIndex((i) => (i - 1 + work.gallery.length) % work.gallery.length);
  }, [work]);

  const handleNext = useCallback(() => {
    if (!work) return;
    setActiveIndex((i) => (i + 1) % work.gallery.length);
  }, [work]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    if (workId !== null) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [workId, handlePrev, handleNext, onClose]);

  if (!work || workId === null) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          key={work.gallery[activeIndex]}
          src={work.gallery[activeIndex]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125 pointer-events-none select-none"
          style={{
            filter: 'blur(40px) saturate(1.8)',
            opacity: 0.55,
            transition: 'opacity 0.5s ease',
          }}
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.65) 100%)',
          }}
        />
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/8 flex-shrink-0">
        <div>
          <span className="text-[#00ffcc] text-[10px] uppercase tracking-[0.35em] block mb-0.5">{work.category} — {work.year}</span>
          <h2 className="bebas text-white text-2xl md:text-3xl leading-none tracking-wide">{work.title}</h2>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-white/20 text-xs uppercase tracking-widest hidden sm:block">
            {activeIndex + 1} / {work.gallery.length}
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/50 hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all duration-300 cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="relative z-10 flex-1 relative flex items-center justify-center overflow-hidden px-4 py-4">
        <img
          key={activeIndex}
          src={work.gallery[activeIndex]}
          alt={`${work.title} ${activeIndex + 1}`}
          className="max-w-full max-h-full object-contain"
          style={{ animation: 'photoEnter 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
        />

        <button
          onClick={handlePrev}
          className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/10 text-white/50 hover:border-[#00ffcc] hover:text-[#00ffcc] bg-black/40 backdrop-blur-sm transition-all duration-300 cursor-pointer"
        >
          <i className="ri-arrow-left-line text-lg" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-white/10 text-white/50 hover:border-[#00ffcc] hover:text-[#00ffcc] bg-black/40 backdrop-blur-sm transition-all duration-300 cursor-pointer"
        >
          <i className="ri-arrow-right-line text-lg" />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="relative z-10 flex-shrink-0 px-6 md:px-12 py-4 border-t border-white/8">
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {work.gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-12 md:w-20 md:h-14 overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                i === activeIndex ? 'border-[#00ffcc]' : 'border-transparent opacity-40 hover:opacity-70'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover object-top" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryModal;
