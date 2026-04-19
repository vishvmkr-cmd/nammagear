'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/lib/auth';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
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

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-[var(--bg-elevated)] border-[0.5px] border-[var(--line-strong)] rounded-2xl p-8 shadow-card">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl font-normal tracking-[-0.025em] text-ink mb-2">
                Welcome back
              </h1>
              <p className="text-sm text-muted">
                Sign in to your NammaGear account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-soft border border-rose/20 rounded-lg text-sm text-rose">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.name@college.edu.in"
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                />
              </div>

              <Button
                type="submit"
                variant="forest"
                size="lg"
                className="w-full justify-center"
                disabled={login.isPending}
              >
                {login.isPending ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-forest-text font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
