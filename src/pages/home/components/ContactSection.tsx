import { useState, FormEvent } from 'react';

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || '';
    if (message.length > 500) return;

    setSubmitting(true);
    const data = new URLSearchParams();
    const formData = new FormData(form);
    formData.forEach((value, key) => {
      data.append(key, value.toString());
    });

    try {
      await fetch('https://readdy.ai/api/form/d7bk8e0r4h7u93gnpok0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data.toString(),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative bg-[#0a0a0a] py-24 md:py-36 px-6 md:px-16 lg:px-24 overflow-hidden">
      {/* Background ghost text */}
      <div
        className="bebas text-stroke-white select-none pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap hidden lg:block"
        style={{ fontSize: 'clamp(80px, 16vw, 220px)', opacity: 0.04 }}
      >
        CONTACT
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-20 right-20 w-64 h-64 rounded-full border border-[#00ffcc]/5 animate-spin-slow pointer-events-none hidden lg:block" />
      <div className="absolute bottom-20 left-20 w-40 h-40 border border-[#00ffcc]/8 animate-spin-slow pointer-events-none hidden lg:block" style={{ animationDirection: 'reverse', animationDuration: '18s' }} />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#00ffcc]" />
            <span className="text-[#00ffcc] text-xs uppercase tracking-[0.3em]">Get In Touch</span>
            <div className="w-8 h-px bg-[#00ffcc]" />
          </div>
          <h2 className="bebas leading-none mb-4" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>
            <span className="text-white">Let&apos;s Create</span>
          </h2>
          <h2 className="bebas text-stroke leading-none mb-8" style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}>
            Something Bold
          </h2>
          <p className="text-white/40 text-base md:text-lg max-w-lg mx-auto">
            Available for projects, collaborations, and commissions. Let&apos;s make something unforgettable together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left info */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div>
              <div className="text-[#00ffcc] text-[10px] uppercase tracking-[0.3em] mb-2">Email</div>
              <a href="mailto:hello@alexvoss.com" className="text-white text-lg hover:text-[#00ffcc] transition-colors duration-300 cursor-pointer">
                hello@alexvoss.com
              </a>
            </div>
            <div>
              <div className="text-[#00ffcc] text-[10px] uppercase tracking-[0.3em] mb-2">Location</div>
              <div className="text-white/60 text-base">New York City, USA</div>
            </div>
            <div>
              <div className="text-[#00ffcc] text-[10px] uppercase tracking-[0.3em] mb-2">Availability</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00ffcc] animate-pulse" />
                <span className="text-white/60 text-sm">Available for Q2 2025 projects</span>
              </div>
            </div>
            <div>
              <div className="text-[#00ffcc] text-[10px] uppercase tracking-[0.3em] mb-4">Follow</div>
              <div className="flex items-center gap-4">
                {[
                  { icon: 'instagram', label: 'Instagram' },
                  { icon: 'behance', label: 'Behance' },
                  { icon: 'vimeo', label: 'Vimeo' },
                  { icon: 'linkedin', label: 'LinkedIn' },
                ].map(({ icon, label }) => (
                  <a
                    key={icon}
                    href="#"
                    aria-label={label}
                    className="w-10 h-10 flex items-center justify-center border border-white/10 text-white/40 hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all duration-300 cursor-pointer"
                  >
                    <i className={`ri-${icon}-line`} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-6">
                <div className="w-16 h-16 border-2 border-[#00ffcc] flex items-center justify-center">
                  <i className="ri-check-line text-[#00ffcc] text-2xl" />
                </div>
                <h3 className="bebas text-white text-4xl">Message Sent!</h3>
                <p className="text-white/40 text-center max-w-sm">
                  Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[#00ffcc] text-xs uppercase tracking-[0.2em] border-b border-[#00ffcc]/40 hover:border-[#00ffcc] transition-colors duration-300 cursor-pointer"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form
                data-readdy-form
                id="contact-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] text-white/30 block mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#00ffcc] transition-colors duration-300 placeholder-white/20"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.25em] text-white/30 block mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#00ffcc] transition-colors duration-300 placeholder-white/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.25em] text-white/30 block mb-2">Project Type</label>
                  <select
                    name="project_type"
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#00ffcc] transition-colors duration-300 cursor-pointer appearance-none"
                  >
                    <option value="" className="bg-[#1a1a1a]">Select a project type</option>
                    <option value="Editorial" className="bg-[#1a1a1a]">Editorial</option>
                    <option value="Fashion" className="bg-[#1a1a1a]">Fashion</option>
                    <option value="Commercial" className="bg-[#1a1a1a]">Commercial</option>
                    <option value="Fine Art" className="bg-[#1a1a1a]">Fine Art</option>
                    <option value="Portrait" className="bg-[#1a1a1a]">Portrait</option>
                    <option value="Other" className="bg-[#1a1a1a]">Other</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] uppercase tracking-[0.25em] text-white/30">Message</label>
                    <span className={`text-[10px] ${charCount > 450 ? 'text-red-400' : 'text-white/20'}`}>{charCount}/500</span>
                  </div>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    maxLength={500}
                    placeholder="Tell me about your project..."
                    onChange={(e) => setCharCount(e.target.value.length)}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-[#00ffcc] transition-colors duration-300 placeholder-white/20 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#00ffcc] text-black text-xs font-bold uppercase tracking-[0.3em] hover:bg-white transition-colors duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
