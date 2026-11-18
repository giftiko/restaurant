import React, { useState } from 'react';
import { X, LogIn, UserPlus, Flame } from 'lucide-react';
import { AuthUser, login, register } from '../api/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

/**
 * Sign in / create account. Customers and staff use the same form - staff are
 * simply recognised by `isStaff` and gain the kitchen controls afterwards.
 */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const user =
        mode === 'login'
          ? await login(username.trim(), password)
          : await register(username.trim(), password, email.trim());
      onAuthenticated(user);
      setPassword('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const switchMode = (next: 'login' | 'register') => {
    setMode(next);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-[#ffffff] border border-[#ded8cc] rounded-lg shadow-2xl text-[#181716] overflow-hidden">
        <div className="p-5 border-b border-[#e8e3d8] bg-[#fbf9f5] flex items-start justify-between">
          <div className="space-y-0.5">
            <span className="font-serif-display text-lg font-medium block">L'Atelier Hearth</span>
            <span className="text-[11px] text-[#7a7267] font-sans-body">
              {mode === 'login' ? 'Welcome back to the table' : 'Join the hearth table'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-[#7a7267] hover:text-[#181716] hover:bg-[#ede7dc] transition-colors cursor-pointer"
            aria-label="Close sign in"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 bg-[#f4f0e6] border-b border-[#e8e3d8] text-xs">
          <button
            onClick={() => switchMode('login')}
            className={`py-1.5 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-[#ffffff] text-[#181716] font-medium shadow-2xs'
                : 'text-[#665e54] hover:text-[#181716]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign in
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`py-1.5 rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-[#ffffff] text-[#181716] font-medium shadow-2xs'
                : 'text-[#665e54] hover:text-[#181716]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Create account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <label className="block space-y-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#8a8174] font-medium">
              Username
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              autoFocus
              className="w-full px-3 py-2 text-sm bg-[#faf8f5] border border-[#ded8cc] rounded focus:outline-none focus:border-[#9e5a2a]"
            />
          </label>

          {mode === 'register' && (
            <label className="block space-y-1">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#8a8174] font-medium">
                Email <span className="lowercase tracking-normal text-[#b8afa3]">(optional)</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full px-3 py-2 text-sm bg-[#faf8f5] border border-[#ded8cc] rounded focus:outline-none focus:border-[#9e5a2a]"
              />
            </label>
          )}

          <label className="block space-y-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[#8a8174] font-medium">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              className="w-full px-3 py-2 text-sm bg-[#faf8f5] border border-[#ded8cc] rounded focus:outline-none focus:border-[#9e5a2a]"
            />
          </label>

          {error && (
            <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full py-2.5 bg-[#181716] hover:bg-[#2c2927] text-[#ffffff] text-xs font-medium rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Flame className="w-3.5 h-3.5 fill-current text-[#e2b07e]" />
            {busy ? 'One moment…' : mode === 'login' ? 'Sign in' : 'Create account & sign in'}
          </button>

          <p className="text-[10px] text-[#948b80] text-center leading-relaxed">
            Staff use the same form with their kitchen credentials.
          </p>
        </form>
      </div>
    </div>
  );
};
