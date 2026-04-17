import { useState } from 'react';

interface Work {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  gallery: string[];
}

interface WorkGridProps {
  works: Work[];
  onOpenGallery: (id: number) => void;
}

const WorkGrid = ({ works, onOpenGallery }: WorkGridProps) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Layout pattern: alternates between large and small cards
  // Pattern: [big, small, small], [small, big, small], [small, small, big], repeat
  const getCardSize = (index: number): 'large' | 'medium' | 'small' => {
    const pattern = index % 6;
    if (pattern === 0) return 'large';
    if (pattern === 3) return 'large';
    return 'medium';
  };

  return (
    <section className="px-6 md:px-12 lg:px-16 pb-24">
      {/* Masonry-style editorial grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-0">
        {works.map((work, i) => {
          const size = getCardSize(i);
          const isHovered = hoveredId === work.id;

          const heightClass =
            size === 'large'
              ? 'h-[520px] md:h-[680px]'
              : 'h-[340px] md:h-[440px]';

          return (
            <div
              key={work.id}
              className={`relative overflow-hidden cursor-pointer group mb-4 md:mb-6 break-inside-avoid ${heightClass}`}
              onMouseEnter={() => setHoveredId(work.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onOpenGallery(work.id)}
            >
              {/* Image */}
              <img
                src={work.image}
                alt={work.title}
                className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />

              {/* Dark overlay — always present, deepens on hover */}
              <div
                className={`absolute inset-0 transition-all duration-500 ${
                  isHovered
                    ? 'bg-gradient-to-t from-black/90 via-black/40 to-black/10'
                    : 'bg-gradient-to-t from-black/70 via-black/20 to-transparent'
                }`}
              />

              {/* Index number — top left */}
              <div
                className="absolute top-5 left-5 bebas leading-none select-none transition-all duration-500"
                style={{
                  fontSize: 'clamp(48px, 6vw, 80px)',
                  color: isHovered ? '#00ffcc' : 'rgba(255,255,255,0.12)',
                  letterSpacing: '-0.02em',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              {/* Gallery count badge — top right */}
              <div
                className={`absolute top-5 right-5 flex items-center gap-1.5 transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <i className="ri-image-line text-[#00ffcc] text-xs" />
                <span className="text-[#00ffcc] text-[10px] uppercase tracking-[0.3em]">
                  {work.gallery.length} Photos
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                <span
                  className={`text-[10px] uppercase tracking-[0.4em] block mb-2 transition-colors duration-300 ${
                    isHovered ? 'text-[#00ffcc]' : 'text-white/40'
                  }`}
                >
                  {work.category}
                </span>
                <h2
                  className="bebas text-white leading-none"
                  style={{ fontSize: 'clamp(28px, 4vw, 52px)', letterSpacing: '-0.01em' }}
                >
                  {work.title}
                </h2>

                {/* Year + CTA row */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/25 text-xs uppercase tracking-widest">{work.year}</span>
                  <div
                    className={`flex items-center gap-2 text-xs uppercase tracking-[0.25em] transition-all duration-300 ${
                      isHovered ? 'text-[#00ffcc] translate-x-0 opacity-100' : 'text-white/0 translate-x-4 opacity-0'
                    }`}
                  >
                    Open Gallery
                    <i className="ri-arrow-right-up-line" />
                  </div>
                </div>

                {/* Cyan bottom bar */}
                <div
                  className={`mt-4 h-px bg-[#00ffcc] transition-all duration-500 ${
                    isHovered ? 'w-full' : 'w-0'
                  }`}
                />
              </div>

              {/* Cyan border on hover */}
              <div
                className={`absolute inset-0 border transition-all duration-500 pointer-events-none ${
                  isHovered ? 'border-[#00ffcc]/30' : 'border-transparent'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom editorial text */}
      <div className="mt-16 md:mt-24 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-t border-white/5 pt-12">
        <div>
          <div
            className="bebas text-white/5 leading-none select-none"
            style={{ fontSize: 'clamp(60px, 10vw, 140px)' }}
          >
            {works.length} Works
          </div>
        </div>
        <p className="text-white/20 text-xs uppercase tracking-[0.3em] max-w-xs text-right leading-relaxed">
          All images are original works by Alex Voss. Reproduction without permission is prohibited.
        </p>
      </div>
    </section>
  );
};

export default WorkGrid;
