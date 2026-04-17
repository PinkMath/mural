import { useState, FormEvent, useEffect } from 'react';

interface Props {
  login: (username: string, password: string) => Promise<boolean>;
  error: string | null;
  clearError: () => void;
  lockoutRemaining: number;
}

const DevLogin = ({ login, error, clearError, lockoutRemaining }: Props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // Clear password field on lockout
  useEffect(() => {
    if (lockoutRemaining > 0) setPassword('');
  }, [lockoutRemaining > 0]);

  const isLocked = lockoutRemaining > 0;
  const lockMins = Math.floor(lockoutRemaining / 60000);
  const lockSecs = Math.floor((lockoutRemaining % 60000) / 1000);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    clearError();
    setLoading(true);
    await login(username, password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")" }} />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 border border-[#00ffcc]/30 flex items-center justify-center mb-6">
            <i className={`text-2xl ${isLocked ? 'ri-lock-2-line text-red-400/60' : 'ri-shield-keyhole-line text-[#00ffcc]/60'}`} />
          </div>
          <h1 className="bebas text-white/90 text-2xl tracking-[0.4em] uppercase mb-1">
            Área Dev
          </h1>
          <p className="text-white/25 text-xs tracking-[0.25em] uppercase">Terceirao — acesso restrito</p>
        </div>

        {/* Lockout banner */}
        {isLocked && (
          <div className="mb-5 bg-red-500/10 border border-red-500/25 px-4 py-3 flex flex-col gap-1.5 items-center text-center">
            <div className="flex items-center gap-2 text-red-400 text-xs">
              <i className="ri-alarm-warning-line" />
              <span className="uppercase tracking-widest">Acesso bloqueado</span>
            </div>
            <p className="text-red-300/60 text-xs">
              Desbloqueio em{' '}
              <span className="tabular-nums text-red-300/90 font-bold">
                {String(lockMins).padStart(2, '0')}:{String(lockSecs).padStart(2, '0')}
              </span>
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-white/30 text-xs tracking-[0.25em] uppercase">Usuário</label>
            <div className="relative">
              <i className="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="usuário"
                required
                disabled={isLocked}
                autoComplete="off"
                className="w-full bg-white/5 border border-white/10 text-white text-sm pl-9 pr-4 py-3 outline-none focus:border-[#00ffcc]/50 transition-colors tracking-wide placeholder:text-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-white/30 text-xs tracking-[0.25em] uppercase">Senha</label>
            <div className="relative">
              <i className="ri-lock-line absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLocked}
                autoComplete="current-password"
                className="w-full bg-white/5 border border-white/10 text-white text-sm pl-9 pr-10 py-3 outline-none focus:border-[#00ffcc]/50 transition-colors tracking-wide placeholder:text-white/15 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                disabled={isLocked}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors cursor-pointer w-5 h-5 flex items-center justify-center disabled:opacity-40"
              >
                <i className={showPass ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'} />
              </button>
            </div>
          </div>

          {error && !isLocked && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-2">
              <i className="ri-error-warning-line text-red-400 text-sm" />
              <p className="text-red-400 text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="mt-2 bg-[#00ffcc] text-black text-xs font-bold uppercase tracking-[0.3em] py-3 hover:bg-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center gap-2"
          >
            {loading ? (
              <><i className="ri-loader-4-line animate-spin" /> Verificando...</>
            ) : isLocked ? (
              <><i className="ri-lock-2-line" /> Bloqueado</>
            ) : (
              <><i className="ri-login-box-line" /> Entrar</>
            )}
          </button>
        </form>

        <p className="text-center text-white/10 text-xs mt-8 tracking-widest">
          Terceirao 2026 — sistema interno
        </p>
      </div>
    </div>
  );
};

export default DevLogin;
