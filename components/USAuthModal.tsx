'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, Check, Sparkles, LogIn, UserPlus } from 'lucide-react';

interface USAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  initialMode?: 'signin' | 'signup';
  onSuccess?: (user: any) => void;
}

export default function USAuthModal({
  isOpen,
  onClose,
  initialMode = 'signup',
  onSuccess,
}: USAuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isGoogleStep, setIsGoogleStep] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState<any>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setErrorMessage('');
      setIsSuccess(false);
      setIsGoogleStep(false);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleAuthSubmit = async (
    e?: React.FormEvent,
    customEmail?: string,
    provider = 'email',
    customName?: string
  ) => {
    if (e) e.preventDefault();
    const targetEmail = (customEmail || email).trim();
    const targetName =
      (customName || name).trim() || (mode === 'signup' ? targetEmail.split('@')[0] : '');

    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName || targetEmail.split('@')[0],
          provider,
          mode,
        }),
      });

      const data = await res.json();

      if (data.ok && data.user) {
        localStorage.setItem('stayhelper_user', JSON.stringify(data.user));
        localStorage.setItem('stayhelper_member', JSON.stringify(data.user));
        localStorage.setItem('sh_member_user', JSON.stringify(data.user));
        document.cookie = `stayhelper_user=${encodeURIComponent(
          JSON.stringify(data.user)
        )}; path=/; max-age=2592000; SameSite=Lax`;

        window.dispatchEvent(new Event('stayhelper_auth_changed'));

        setSuccessUser(data.user);
        setIsSuccess(true);

        if (onSuccess) {
          onSuccess(data.user);
        }

        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setIsGoogleStep(false);
          setEmail('');
          setName('');
          setGoogleEmail('');
        }, 1200);
      } else {
        setErrorMessage(data.error || 'Failed to authenticate.');
      }
    } catch {
      const fallbackUser = {
        id: `usr_${Date.now()}`,
        email: targetEmail,
        name: targetName || targetEmail.split('@')[0],
        role: 'user',
        region: 'US',
        provider,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('stayhelper_user', JSON.stringify(fallbackUser));
      localStorage.setItem('stayhelper_member', JSON.stringify(fallbackUser));
      localStorage.setItem('sh_member_user', JSON.stringify(fallbackUser));
      document.cookie = `stayhelper_user=${encodeURIComponent(
        JSON.stringify(fallbackUser)
      )}; path=/; max-age=2592000; SameSite=Lax`;

      window.dispatchEvent(new Event('stayhelper_auth_changed'));
      setSuccessUser(fallbackUser);
      setIsSuccess(true);
      if (onSuccess) onSuccess(fallbackUser);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setIsGoogleStep(false);
        setEmail('');
        setName('');
        setGoogleEmail('');
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    // If email already entered in main input, submit directly
    if (email && email.includes('@')) {
      handleAuthSubmit(undefined, email.trim(), 'google', name.trim());
      return;
    }
    // Otherwise open the Google email input smoothly without error
    setIsGoogleStep(true);
    setErrorMessage('');
  };

  const handleGoogleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail || !googleEmail.includes('@')) {
      setErrorMessage('Please enter your Google / Gmail address.');
      return;
    }
    handleAuthSubmit(undefined, googleEmail.trim(), 'google', googleEmail.split('@')[0]);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[420px] bg-[#FAF9F6] text-[#1F1F24] rounded-3xl border border-[#DFCFA9] p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-stone-200/60 hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-6 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mb-3.5 shadow-sm">
              <Check className="w-7 h-7 text-emerald-600 stroke-[2.5]" />
            </div>
            <h4 className="font-luxury-serif font-bold text-xl text-stone-950">
              {mode === 'signup' ? 'Welcome to Private Club' : 'Welcome Back'},{' '}
              {successUser?.name || 'VIP Member'}
            </h4>
            <p className="text-xs text-stone-600 mt-1.5 max-w-[280px]">
              Complimentary VIP status confirmed. Direct reservation dossiers unlocked.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-full mb-4 w-full max-w-[280px]">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setIsGoogleStep(false);
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-mono font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5 text-[#8F703C]" />
                <span>Join Club</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setIsGoogleStep(false);
                  setErrorMessage('');
                }}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-mono font-medium transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'signin'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-[#8F703C]" />
                <span>Sign In</span>
              </button>
            </div>

            {/* Top Brand Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE7D8] border border-[#DFCFA9] text-[10px] font-mono text-[#8F703C] uppercase tracking-widest font-semibold mb-2">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>
                {mode === 'signup' ? 'Complimentary VIP Access' : 'VIP Member Access'}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h3 className="font-luxury-serif font-semibold text-2xl text-stone-900 tracking-tight">
              {mode === 'signup'
                ? 'Join StayHelper Private Club'
                : 'Sign In to Private Club'}
            </h3>
            <p className="text-xs text-stone-600 mt-1.5 mb-5 max-w-[320px] leading-relaxed font-luxury-sans">
              {mode === 'signup'
                ? 'Unlock direct verified partner booking links, live room availability, and architectural dossiers.'
                : 'Enter your registered email to resume your complimentary VIP sanctuary dossier access.'}
            </p>

            {/* Google Flow */}
            {isGoogleStep ? (
              <form onSubmit={handleGoogleConfirm} className="w-full mb-4 p-4 rounded-2xl bg-white border border-[#4285F4]/40 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-2 mb-2 text-left">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-stone-900">Sign in with Google</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="Enter your Gmail (e.g. name@gmail.com)"
                    autoFocus
                    required
                    className="w-full pl-3 pr-10 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-1 w-7 h-7 rounded-lg bg-[#4285F4] hover:bg-[#3367D6] text-white flex items-center justify-center transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGoogleStep(false)}
                  className="mt-2 text-[10px] text-stone-400 hover:text-stone-600 block text-right w-full cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 font-luxury-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition border border-[#DFCFA9] shadow-xs hover:border-[#8F703C] active:scale-[0.99] cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            )}

            {/* Minimal Divider */}
            <div className="relative w-full my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E7DEC8]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
                <span className="bg-[#FAF9F6] px-3 text-stone-400">or with email</span>
              </div>
            </div>

            {/* Unified Form */}
            <form onSubmit={handleAuthSubmit} className="w-full space-y-3">
              {mode === 'signup' && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name (e.g. Eleanor Vance)"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#E7DEC8] text-stone-900 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#8F703C] focus:border-[#8F703C] transition shadow-xs font-luxury-sans"
                />
              )}

              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    mode === 'signup'
                      ? 'Enter your email address...'
                      : 'Enter your registered email...'
                  }
                  required
                  className="w-full pl-4 pr-12 py-2.5 rounded-xl bg-white border border-[#E7DEC8] text-stone-900 text-xs sm:text-sm placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#8F703C] focus:border-[#8F703C] transition shadow-xs font-luxury-sans"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 w-8 h-8 rounded-lg bg-[#1C1917] hover:bg-black text-[#D4AF37] flex items-center justify-center transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  title={mode === 'signup' ? 'Create VIP Membership' : 'Sign In'}
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {errorMessage && (
                <p className="text-[11px] text-rose-600 mt-1 text-left font-medium">
                  {errorMessage}
                </p>
              )}
            </form>

            {/* Switch Mode Link */}
            <div className="mt-4 text-[11px] text-stone-500 font-luxury-sans">
              {mode === 'signup' ? (
                <span>
                  Already a member?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setIsGoogleStep(false);
                      setErrorMessage('');
                    }}
                    className="text-[#8F703C] font-semibold hover:underline cursor-pointer ml-1"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Need VIP access?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setIsGoogleStep(false);
                      setErrorMessage('');
                    }}
                    className="text-[#8F703C] font-semibold hover:underline cursor-pointer ml-1"
                  >
                    Join Private Club
                  </button>
                </span>
              )}
            </div>

            {/* Discreet Micro-Footer */}
            <div className="mt-2 text-[10px] text-stone-400 font-mono">
              Fast 1-click VIP pass. Zero passwords to remember.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
