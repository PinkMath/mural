const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#050505] border-t border-[#00ffcc]/20 py-8 px-6 md:px-16 lg:px-24">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border border-[#00ffcc]/40 flex items-center justify-center">
            <span className="text-[#00ffcc] text-[8px] font-bold bebas">AV</span>
          </div>
          <span className="text-white/20 text-xs">© 2025 Alex Voss. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6">
          {[
            { icon: 'instagram', label: 'Instagram' },
            { icon: 'behance', label: 'Behance' },
            { icon: 'vimeo', label: 'Vimeo' },
          ].map(({ icon, label }) => (
            <a
              key={icon}
              href="#"
              aria-label={label}
              className="w-8 h-8 flex items-center justify-center border border-white/10 text-white/30 hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all duration-300 cursor-pointer"
            >
              <i className={`ri-${icon}-line text-sm`} />
            </a>
          ))}
        </div>

        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 text-white/30 text-xs uppercase tracking-[0.25em] hover:text-[#00ffcc] transition-colors duration-300 cursor-pointer whitespace-nowrap"
        >
          Back to Top
          <i className="ri-arrow-up-line group-hover:-translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
