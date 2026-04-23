'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { useLogin } from '@/lib/auth';
import { GoogleSignInButton } from '@/components/google-sign-in-button';
import { Eye, EyeOff, Shield, Truck, Wrench } from 'lucide-react';

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  return null;
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const login = useLogin();

  useEffect(() => {
    const code = searchParams?.get('error');
    if (!code) return;
    const messages: Record<string, string> = {
      google_denied: 'Google sign-in was cancelled.',
      google_failed: 'Google sign-in failed. Please try again.',
      google_not_configured:
        'Google sign-in is not configured. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI on the API.',
      google_invalid_state: 'Sign-in expired or invalid. Please try again.',
      google_email_unverified:
        'Your Google account email must be verified before you can sign in.',
    };
    setError(messages[code] || 'Sign-in failed.');
  }, [searchParams]);

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const err = validateEmail(formData.email);
      setFieldErrors(prev => ({ ...prev, email: err || undefined }));
    }
    if (field === 'password') {
      const err = validatePassword(formData.password);
      setFieldErrors(prev => ({ ...prev, password: err || undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);

    if (emailErr || passwordErr) {
      setFieldErrors({ email: emailErr || undefined, password: passwordErr || undefined });
      setTouched({ email: true, password: true });
      return;
    }

    setFieldErrors({});

    try {
      await login.mutateAsync(formData);
      router.push(redirect);
    } catch (err: any) {
      const msg = err.message || 'Login failed';
      if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('not found')) {
        setFieldErrors({ email: 'No account found with this email' });
      } else if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('invalid')) {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        setError(msg);
      }
    }
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-xl text-[15px] bg-[var(--bg-elevated)] text-[var(--ink)] border outline-none transition-all focus:ring-2 focus:ring-[var(--forest)]/10 placeholder:text-[var(--muted-2)]';
  const inputDefault = `${inputClass} border-[var(--line-strong)] focus:border-[var(--forest)]`;
  const inputError = `${inputClass} border-[var(--rose)] focus:border-[var(--rose)]`;
  const labelClass = 'block text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--ink-soft)] mb-2';
  const fieldErrClass = 'text-[12px] text-[var(--rose)] mt-1.5 font-medium';

  return (
    <div className="w-full max-w-[480px]">
      {/* USP Banner */}
      <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 border border-[var(--forest)]/20 bg-[var(--forest-soft)]">
        <Wrench className="w-5 h-5 text-[var(--forest)] flex-shrink-0" />
        <p className="text-[13px] font-medium text-[var(--forest-text)]">
          Buy from Student Gear Shop &amp; get <strong>1-year doorstep service</strong> included
        </p>
      </div>

      {/* Card */}
      <div className="bg-[var(--bg-elevated)] border border-[var(--line-strong)] rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="p-7 sm:p-8">
          {/* Header */}
          <div className="text-center mb-7">
            <h1 className="font-serif text-[28px] font-normal tracking-tight text-[var(--ink)]">
              Welcome
            </h1>
            <p className="text-[14px] text-[var(--muted)] mt-1.5">
              Sign in to your Student Gear Shop account
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl text-[13px] font-medium bg-[var(--rose-soft)] text-[var(--rose)] border border-[var(--rose)]/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className={labelClass}>Email address</label>
              <input
                type="email"
                autoFocus
                value={formData.email}
                onChange={e => {
                  setFormData(prev => ({ ...prev, email: e.target.value }));
                  if (touched.email) {
                    const err = validateEmail(e.target.value);
                    setFieldErrors(prev => ({ ...prev, email: err || undefined }));
                  }
                }}
                onBlur={() => handleBlur('email')}
                placeholder="you@example.com"
                className={touched.email && fieldErrors.email ? inputError : inputDefault}
              />
              {touched.email && fieldErrors.email && (
                <p className={fieldErrClass}>{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    if (touched.password) {
                      const err = validatePassword(e.target.value);
                      setFieldErrors(prev => ({ ...prev, password: err || undefined }));
                    }
                  }}
                  onBlur={() => handleBlur('password')}
                  placeholder="Enter your password"
                  className={`${touched.password && fieldErrors.password ? inputError : inputDefault} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <p className={fieldErrClass}>{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full py-4 rounded-xl text-[15px] font-semibold text-white bg-[var(--forest)] transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {login.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[var(--line)]" />
            <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-2)]">or</span>
            <div className="flex-1 h-px bg-[var(--line)]" />
          </div>

          <GoogleSignInButton nextPath={redirect} />

          {/* Links */}
          <div className="mt-6 text-center space-y-2.5">
            <p className="text-[13px] text-[var(--muted)]">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-[var(--forest-text)] font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-5 mt-6 pt-5 border-t border-[var(--line)]">
            {[
              { icon: <Wrench className="w-3.5 h-3.5" />, text: '1-yr service' },
              { icon: <Truck className="w-3.5 h-3.5" />, text: 'Fast delivery' },
              { icon: <Shield className="w-3.5 h-3.5" />, text: 'Verified sellers' },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-[var(--forest-text)] font-medium">
                {t.icon}
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Continue as guest */}
      <div className="text-center mt-5">
        <Link href="/browse" className="text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
          Skip for now — <span className="underline">browse as guest</span>
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen flex items-center justify-center py-10 px-4">
        <Suspense fallback={<div className="text-center text-[var(--muted)] py-12">Loading...</div>}>
          <SignInForm />
        </Suspense>
      </main>
    </>
  );
}
