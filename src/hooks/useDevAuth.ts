import { useState, useCallback, useEffect } from 'react';

// ─── Session config ──────────────────────────────────────────────
const SESSION_KEY   = '__tc_s';          // session token key
const ATTEMPTS_KEY  = '__tc_a';          // failed attempts key
const SESSION_TTL   = 8 * 60 * 60 * 1000;   // 8h in ms
const LOCKOUT_TTL   = 10 * 60 * 1000;        // 10 min lockout
const MAX_ATTEMPTS  = 5;

// ─── Credential verification (obfuscated, not plaintext) ─────────
const _c = (u: string, p: string): boolean => {
  try {
    const eu = atob('YW5h');          // ana
    const ep = atob('bXVyYWwyMDI2'); // mural2026
    return u.trim() === eu && p === ep;
  } catch {
    return false;
  }
};

// ─── Session token helpers ────────────────────────────────────────
const generateToken = (): string => {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
};

interface SessionPayload { token: string; exp: number; }

const readSession = (): SessionPayload | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed: SessionPayload = JSON.parse(raw);
    if (Date.now() > parsed.exp) {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const writeSession = (): string => {
  const payload: SessionPayload = {
    token: generateToken(),
    exp: Date.now() + SESSION_TTL,
  };
  const raw = JSON.stringify(payload);
  sessionStorage.setItem(SESSION_KEY, raw);
  localStorage.setItem(SESSION_KEY, raw);
  return payload.token;
};

const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
};

// ─── Rate-limit helpers ───────────────────────────────────────────
interface AttemptsPayload { count: number; lockedUntil: number; }

const readAttempts = (): AttemptsPayload => {
  try {
    const raw = sessionStorage.getItem(ATTEMPTS_KEY) ?? localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { count: 0, lockedUntil: 0 };
    return JSON.parse(raw);
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
};

const writeAttempts = (data: AttemptsPayload) => {
  const raw = JSON.stringify(data);
  sessionStorage.setItem(ATTEMPTS_KEY, raw);
  localStorage.setItem(ATTEMPTS_KEY, raw);
};

const clearAttempts = () => {
  sessionStorage.removeItem(ATTEMPTS_KEY);
  localStorage.removeItem(ATTEMPTS_KEY);
};

// ─── Hook ─────────────────────────────────────────────────────────
export const useDevAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!readSession());
  const [error, setError] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Tick lockout countdown
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const id = setInterval(() => {
      const { lockedUntil } = readAttempts();
      const remaining = Math.max(0, lockedUntil - Date.now());
      setLockoutRemaining(remaining);
      if (remaining === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [lockoutRemaining]);

  // Init lockout state
  useEffect(() => {
    const { lockedUntil } = readAttempts();
    const remaining = Math.max(0, lockedUntil - Date.now());
    if (remaining > 0) setLockoutRemaining(remaining);
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    const attempts = readAttempts();

    // Check lockout
    const remaining = Math.max(0, attempts.lockedUntil - Date.now());
    if (remaining > 0) {
      setLockoutRemaining(remaining);
      const mins = Math.ceil(remaining / 60000);
      setError(`Conta bloqueada. Tente novamente em ${mins} min.`);
      return false;
    }

    // Artificial delay (timing attack mitigation)
    await new Promise(r => setTimeout(r, 500 + Math.random() * 300));

    if (_c(username, password)) {
      writeSession();
      clearAttempts();
      setIsAuthenticated(true);
      setError(null);
      setLockoutRemaining(0);
      return true;
    }

    // Wrong credentials
    const newCount = attempts.count + 1;
    const lockedUntil = newCount >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_TTL : 0;
    writeAttempts({ count: newCount, lockedUntil });

    const left = MAX_ATTEMPTS - newCount;
    if (lockedUntil > 0) {
      setLockoutRemaining(LOCKOUT_TTL);
      setError(`Muitas tentativas. Bloqueado por 10 minutos.`);
    } else {
      setError(`Usuário ou senha incorretos. ${left} tentativa${left !== 1 ? 's' : ''} restante${left !== 1 ? 's' : ''}.`);
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    clearAttempts();
    setIsAuthenticated(false);
    setError(null);
    setLockoutRemaining(0);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isAuthenticated, login, logout, error, clearError, lockoutRemaining };
};
