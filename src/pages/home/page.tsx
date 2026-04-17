import { useEffect, useState } from 'react';
import { usePhotoWall } from '@/hooks/usePhotoWall';
import MonthSection from './components/MonthSection';
import HeroBackground from './components/HeroBackground';
import CountdownSection from './components/CountdownSection';

const Home = () => {
  const { months, loading } = usePhotoWall();
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const totalPhotos = months.reduce((acc, m) => acc + m.photos.length, 0);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <i className="ri-loader-4-line text-[#00ffcc] text-3xl animate-spin" />
          <p className="text-white/30 text-xs tracking-widest uppercase">Carregando mural...</p>
        </div>
      </div>
    );
  }

  const scrollToMural = () => {
    document.getElementById('mural')?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const goToMonth = (month: number) => {
    document.getElementById(`mes-${month}`)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="grain-overlay min-h-screen bg-[#0a0a0a] text-white">

      {/* ── MOBILE MENU OVERLAY ── */}
      <div className={`fixed inset-0 z-50 bg-[#0a0a0a]/97 backdrop-blur-xl flex flex-col transition-all duration-400 lg:hidden ${
        menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Close */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 border border-[#00ffcc] flex items-center justify-center">
              <span className="text-[#00ffcc] text-xs font-bold bebas">3°</span>
            </div>
            <span className="bebas text-white tracking-[0.2em]">Terceirao</span>
          </div>
          <button onClick={() => setMenuOpen(false)} className="w-9 h-9 flex items-center justify-center text-white/50 hover:text-white cursor-pointer">
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Month grid */}
        <div className="flex-1 overflow-y-auto px-5 py-6">
          <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase mb-4">Ir para o mês</p>
          <div className="grid grid-cols-3 gap-2 mb-8">
            {months.map((m) => (
              <button
                key={m.month}
                onClick={() => goToMonth(m.month)}
                className="flex flex-col items-center gap-1 py-3 border border-white/8 hover:border-[#00ffcc]/40 hover:bg-[#00ffcc]/5 transition-all cursor-pointer"
              >
                <span className="bebas text-white/20 text-lg leading-none">{String(m.month).padStart(2, '0')}</span>
                <span className="text-white/60 text-[10px] tracking-wide">{m.label.substring(0, 3)}</span>
                {m.photos.length > 0 && (
                  <span className="text-[#00ffcc]/50 text-[9px]">{m.photos.length} foto{m.photos.length > 1 ? 's' : ''}</span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={scrollToMural}
            className="w-full py-3 bg-[#00ffcc] text-black text-xs font-bold uppercase tracking-[0.25em] cursor-pointer whitespace-nowrap"
          >
            Ver todo o mural
          </button>
        </div>

        <div className="px-5 py-4 border-t border-white/5 text-center">
          <p className="text-white/15 text-xs tracking-widest">{totalPhotos} fotos · 2026</p>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-16 h-14 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 border border-[#00ffcc] flex items-center justify-center flex-shrink-0">
              <span className="text-[#00ffcc] text-xs font-bold bebas tracking-widest">3°</span>
            </div>
            <span className="text-white text-sm font-medium tracking-[0.2em] uppercase bebas">
              Terceirao
            </span>
          </div>

          {/* Desktop month nav */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6">
            {months.slice(0, 6).map((m) => (
              <a key={m.month} href={`#mes-${m.month}`}
                className="text-white/30 hover:text-[#00ffcc] text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 cursor-pointer whitespace-nowrap nav-link pb-1">
                {m.label.substring(0, 3)}
              </a>
            ))}
            <span className="text-white/15">·</span>
            {months.slice(6).map((m) => (
              <a key={m.month} href={`#mes-${m.month}`}
                className="text-white/30 hover:text-[#00ffcc] text-[10px] tracking-[0.25em] uppercase transition-colors duration-300 cursor-pointer whitespace-nowrap nav-link pb-1">
                {m.label.substring(0, 3)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/20 text-xs tracking-[0.2em] hidden sm:block">{totalPhotos} fotos</span>
            <button onClick={scrollToMural}
              className="px-4 py-2 border border-[#00ffcc]/30 text-[#00ffcc] text-xs uppercase tracking-[0.2em] hover:bg-[#00ffcc] hover:text-black transition-all duration-300 cursor-pointer whitespace-nowrap hidden md:block">
              Ver Mural
            </button>
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] cursor-pointer"
              aria-label="Menu"
            >
              <span className="block w-5 h-0.5 bg-white/70" />
              <span className="block w-5 h-0.5 bg-white/70" />
              <span className="block w-3 h-0.5 bg-white/70 self-start" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative w-full h-screen min-h-[580px] overflow-hidden bg-[#0a0a0a]">
        {/* Background: photo slideshow (one per month) */}
        <HeroBackground months={months} />

        {/* Left vertical text — desktop only */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4">
          <div className="w-px h-16 bg-[#00ffcc]/40" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
            Terceirao 2026 — Último Ano Juntos
          </span>
          <div className="w-px h-16 bg-[#00ffcc]/40" />
        </div>

        {/* Desktop content */}
        <div className="hidden md:flex absolute inset-0 z-20 flex-col justify-end pb-16 lg:pb-20 px-12 lg:px-24 pointer-events-none">
          <div className="absolute top-1/2 left-16 -translate-y-1/2 bebas text-stroke-white select-none pointer-events-none hidden lg:block"
            style={{ fontSize: 'clamp(80px, 14vw, 220px)', lineHeight: 0.85, letterSpacing: '-0.02em' }}>
            2026
          </div>
          <div className={`transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-px bg-[#00ffcc]" />
              <span className="text-[#00ffcc] text-xs uppercase tracking-[0.3em]">Nosso último ano na escola</span>
            </div>
            <h1 className="bebas text-white leading-none mb-3"
              style={{ fontSize: 'clamp(56px, 9vw, 130px)', letterSpacing: '-0.01em' }}>
              Terceirao
            </h1>
            <p className="dm-serif italic text-white/50 text-lg mb-7 max-w-md">Um mês, uma memória, uma turma</p>
            <button onClick={scrollToMural} className="pointer-events-auto px-8 py-3 bg-[#00ffcc] text-black text-xs font-bold uppercase tracking-[0.25em] hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap">
              Ver Mural
            </button>
          </div>
        </div>

        {/* Stats desktop */}
        <div className={`hidden md:flex absolute top-24 right-12 lg:right-16 z-20 flex-col items-end gap-5 transition-all duration-1000 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
          style={{ transitionDelay: '0.7s' }}>
          {[{ num: '12', label: 'Meses' }, { num: String(totalPhotos), label: 'Fotos' }, { num: '2026', label: 'Ano' }].map(({ num, label }) => (
            <div key={label} className="text-right">
              <div className="bebas text-3xl text-white leading-none">{num}</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/30">{label}</div>
            </div>
          ))}
        </div>

        {/* Scroll indicator desktop */}
        <div className="hidden md:flex absolute bottom-6 right-12 lg:right-16 z-20 flex-col items-center gap-2 cursor-pointer pointer-events-auto" onClick={scrollToMural}>
          <div className="w-11 h-11 rounded-full border border-[#00ffcc]/40 flex items-center justify-center animate-float hover:border-[#00ffcc] transition-colors duration-300">
            <i className="ri-arrow-down-line text-[#00ffcc] text-lg" />
          </div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
        </div>

        {/* Mobile content */}
        <div className={`md:hidden absolute inset-0 z-20 flex flex-col justify-end px-5 pb-12 pointer-events-none transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-px bg-[#00ffcc]" />
            <span className="text-[#00ffcc] text-[10px] uppercase tracking-[0.3em]">Nosso último ano</span>
          </div>
          <h1 className="bebas text-white leading-none mb-2"
            style={{ fontSize: 'clamp(48px, 15vw, 84px)', letterSpacing: '-0.01em' }}>
            Terceirao
          </h1>
          <p className="dm-serif italic text-white/50 text-sm mb-5">Um mês, uma memória, uma turma</p>

          {/* Stats row */}
          <div className="flex items-center gap-4 mb-6">
            {[{ num: '12', label: 'Meses' }, { num: String(totalPhotos), label: 'Fotos' }, { num: '2026', label: 'Ano' }].map(({ num, label }, i) => (
              <div key={label} className="flex items-center gap-4">
                <div>
                  <div className="bebas text-lg text-white leading-none">{num}</div>
                  <div className="text-[9px] uppercase tracking-[0.15em] text-white/30">{label}</div>
                </div>
                {i < 2 && <div className="w-px h-5 bg-white/10" />}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <button onClick={scrollToMural}
              className="flex-1 py-3 bg-[#00ffcc] text-black text-xs font-bold uppercase tracking-[0.2em] cursor-pointer whitespace-nowrap">
              Ver Mural
            </button>
            <button onClick={() => setMenuOpen(true)}
              className="px-4 py-3 border border-white/20 text-white/60 text-xs uppercase tracking-[0.15em] cursor-pointer whitespace-nowrap flex items-center gap-2">
              <i className="ri-calendar-line text-sm" /> Meses
            </button>
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <CountdownSection />

      {/* ── MURAL ── */}
      <section id="mural" className="px-4 sm:px-6 md:px-16 lg:px-24 py-14 md:py-24">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-16 border-b border-white/5 pb-8 md:pb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 md:w-8 h-px bg-[#00ffcc]" />
              <span className="text-[#00ffcc] text-[10px] uppercase tracking-[0.4em]">Arquivo do Terceirao</span>
            </div>
            <h2 className="bebas text-white leading-none"
              style={{ fontSize: 'clamp(44px, 10vw, 140px)', letterSpacing: '-0.01em' }}>
              Mural 2026
            </h2>
          </div>
          <p className="text-white/25 text-sm max-w-xs sm:text-right leading-relaxed">
            Cada mês, um novo capítulo.<br className="hidden sm:block" />
            Nossa sala, nossa história.
          </p>
        </div>

        {months.map((m, i) => (
          <div key={m.month} id={`mes-${m.month}`}>
            <MonthSection data={m} index={i} />
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00ffcc]/10 py-8 md:py-10 px-4 sm:px-6 md:px-16 bg-[#060606]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border border-[#00ffcc]/30 flex items-center justify-center">
              <span className="text-[#00ffcc] text-[8px] font-bold bebas">3°</span>
            </div>
            <span className="text-white/20 text-xs tracking-widest">© 2026 Terceirao. Última jornada.</span>
          </div>
          <div className="w-7 h-7 flex items-center justify-center">
            <i className="ri-camera-line text-white/15 text-base" />
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group text-white/20 hover:text-[#00ffcc] text-xs tracking-[0.3em] uppercase transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap">
            Topo <i className="ri-arrow-up-line group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Home;
