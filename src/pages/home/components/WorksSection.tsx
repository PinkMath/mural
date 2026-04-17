import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { works } from '@/mocks/portfolio';
import GalleryModal from './GalleryModal';

const WorksSection = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [galleryId, setGalleryId] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <section id="work" className="bg-[#0a0a0a]">
        {/* Section Header — full bleed, editorial */}
        <div className="px-6 md:px-16 lg:px-24 pt-24 md:pt-36 pb-12 md:pb-20 border-b border-white/5">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-8 h-px bg-[#00ffcc]" />
                <span className="text-[#00ffcc] text-[10px] uppercase tracking-[0.4em]">Selected Projects</span>
              </div>
              <h2
                className="bebas text-white leading-none"
                style={{ fontSize: 'clamp(72px, 12vw, 180px)', letterSpacing: '-0.01em' }}
              >
                Selected<br />Works
              </h2>
            </div>
            <div className="lg:pb-4 flex flex-col items-start lg:items-end gap-3">
              <p className="text-white/30 text-sm max-w-xs lg:text-right leading-relaxed">
                A curated selection of editorial, conceptual, and commercial work spanning 2024–2025.
              </p>
              <span className="text-white/15 text-xs uppercase tracking-[0.3em]">{works.length} Projects</span>
            </div>
          </div>
        </div>

        {/* Works List — editorial stacked rows */}
        <div className="divide-y divide-white/5">
          {works.map((work, i) => {
            const isHovered = hoveredId === work.id;
            const isOdd = i % 2 !== 0;

            return (
              <div
                key={work.id}
                className="group relative cursor-pointer overflow-hidden"
                onMouseEnter={() => setHoveredId(work.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setGalleryId(work.id)}
                style={{ minHeight: 'clamp(260px, 32vw, 500px)' }}
              >
                {/* Full-bleed background image */}
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={work.image}
                    alt={work.title}
                    className={`w-full h-full object-cover object-top transition-all duration-700 ${
                      isHovered ? 'scale-105 opacity-60' : 'scale-100 opacity-20'
                    }`}
                  />
                  {/* Dark overlay always present */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
                </div>

                {/* Row content */}
                <div
                  className={`relative z-10 flex items-center px-6 md:px-16 lg:px-24 py-8 md:py-14 gap-4 md:gap-12 flex-row ${
                    isOdd ? 'lg:flex-row-reverse' : 'lg:flex-row'
                  }`}
                >
                  {/* Index number */}
                  <div
                    className="bebas flex-shrink-0 leading-none select-none transition-all duration-500"
                    style={{
                      fontSize: 'clamp(80px, 12vw, 160px)',
                      color: isHovered ? '#00ffcc' : 'rgba(255,255,255,0.06)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Title block */}
                  <div className={`flex-1 text-left ${isOdd ? 'lg:text-right' : 'lg:text-left'}`}>
                    <span className="text-[#00ffcc]/60 text-[10px] uppercase tracking-[0.4em] block mb-3 transition-colors duration-300 group-hover:text-[#00ffcc]">
                      {work.category}
                    </span>
                    <h3
                      className="bebas text-white leading-none transition-all duration-500 group-hover:text-white"
                      style={{
                        fontSize: 'clamp(40px, 6vw, 96px)',
                        letterSpacing: '-0.01em',
                        WebkitTextStroke: isHovered ? '0px' : '0px',
                      }}
                    >
                      {work.title}
                    </h3>
                    <div className={`flex items-center gap-4 mt-4 justify-start ${isOdd ? 'lg:justify-end' : 'lg:justify-start'}`}>
                      <span className="text-white/20 text-xs uppercase tracking-widest">{work.year}</span>
                      <div className="w-px h-3 bg-white/10" />
                      <span
                        className={`text-xs uppercase tracking-[0.25em] transition-all duration-300 flex items-center gap-2 ${
                          isHovered ? 'text-[#00ffcc]' : 'text-white/20'
                        }`}
                      >
                        View Gallery
                        <i className={`ri-arrow-right-up-line transition-transform duration-300 ${isHovered ? 'translate-x-1 -translate-y-1' : ''}`} />
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail preview — appears on hover */}
                  <div
                    className={`flex-shrink-0 overflow-hidden transition-all duration-500 hidden lg:block relative ${
                      isHovered ? 'opacity-100' : 'w-0 opacity-0'
                    }`}
                    style={{
                      width: isHovered ? 'clamp(200px, 22vw, 340px)' : '0px',
                      height: 'clamp(260px, 28vw, 440px)',
                      transition: 'width 0.5s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s ease',
                    }}
                  >
                    <img
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 border border-[#00ffcc]/40 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Mobile image strip — always visible on small screens */}
                <div className="lg:hidden relative w-full overflow-hidden" style={{ height: 'clamp(180px, 45vw, 280px)' }}>
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-active:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[#00ffcc] text-[10px] uppercase tracking-[0.3em]">
                    <span>View Gallery</span>
                    <i className="ri-arrow-right-up-line" />
                  </div>
                </div>

                {/* Bottom cyan line on hover */}
                <div
                  className={`absolute bottom-0 left-0 h-px bg-[#00ffcc] transition-all duration-500 ${
                    isHovered ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="px-6 md:px-16 lg:px-24 py-16 md:py-24 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/5">
          <div>
            <div className="bebas text-white/10 text-6xl md:text-8xl leading-none select-none">
              {works.length} Works
            </div>
          </div>
          <button
            onClick={() => navigate('/work')}
            className="group flex items-center gap-4 px-10 py-4 border border-white/10 text-white/40 text-xs uppercase tracking-[0.3em] hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all duration-400 cursor-pointer whitespace-nowrap"
          >
            View Full Archive
            <i className="ri-arrow-right-line group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </section>

      {/* Gallery Modal */}
      <GalleryModal workId={galleryId} onClose={() => setGalleryId(null)} />
    </>
  );
};

export default WorksSection;
