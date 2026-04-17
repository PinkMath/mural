const skills = [
  'Portrait', 'Landscape', 'Editorial', 'Fashion',
  'Architecture', 'Conceptual', 'Long Exposure', 'Street',
  'Fine Art', 'Commercial', 'Documentary', 'Aerial',
];

const AboutSection = () => (
  <section id="about" className="bg-[#0f0f0f] py-24 md:py-36 px-6 md:px-16 lg:px-24 overflow-hidden">
    <div className="max-w-[1400px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Left - Image */}
        <div className="relative">
          {/* Ghost number */}
          <div
            className="bebas text-stroke-white select-none pointer-events-none absolute -top-8 -left-4 hidden lg:block"
            style={{ fontSize: '200px', lineHeight: 1, opacity: 0.06 }}
          >
            01
          </div>

          {/* Main portrait */}
          <div className="relative" style={{ transform: 'rotate(2deg)' }}>
            <div className="w-full max-w-[480px] mx-auto lg:mx-0" style={{ height: 'clamp(400px, 55vw, 640px)' }}>
              <img
                src="https://readdy.ai/api/search-image?query=professional%20photographer%20portrait%20dark%20moody%20studio%20lighting%20dramatic%20shadows%20artistic%20black%20and%20white%20editorial%20style%20confident%20creative%20person&width=480&height=640&seq=about1&orientation=portrait"
                alt="Alex Voss - Photographer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 border-2 border-[#00ffcc]/30" style={{ transform: 'translate(12px, 12px)' }} />
            </div>

            {/* Floating label */}
            <div className="absolute top-6 -right-4 md:-right-8 bg-[#00ffcc] px-4 py-2">
              <span className="text-black text-[10px] font-bold uppercase tracking-[0.25em] whitespace-nowrap">Based in NYC</span>
            </div>

            {/* Award badge */}
            <div className="absolute -bottom-6 left-6 bg-[#1a1a1a] border border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className="ri-award-line text-[#00ffcc] text-xl" />
                </div>
                <div>
                  <div className="text-white text-xs font-semibold">IPA Gold Award</div>
                  <div className="text-white/40 text-[10px] uppercase tracking-wider">2024 Winner</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Content */}
        <div className="lg:pt-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#00ffcc]" />
            <span className="text-[#00ffcc] text-xs uppercase tracking-[0.3em]">About Me</span>
          </div>

          <div
            className="bebas text-stroke leading-none mb-8 hidden lg:block"
            style={{ fontSize: 'clamp(60px, 8vw, 120px)' }}
          >
            ABOUT
          </div>

          <h2 className="bebas text-white text-4xl md:text-5xl leading-tight mb-8">
            Capturing the<br />
            <span className="text-[#00ffcc]">Unseen World</span>
          </h2>

          <p className="text-white/50 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
            I'm Alex Voss — a visual artist and photographer based in New York City with over 8 years of experience crafting images that blur the line between reality and imagination.
          </p>
          <p className="text-white/40 text-sm md:text-base leading-relaxed mb-10 max-w-xl">
            My work spans editorial fashion, conceptual fine art, and commercial campaigns for global brands. Every frame is a deliberate act — light, shadow, and emotion converging into a single decisive moment.
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/50 text-xs uppercase tracking-wider hover:border-[#00ffcc]/40 hover:text-[#00ffcc] transition-all duration-300 cursor-default"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-6">
            <button className="group flex items-center gap-3 text-white text-sm uppercase tracking-[0.2em] hover:text-[#00ffcc] transition-colors duration-300 cursor-pointer whitespace-nowrap">
              <span className="border-b border-white/20 group-hover:border-[#00ffcc] pb-0.5 transition-colors duration-300">Download CV</span>
              <i className="ri-download-line group-hover:translate-y-1 transition-transform duration-300" />
            </button>
            <div className="w-px h-6 bg-white/10" />
            <div className="flex items-center gap-4">
              {['instagram', 'behance', 'vimeo'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center border border-white/10 text-white/40 hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all duration-300 cursor-pointer"
                >
                  <i className={`ri-${social}-line text-sm`} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
