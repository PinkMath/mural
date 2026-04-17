import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-8 md:px-16 h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            className="cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 border border-[#00ffcc] flex items-center justify-center group-hover:bg-[#00ffcc] transition-colors duration-300">
                <span className="text-[#00ffcc] group-hover:text-black text-xs font-bold bebas tracking-widest">AV</span>
              </div>
              <span className="text-white text-sm font-medium tracking-[0.2em] uppercase hidden sm:block">Alex Voss</span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {['work', 'about', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="nav-link text-xs uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap pb-1"
              >
                {item}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => scrollTo('contact')}
              className="animate-pulse-glow px-6 py-2 bg-[#00ffcc] text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Hire Me
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center transition-all duration-500 md:hidden ${menuOpen ? 'opacity-100 pointer-events-all' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center gap-10">
          {['work', 'about', 'contact'].map((item, i) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className="bebas text-6xl text-white/80 hover:text-[#00ffcc] transition-colors duration-300 cursor-pointer tracking-widest"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {item}
            </button>
          ))}
          <button
            onClick={() => scrollTo('contact')}
            className="mt-4 px-8 py-3 border border-[#00ffcc] text-[#00ffcc] text-sm uppercase tracking-widest hover:bg-[#00ffcc] hover:text-black transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            Hire Me
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
