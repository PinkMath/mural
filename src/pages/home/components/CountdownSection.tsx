import { useState, useEffect } from 'react';

// ── Edit these dates to match your school year ──
const SCHOOL_START = new Date('2026-02-02T00:00:00');
const SCHOOL_END   = new Date('2027-01-01T00:00:00');

interface TimeLeft {
  days: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  finished: boolean;
}

const calcTimeLeft = (): TimeLeft => {
  const diff = SCHOOL_END.getTime() - Date.now();
  if (diff <= 0) return { days: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0, finished: true };
  return {
    days:         Math.floor(diff / 86_400_000),
    totalHours:   Math.floor(diff / 3_600_000),
    totalMinutes: Math.floor(diff / 60_000),
    totalSeconds: Math.floor(diff / 1_000),
    finished: false,
  };
};

const calcProgress = (): number => {
  const total   = SCHOOL_END.getTime() - SCHOOL_START.getTime();
  const elapsed = Date.now() - SCHOOL_START.getTime();
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
};

/** Format with BR thousands separator */
const fmt = (n: number) => n.toLocaleString('pt-BR');

interface TotalUnitProps {
  value: number;
  label: string;
  sublabel: string;
  accent?: boolean;
}

const TotalUnit = ({ value, label, sublabel, accent }: TotalUnitProps) => (
  <div className="flex flex-col items-center gap-1.5 py-4 sm:py-5 px-3 sm:px-6 border border-white/6 bg-white/2 flex-1 min-w-0">
    <span className={`text-[9px] sm:text-[10px] tracking-[0.4em] uppercase mb-0.5 ${accent ? 'text-[#00ffcc]/50' : 'text-white/20'}`}>
      {sublabel}
    </span>
    <div className="relative w-full flex items-center justify-center">
      <span
        className={`bebas tabular-nums leading-none text-center ${accent ? 'text-[#00ffcc]' : 'text-white'}`}
        style={{ fontSize: 'clamp(20px, 5.5vw, 38px)', letterSpacing: '-0.01em' }}
      >
        {fmt(value)}
      </span>
      {accent && (
        <span
          className="absolute inset-0 bebas tabular-nums leading-none text-center text-[#00ffcc]/15 blur-sm select-none pointer-events-none"
          style={{ fontSize: 'clamp(20px, 5.5vw, 38px)', letterSpacing: '-0.01em' }}
        >
          {fmt(value)}
        </span>
      )}
    </div>
    <span className="text-white/25 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase">{label}</span>
  </div>
);

const CountdownSection = () => {
  const [time, setTime]         = useState<TimeLeft>(calcTimeLeft);
  const [progress, setProgress] = useState(calcProgress);

  useEffect(() => {
    const id = setInterval(() => {
      setTime(calcTimeLeft());
      setProgress(calcProgress());
    }, 1_000);
    return () => clearInterval(id);
  }, []);

  const endStr   = SCHOOL_END.toLocaleDateString('pt-BR',   { day: '2-digit', month: '2-digit', year: 'numeric' });
  const startStr = SCHOOL_START.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <section className="relative overflow-hidden bg-[#070707] border-y border-white/5 py-14 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 lg:px-24">

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[280px] rounded-full opacity-[0.05]"
          style={{ background: 'radial-gradient(ellipse, #00ffcc 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">

        {/* Label */}
        <div className="flex items-center gap-3 mb-5 md:mb-7">
          <div className="w-6 md:w-8 h-px bg-[#00ffcc]/40" />
          <span className="text-[#00ffcc]/60 text-[10px] uppercase tracking-[0.45em]">Contagem Regressiva</span>
          <div className="w-6 md:w-8 h-px bg-[#00ffcc]/40" />
        </div>

        {/* Title */}
        <h2
          className="bebas text-white leading-none mb-2"
          style={{ fontSize: 'clamp(34px, 8vw, 76px)', letterSpacing: '-0.01em' }}
        >
          Fim do Terceirao
        </h2>
        <p className="dm-serif italic text-white/30 text-sm sm:text-base mb-9 md:mb-11">
          {time.finished ? 'O Terceirao chegou ao fim 🎓' : 'Aproveite cada momento que ainda resta'}
        </p>

        {time.finished ? (
          <div className="text-center py-6">
            <p className="bebas text-[#00ffcc] text-5xl tracking-widest mb-3">FORMADOS!</p>
            <p className="text-white/30 text-sm tracking-widest">Parabéns, turma do Terceirao!</p>
          </div>
        ) : (
          <>
            {/* ── Big day counter ── */}
            <div className="flex flex-col items-center mb-7 md:mb-9">
              <div className="relative mb-1">
                <span
                  className="bebas text-white leading-none tabular-nums"
                  style={{ fontSize: 'clamp(76px, 21vw, 170px)', letterSpacing: '-0.02em' }}
                >
                  {time.days}
                </span>
                <span
                  className="absolute inset-0 bebas text-[#00ffcc]/10 leading-none tabular-nums blur-md select-none pointer-events-none"
                  style={{ fontSize: 'clamp(76px, 21vw, 170px)', letterSpacing: '-0.02em' }}
                >
                  {time.days}
                </span>
              </div>
              <span className="text-white/30 text-xs tracking-[0.5em] uppercase -mt-1">
                {time.days === 1 ? 'dia restante' : 'dias restantes'}
              </span>
            </div>

            {/* ── Total horas / minutos / segundos ── */}
            <div className="w-full flex flex-col sm:flex-row gap-1.5 sm:gap-2 mb-8 md:mb-10">
              <TotalUnit
                value={time.totalHours}
                label="horas"
                sublabel="total"
              />
              <TotalUnit
                value={time.totalMinutes}
                label="minutos"
                sublabel="total"
              />
              <TotalUnit
                value={time.totalSeconds}
                label="segundos"
                sublabel="atualizando ao vivo"
                accent
              />
            </div>

            {/* ── Progress bar ── */}
            <div className="w-full max-w-sm sm:max-w-md mb-4">
              <div className="flex justify-between text-[10px] text-white/20 tracking-[0.3em] uppercase mb-2">
                <span>Início</span>
                <span className="text-[#00ffcc]/50">{progress.toFixed(1)}% concluído</span>
                <span>Fim</span>
              </div>
              <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00ffcc]/60 to-[#00ffcc] rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-white/15 mt-2">
                <span>{startStr}</span>
                <span>{endStr}</span>
              </div>
            </div>
          </>
        )}

        {/* Quote */}
        <div className="mt-4 md:mt-5 flex flex-col items-center gap-2">
          <div className="w-8 h-px bg-white/10" />
          <p className="text-white/20 text-xs tracking-[0.25em] uppercase">
            O tempo passa — as memórias ficam
          </p>
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
