const items = [
  'Photography', '—', 'Visual Storytelling', '—', 'Fine Art', '—',
  'Editorial', '—', 'Commercial', '—', 'Conceptual', '—',
  'Photography', '—', 'Visual Storytelling', '—', 'Fine Art', '—',
  'Editorial', '—', 'Commercial', '—', 'Conceptual', '—',
];

const MarqueeStrip = () => (
  <div className="bg-[#00ffcc] py-4 overflow-hidden">
    <div className="flex animate-marquee whitespace-nowrap">
      {items.map((item, i) => (
        <span
          key={i}
          className={`bebas text-2xl tracking-widest mx-6 ${
            item === '—' ? 'text-black/30' : 'text-black'
          }`}
        >
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default MarqueeStrip;
