import { useEffect, useRef } from 'react';
import { MonthPhoto } from '@/mocks/photoWall';

interface Props {
  photo: MonthPhoto | null;
  monthLabel: string;
  photoIndex: number;
  totalPhotos: number;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const pad = (n: number) => String(n).padStart(2, '0');

const PhotoLightbox = ({ photo, monthLabel, photoIndex, totalPhotos, onClose, onPrev, onNext }: Props) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!photo) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [photo, onClose, onPrev, onNext]);

  useEffect(() => {
    document.body.style.overflow = photo ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [photo]);

  if (!photo) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      if (dx > 0 && onNext) onNext();
      if (dx < 0 && onPrev) onPrev();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ animation: 'lightboxIn 0.25s ease both' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blurred photo — reflects colors of the image */}
        <img
          key={photo.url}
          src={photo.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-125"
          style={{
            filter: 'blur(40px) saturate(1.8)',
            opacity: 0.55,
            transition: 'opacity 0.4s ease',
          }}
          draggable={false}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </div>

      {/* ── HEADER BAR ── */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 h-12 sm:h-14 flex-shrink-0 border-b border-white/8">
        <span className="text-white/40 text-xs uppercase tracking-[0.2em] truncate max-w-[38vw] sm:max-w-[45vw]">
          {monthLabel}
        </span>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onPrev ? (
            <button onClick={onPrev}
              className="w-7 h-7 flex items-center justify-center text-white/35 hover:text-[#00ffcc] transition-colors cursor-pointer">
              <i className="ri-arrow-left-s-line text-base" />
            </button>
          ) : <div className="w-7" />}

          <div className="flex items-baseline gap-1 border border-white/15 px-2.5 py-1 bg-white/5 backdrop-blur-sm">
            <span className="bebas text-[#00ffcc] leading-none tracking-wider"
              style={{ fontSize: 'clamp(13px, 3.5vw, 16px)' }}>
              {pad(photoIndex + 1)}
            </span>
            <span className="text-white/25 text-[10px] leading-none">/</span>
            <span className="bebas text-white/45 leading-none tracking-wider"
              style={{ fontSize: 'clamp(13px, 3.5vw, 16px)' }}>
              {pad(totalPhotos)}
            </span>
          </div>

          {onNext ? (
            <button onClick={onNext}
              className="w-7 h-7 flex items-center justify-center text-white/35 hover:text-[#00ffcc] transition-colors cursor-pointer">
              <i className="ri-arrow-right-s-line text-base" />
            </button>
          ) : <div className="w-7" />}
        </div>

        <button onClick={onClose}
          className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-[#00ffcc] transition-colors cursor-pointer flex-shrink-0">
          <i className="ri-close-line text-xl" />
        </button>
      </div>

      {/* ── IMAGE AREA ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden px-10 sm:px-14 py-3">
        {onPrev && (
          <button onClick={onPrev}
            className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-white/35 hover:text-white transition-colors cursor-pointer z-10 bg-black/30 backdrop-blur-sm rounded-full border border-white/8">
            <i className="ri-arrow-left-s-line text-xl sm:text-2xl" />
          </button>
        )}

        <div className="w-full h-full flex items-center justify-center" onClick={onClose}>
          <img
            key={photo.id}
            src={photo.url}
            alt={photo.caption || monthLabel}
            className="max-w-full max-h-full object-contain select-none"
            style={{ animation: 'photoEnter 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both' }}
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />
        </div>

        {onNext && (
          <button onClick={onNext}
            className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center text-white/35 hover:text-white transition-colors cursor-pointer z-10 bg-black/30 backdrop-blur-sm rounded-full border border-white/8">
            <i className="ri-arrow-right-s-line text-xl sm:text-2xl" />
          </button>
        )}
      </div>

      {/* ── FOOTER BAR ── */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 h-10 sm:h-11 flex-shrink-0 border-t border-white/8">
        <p className="text-white/35 text-xs tracking-[0.15em] uppercase truncate flex-1 mr-4">
          {photo.caption || ''}
        </p>

        {(onPrev || onNext) && (
          <p className="text-white/15 text-[9px] tracking-widest uppercase flex-shrink-0 sm:hidden">
            ← deslize →
          </p>
        )}

        {totalPhotos > 1 && (
          <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
            {Array.from({ length: totalPhotos }).map((_, i) => (
              <div key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === photoIndex ? 'w-3 h-1 bg-[#00ffcc]' : 'w-1 h-1 bg-white/15'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoLightbox;
