'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { useLogin } from '@/lib/auth';
import { Eye, EyeOff, Shield, Truck, Wrench } from 'lucide-react';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const login = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login.mutateAsync(formData);
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-xl text-[15px] bg-[var(--bg-elevated)] text-[var(--ink)] border border-[var(--line-strong)] outline-none transition-all focus:border-[var(--forest)] focus:ring-2 focus:ring-[var(--forest)]/10 placeholder:text-[var(--muted-2)]';
  const labelClass = 'block text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--ink-soft)] mb-2';

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Email address</label>
              <input
                type="email"
                required
                autoFocus
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
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

          {/* Google */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-medium border border-[var(--line-strong)] bg-[var(--bg)] text-[var(--ink)] transition-all hover:border-[var(--ink)] hover:bg-[var(--bg-muted)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

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
