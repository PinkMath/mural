import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePhotoWall } from '@/hooks/usePhotoWall';
import { getMonthBySlug, getMonthSlug, monthSlugs, monthLabels } from '@/mocks/photoWall';
import PhotoLightbox from '@/pages/home/components/PhotoLightbox';
import { MonthPhoto } from '@/mocks/photoWall';
import useScrollReveal from '@/hooks/useScrollReveal';

const gridClass = (count: number) => {
  if (count === 1) return 'grid-cols-1';
  if (count === 2) return 'grid-cols-2';
  if (count === 3) return 'grid-cols-2 sm:grid-cols-3';
  return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
};

const aspectClass = (count: number, index: number) => {
  if (count === 1) return 'aspect-[16/9] sm:aspect-[21/9]';
  if (count === 2) return 'aspect-square sm:aspect-[4/5]';
  if (count === 3 && index === 0) return 'aspect-[16/9] sm:aspect-square';
  return 'aspect-square';
};

const photoWrapClass = (count: number, index: number) => {
  if (count === 3 && index === 0) return 'col-span-2 sm:col-span-1';
  return '';
};

const PhotoGrid = ({ data, monthLabel }: { data: MonthPhoto[]; monthLabel: string }) => {
  const [lightbox, setLightbox] = useState<MonthPhoto | null>(null);
  const lbIndex = data.findIndex((p) => p.id === lightbox?.id);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.01 });
  const count = data.length;

  return (
    <>
      <div
        ref={ref}
        className={`grid gap-1.5 sm:gap-2 ${gridClass(count)}`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {data.map((photo, pi) => (
          <div
            key={photo.id}
            className={`group relative overflow-hidden cursor-pointer ${photoWrapClass(count, pi)} ${aspectClass(count, pi)}`}
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.55s ease ${0.1 + pi * 0.08}s, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${0.1 + pi * 0.08}s`,
            }}
            onClick={() => setLightbox(photo)}
          >
            <img
              src={photo.url}
              alt={photo.caption || monthLabel}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white/85 text-xs tracking-[0.15em] uppercase leading-tight line-clamp-1">{photo.caption}</p>
              </div>
            )}
            <div className="absolute top-0 left-0 w-0 group-hover:w-full h-px bg-[#C2003E]/60 transition-all duration-500" />
            <div className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/60 border border-[#C2003E]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <i className="ri-zoom-in-line text-[#C2003E] text-sm" />
            </div>
          </div>
        ))}
      </div>

      <PhotoLightbox
        photo={lightbox}
        monthLabel={monthLabel}
        photoIndex={lbIndex >= 0 ? lbIndex : 0}
        totalPhotos={data.length}
        onClose={() => setLightbox(null)}
        onPrev={lbIndex > 0 ? () => setLightbox(data[lbIndex - 1]) : undefined}
        onNext={lbIndex < data.length - 1 ? () => setLightbox(data[lbIndex + 1]) : undefined}
      />
    </>
  );
};

const MonthPage = () => {
  const { month: slug } = useParams<{ month: string }>();
  const navigate = useNavigate();
  const { months, loading } = usePhotoWall();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const monthNum = slug ? getMonthBySlug(slug) : null;

  useEffect(() => {
    if (!loading && monthNum === null) {
      navigate('/', { replace: true });
    }
  }, [loading, monthNum, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <i className="ri-loader-4-line text-[#C2003E] text-3xl animate-spin" />
      </div>
    );
  }

  if (monthNum === null) return null;

  const monthIndex = monthNum - 1;
  const monthData = months[monthIndex];
  const label = monthData?.label ?? monthLabels[monthIndex];
  const year = monthData?.year ?? 2026;
  const photos = monthData?.photos ?? [];
  const numStr = String(monthNum).padStart(2, '0');

  const prevSlug = monthIndex > 0 ? monthSlugs[monthIndex - 1] : null;
  const nextSlug = monthIndex < 11 ? monthSlugs[monthIndex + 1] : null;
  const prevLabel = prevSlug ? monthLabels[monthIndex - 1] : null;
  const nextLabel = nextSlug ? monthLabels[monthIndex + 1] : null;

  return (
    <div className="grain-overlay min-h-screen bg-[#0a0a0a] text-white">

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between px-4 sm:px-6 md:px-16 h-14 md:h-18">
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-7 h-7 flex items-center justify-center text-white/40 group-hover:text-[#C2003E] transition-colors duration-300">
              <i className="ri-arrow-left-line text-base" />
            </div>
            <img
              src="https://storage.readdy-site.link/project_files/7bbe0463-89d4-4e9b-9a6b-a09970c7f4c9/ed7df51e-ad2c-4e05-8a65-2c6744e8b1ef_file.jpg?v=6c13df9251a5acd90fc6079411dcefdf"
              alt="Terceirao"
              className="w-10 h-10 object-contain rounded-sm flex-shrink-0"
            />
            <span className="text-white/40 group-hover:text-white text-sm tracking-[0.2em] uppercase bebas transition-colors duration-300 hidden sm:block">
              Terceirao
            </span>
          </Link>

          {/* Month quick nav */}
          <div className="hidden lg:flex items-center gap-1">
            {months.map((m, i) => {
              const s = getMonthSlug(m.month);
              const isActive = s === slug;
              return (
                <Link
                  key={m.month}
                  to={`/${s}`}
                  className={`px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'text-[#C2003E] border-b border-[#C2003E]'
                      : 'text-white/25 hover:text-white/70'
                  }`}
                >
                  {m.label.substring(0, 3)}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white/20 text-xs tracking-[0.2em] hidden sm:block">
              {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
            </span>
            <Link to="/" className="px-4 py-1.5 border border-white/10 hover:border-[#C2003E]/40 text-white/40 hover:text-[#C2003E] text-[10px] uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap hidden md:flex items-center gap-2">
              <i className="ri-layout-grid-line text-xs" /> Mural
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO HEADER ── */}
      <header className="relative min-h-[45vh] flex flex-col justify-end overflow-hidden pt-20 pb-10 px-4 sm:px-6 md:px-16 lg:px-24">
        {/* Ghost number */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 bebas select-none pointer-events-none text-stroke-white opacity-5"
          style={{ fontSize: 'clamp(140px, 30vw, 360px)', lineHeight: 1, letterSpacing: '-0.03em' }}
        >
          {numStr}
        </div>

        {/* Top accent */}
        <div className="absolute top-20 left-4 sm:left-6 md:left-16 lg:left-24 flex items-center gap-3">
          <div className="w-6 h-px bg-[#C2003E]" />
          <span className="text-[#C2003E] text-[10px] uppercase tracking-[0.4em]">Arquivo {year}</span>
        </div>

        <div className="relative z-10">
          <div className="flex items-end gap-4 sm:gap-6 mb-2">
            <span className="bebas text-white/6 text-7xl sm:text-8xl md:text-9xl tabular-nums leading-none select-none">
              {numStr}
            </span>
            <div className="pb-2 sm:pb-3">
              <h1 className="bebas text-white leading-none"
                style={{ fontSize: 'clamp(48px, 10vw, 120px)', letterSpacing: '-0.01em' }}>
                {label}
              </h1>
              <p className="text-white/25 text-xs tracking-[0.35em] uppercase mt-1">{year} · {photos.length} {photos.length === 1 ? 'memória' : 'memórias'}</p>
            </div>
          </div>
          <div className="w-full h-px bg-white/6 mt-6" />
        </div>
      </header>

      {/* ── PHOTOS ── */}
      <main className="px-4 sm:px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
        {photos.length === 0 ? (
          <div className="border border-dashed border-white/8 h-48 flex flex-col items-center justify-center gap-3 text-white/15">
            <i className="ri-camera-off-line text-3xl" />
            <p className="text-xs tracking-widest uppercase">Nenhuma foto neste mês ainda</p>
          </div>
        ) : (
          <PhotoGrid data={photos} monthLabel={`${label} ${year}`} />
        )}
      </main>

      {/* ── PREV / NEXT NAV ── */}
      <nav className="border-t border-white/5 px-4 sm:px-6 md:px-16 lg:px-24 py-8 md:py-10">
        <div className="flex items-center justify-between">
          {prevSlug ? (
            <Link to={`/${prevSlug}`} className="group flex items-center gap-3 cursor-pointer">
              <div className="w-9 h-9 flex items-center justify-center border border-white/10 group-hover:border-[#C2003E]/40 group-hover:text-[#C2003E] text-white/40 transition-all duration-300">
                <i className="ri-arrow-left-line text-sm" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-0.5">Mês anterior</p>
                <p className="bebas text-white/60 group-hover:text-white text-base tracking-[0.1em] transition-colors duration-300">{prevLabel}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          <Link to="/" className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-8 h-8 flex items-center justify-center border border-white/8 group-hover:border-[#C2003E]/30 transition-colors duration-300">
              <i className="ri-layout-grid-line text-white/25 group-hover:text-[#C2003E] text-sm transition-colors duration-300" />
            </div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/15 group-hover:text-white/40 transition-colors duration-300">Mural</span>
          </Link>

          {nextSlug ? (
            <Link to={`/${nextSlug}`} className="group flex items-center gap-3 cursor-pointer">
              <div className="hidden sm:block text-right">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 mb-0.5">Próximo mês</p>
                <p className="bebas text-white/60 group-hover:text-white text-base tracking-[0.1em] transition-colors duration-300">{nextLabel}</p>
              </div>
              <div className="w-9 h-9 flex items-center justify-center border border-white/10 group-hover:border-[#C2003E]/40 group-hover:text-[#C2003E] text-white/40 transition-all duration-300">
                <i className="ri-arrow-right-line text-sm" />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>

      {/* ── ALL MONTHS GRID ── */}
      <section className="border-t border-white/5 px-4 sm:px-6 md:px-16 lg:px-24 py-10 md:py-14 bg-[#060606]">
        <p className="text-white/15 text-[10px] tracking-[0.4em] uppercase mb-5">Todos os meses</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5 sm:gap-2">
          {months.map((m) => {
            const s = getMonthSlug(m.month);
            const isActive = s === slug;
            return (
              <Link
                key={m.month}
                to={`/${s}`}
                className={`flex flex-col items-center gap-1 py-3 border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'border-[#C2003E]/50 bg-[#C2003E]/5 text-[#C2003E]'
                    : 'border-white/6 hover:border-white/20 text-white/40 hover:text-white/70'
                }`}
              >
                <span className="bebas text-lg leading-none">{String(m.month).padStart(2, '0')}</span>
                <span className="text-[9px] tracking-wide">{m.label.substring(0, 3)}</span>
                {m.photos.length > 0 && (
                  <span className={`text-[8px] ${isActive ? 'text-[#C2003E]/70' : 'text-white/25'}`}>
                    {m.photos.length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#C2003E]/8 py-6 px-4 sm:px-6 md:px-16 bg-[#060606]">
        <div className="flex items-center justify-between">
          <span className="text-white/15 text-xs tracking-widest">© 2026 Terceirao</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group text-white/15 hover:text-[#C2003E] text-xs tracking-[0.3em] uppercase transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            Topo <i className="ri-arrow-up-line group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default MonthPage;
