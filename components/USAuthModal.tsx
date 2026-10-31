'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Loader2, Check, Sparkles, LogIn, UserPlus } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
  }
}

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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successUser, setSuccessUser] = useState<any>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    '';

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setErrorMessage('');
      setInfoMessage('');
      setIsSuccess(false);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load official Google Identity Services Script
  useEffect(() => {
    if (!isOpen) return;

    const loadGoogleScript = () => {
      if (document.getElementById('google-gsi-client')) return;
      const script = document.createElement('script');
      script.id = 'google-gsi-client';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleSignIn();
      };
      document.body.appendChild(script);
    };

    const initGoogleSignIn = () => {
      if (!window.google?.accounts?.id || !googleClientId) return;

      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 320,
            text: mode === 'signup' ? 'signup_with' : 'signin_with',
            shape: 'pill',
          });
        }
      } catch (err) {
        console.error('Google Sign-In Init Error:', err);
      }
    };

    if (window.google?.accounts?.id) {
      initGoogleSignIn();
    } else {
      loadGoogleScript();
    }
  }, [isOpen, mode, googleClientId]);

  // Handle Google Credential Response (from real Google OAuth)
  const handleGoogleCredentialResponse = async (response: any) => {
    if (!response || !response.credential) {
      setErrorMessage('Google authentication could not be completed.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();
      if (data.ok && data.user) {
        handleAuthSuccess(data.user);
      } else {
        setErrorMessage(data.error || 'Failed to authenticate with Google.');
      }
    } catch {
      setErrorMessage('Network error during Google authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (user: any) => {
    localStorage.setItem('stayhelper_user', JSON.stringify(user));
    localStorage.setItem('stayhelper_member', JSON.stringify(user));
    localStorage.setItem('sh_member_user', JSON.stringify(user));
    document.cookie = `stayhelper_user=${encodeURIComponent(
      JSON.stringify(user)
    )}; path=/; max-age=2592000; SameSite=Lax`;

    window.dispatchEvent(new Event('stayhelper_auth_changed'));

    setSuccessUser(user);
    setIsSuccess(true);

    if (onSuccess) onSuccess(user);

    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setEmail('');
      setName('');
    }, 1200);
  };

  // Google Click Trigger (Real Popup or OAuth Redirect)
  const handleGoogleClick = () => {
    setErrorMessage('');
    setInfoMessage('');

    if (!googleClientId) {
      setInfoMessage(
        'Google OAuth 2.0 Web Client ID is being configured in Google Cloud Console. In the meantime, use the Instant VIP Pass below.'
      );
      return;
    }

    // Try Google Identity Services token client popup
    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              setLoading(true);
              try {
                const profileRes = await fetch(
                  'https://www.googleapis.com/oauth2/v3/userinfo',
                  {
                    headers: {
                      Authorization: `Bearer ${tokenResponse.access_token}`,
                    },
                  }
                );
                const profile = await profileRes.json();
                if (profile?.email) {
                  const vipUser = {
                    id: `usr_g_${profile.sub || Date.now()}`,
                    email: profile.email,
                    name: profile.name || profile.email.split('@')[0],
                    picture: profile.picture,
                    role: 'vip',
                    region: 'US',
                    provider: 'google',
                    createdAt: new Date().toISOString(),
                  };
                  handleAuthSuccess(vipUser);
                }
              } catch {
                setErrorMessage('Failed to fetch Google profile.');
              } finally {
                setLoading(false);
              }
            }
          },
        });
        client.requestAccessToken();
        return;
      } catch (e) {
        console.error('GIS token error, falling back to popup redirect', e);
      }
    }

    // Fallback: Real Google OAuth 2.0 Redirect
    const redirectUri = `${window.location.origin}/api/auth/callback/google`;
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('openid email profile')}` +
      `&prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  // Email Submit
  const handleAuthSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEmail = email.trim();
    const targetName =
      name.trim() || (mode === 'signup' ? targetEmail.split('@')[0] : '');

    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setInfoMessage('');

    try {
      const res = await fetch('/api/auth/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          name: targetName || targetEmail.split('@')[0],
          provider: 'email',
          mode,
        }),
      });

      const data = await res.json();
      if (data.ok && data.user) {
        handleAuthSuccess(data.user);
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
        provider: 'email',
        createdAt: new Date().toISOString(),
      };
      handleAuthSuccess(fallbackUser);
    } finally {
      setLoading(false);
    }
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
                  setErrorMessage('');
                  setInfoMessage('');
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
                  setErrorMessage('');
                  setInfoMessage('');
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

            {/* Official Google Button Container */}
            <div className="w-full mb-3 flex flex-col items-center">
              <button
                type="button"
                onClick={handleGoogleClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-white border border-[#DFCFA9] hover:border-[#8F703C] shadow-sm hover:shadow transition-all duration-200 text-xs font-luxury-sans font-semibold text-stone-800 cursor-pointer disabled:opacity-60"
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

              {/* Native Google One Tap Button Mount (hidden when rendered) */}
              <div ref={googleBtnRef} className="hidden" />
            </div>

            {/* Info Message (if Google Client ID pending) */}
            {infoMessage && (
              <p className="text-[11px] text-[#8F703C] bg-[#F5EEDD] border border-[#DFCFA9] rounded-xl px-3 py-2 mb-3 text-left w-full leading-normal">
                💡 {infoMessage}
              </p>
            )}

            {/* Divider */}
            <div className="w-full flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-stone-300/80" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-stone-500">
                Or with Email
              </span>
              <div className="flex-1 h-px bg-stone-300/80" />
            </div>

            {/* Email Form */}
            <form onSubmit={handleAuthSubmit} className="w-full space-y-3 mt-2">
              {mode === 'signup' && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name (e.g. Eleanor Vance)"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#DFCFA9] text-stone-900 text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8F703C]/30 focus:border-[#8F703C] shadow-xs"
                />
              )}

              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white border border-[#DFCFA9] text-stone-900 text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8F703C]/30 focus:border-[#8F703C] shadow-xs"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 w-9 h-9 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#DFCFA9] flex items-center justify-center transition active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
                  aria-label="Submit"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-600 font-medium pt-1 text-center">
                  {errorMessage}
                </p>
              )}
            </form>

            {/* Footer switcher */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setErrorMessage('');
                  setInfoMessage('');
                }}
                className="text-xs text-stone-600 hover:text-stone-900 font-luxury-sans transition cursor-pointer"
              >
                {mode === 'signup' ? (
                  <>
                    Already a member?{' '}
                    <span className="font-semibold text-[#8F703C] underline underline-offset-2">
                      Sign In
                    </span>
                  </>
                ) : (
                  <>
                    New to StayHelper?{' '}
                    <span className="font-semibold text-[#8F703C] underline underline-offset-2">
                      Join Private Club
                    </span>
                  </>
                )}
              </button>
              <p className="text-[10px] font-mono text-stone-500 mt-2">
                Fast 1-click VIP pass. Zero passwords to remember.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
