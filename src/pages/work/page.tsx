import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { works } from '@/mocks/portfolio';
import WorkArchiveGallery from './components/WorkArchiveGallery';
import WorkArchiveHero from './components/WorkArchiveHero';
import WorkGrid from './components/WorkGrid';

const WorkPage = () => {
  const [galleryId, setGalleryId] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Minimal top nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 h-16 md:h-20 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <Link to="/" className="group flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 border border-[#00ffcc] flex items-center justify-center group-hover:bg-[#00ffcc] transition-colors duration-300">
            <span className="text-[#00ffcc] group-hover:text-black text-xs font-bold bebas tracking-widest">AV</span>
          </div>
          <span className="text-white text-sm font-medium tracking-[0.2em] uppercase hidden sm:block">Alex Voss</span>
        </Link>

        <div className="flex items-center gap-6 md:gap-10">
          <Link
            to="/#work"
            className="text-xs uppercase tracking-[0.25em] text-white/40 hover:text-white transition-colors duration-300 whitespace-nowrap hidden md:block"
          >
            Home
          </Link>
          <Link
            to="/#contact"
            className="px-6 py-2 bg-[#00ffcc] text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
          >
            Hire Me
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <WorkArchiveHero count={works.length} />

      {/* Work Grid */}
      <WorkGrid works={works} onOpenGallery={setGalleryId} />

      {/* Footer strip */}
      <footer className="border-t border-white/5 px-8 md:px-16 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-white/20 text-xs uppercase tracking-[0.3em]">© 2025 Alex Voss — All Rights Reserved</span>
        <Link
          to="/"
          className="group flex items-center gap-3 text-white/30 text-xs uppercase tracking-[0.3em] hover:text-[#00ffcc] transition-colors duration-300 cursor-pointer whitespace-nowrap"
        >
          <i className="ri-arrow-left-line group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Home
        </Link>
      </footer>

      {/* Gallery Modal */}
      <WorkArchiveGallery workId={galleryId} onClose={() => setGalleryId(null)} />
    </div>
  );
};

export default WorkPage;
