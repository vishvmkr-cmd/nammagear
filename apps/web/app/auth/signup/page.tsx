'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { useSignup } from '@/lib/auth';
import { isBangalorePincode, PINCODE_AREA_HINTS } from '@/lib/bangalore';
import { Check, ChevronRight, Eye, EyeOff, Shield, Truck, Wrench, ArrowLeft } from 'lucide-react';

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: 'Weak', color: '#fb7185' };
  if (score <= 2) return { score: 2, label: 'Fair', color: '#f59e0b' };
  if (score <= 3) return { score: 3, label: 'Good', color: '#fbbf24' };
  if (score <= 4) return { score: 4, label: 'Strong', color: '#34d399' };
  return { score: 5, label: 'Very strong', color: '#10b981' };
}

export default function SignUpPage() {
  const router = useRouter();
  const signup = useSignup();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '', password: '', name: '', pincode: '', phone: '', college: '',
  });
  const [pincodeInfo, setPincodeInfo] = useState('');

  const pwStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const canProceedStep1 = formData.email.includes('@') && formData.password.length >= 8;

  const handlePincodeChange = (val: string) => {
    setFormData(prev => ({ ...prev, pincode: val }));
    if (val.length === 6) {
      if (isBangalorePincode(val)) {
        const hint = PINCODE_AREA_HINTS[val];
        setPincodeInfo(hint ? `${hint} — service available` : 'Bangalore — service available');
      } else {
        setPincodeInfo('Not in our service area — use a Bangalore pincode (560001–560103)');
      }
    } else {
      setPincodeInfo('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.phone) { setError('Phone number is required for delivery & service support'); return; }
    if (!isBangalorePincode(formData.pincode)) {
      setError('We currently serve Bangalore only. Please enter a valid pincode (560001–560103).');
      return;
    }
    try {
      await signup.mutateAsync(formData);
      router.push('/browse');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    }
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-xl text-[15px] bg-[var(--bg-elevated)] text-[var(--ink)] border border-[var(--line-strong)] outline-none transition-all focus:border-[var(--forest)] focus:ring-2 focus:ring-[var(--forest)]/10 placeholder:text-[var(--muted-2)]';
  const labelClass = 'block text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--ink-soft)] mb-2';
  const hintClass = 'text-[12px] text-[var(--muted)] mt-1.5 leading-snug';

  return (
    <>
      <Nav />
      <main className="flex-1 min-h-screen flex items-center justify-center py-10 px-4">
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
            {/* Progress bar */}
            <div className="h-1 bg-[var(--bg-muted)]">
              <div
                className="h-full bg-[var(--forest)] transition-all duration-500 ease-out"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>

            <div className="p-7 sm:p-8">
              {/* Header */}
              <div className="text-center mb-7">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="absolute left-7 top-[72px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h1 className="font-serif text-[28px] font-normal tracking-tight text-[var(--ink)]">
                  {step === 1 ? 'Create your account' : 'Almost there'}
                </h1>
                <p className="text-[14px] text-[var(--muted)] mt-1.5">
                  {step === 1
                    ? 'Step 1 of 2 — Email & password'
                    : 'Step 2 of 2 — Your details'}
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl text-[13px] font-medium bg-[var(--rose-soft)] text-[var(--rose)] border border-[var(--rose)]/20">
                  {error}
                </div>
              )}

              {/* ── STEP 1: Email + Password ── */}
              {step === 1 && (
                <div className="space-y-5">
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
                    <p className={hintClass}>Any email works. College email gets you a verified badge.</p>
                  </div>

                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Minimum 8 characters"
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

                    {/* Strength meter */}
                    {formData.password.length > 0 && (
                      <div className="mt-2.5">
                        <div className="flex gap-1 mb-1.5">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              className="h-[3px] flex-1 rounded-full transition-colors duration-300"
                              style={{ background: i <= pwStrength.score ? pwStrength.color : 'var(--line-strong)' }}
                            />
                          ))}
                        </div>
                        <p className="text-[11px] font-medium" style={{ color: pwStrength.color }}>
                          {pwStrength.label}
                          {pwStrength.score < 3 && (
                            <span className="text-[var(--muted)] font-normal"> — try uppercase, numbers, or symbols</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Google login placeholder */}
                  <div className="relative flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-[var(--line)]" />
                    <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-2)]">or</span>
                    <div className="flex-1 h-px bg-[var(--line)]" />
                  </div>

                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl text-[14px] font-medium border border-[var(--line-strong)] bg-[var(--bg)] text-[var(--ink)] transition-all hover:border-[var(--ink)] hover:bg-[var(--bg-muted)]"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continue with Google
                  </button>

                  <button
                    type="button"
                    disabled={!canProceedStep1}
                    onClick={() => { setError(''); setStep(2); }}
                    className="w-full py-4 rounded-xl text-[15px] font-semibold text-white bg-[var(--forest)] transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-[13px] text-[var(--muted)]">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="text-[var(--forest-text)] font-semibold hover:underline">Sign in</Link>
                  </p>
                </div>
              )}

              {/* ── STEP 2: Details ── */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className={labelClass}>Full name</label>
                    <input
                      type="text"
                      required
                      autoFocus
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Aditya Patel"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Phone number <span className="text-[var(--rose)] normal-case tracking-normal">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-[var(--line-strong)] bg-[var(--bg-muted)] text-[13px] text-[var(--muted)] font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                        placeholder="98765 43210"
                        className={`${inputClass} rounded-l-none`}
                      />
                    </div>
                    <p className={hintClass}>Required for delivery coordination &amp; service support</p>
                  </div>

                  <div>
                    <label className={labelClass}>Bangalore pincode</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={e => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                      placeholder="560095"
                      className={inputClass}
                    />
                    {pincodeInfo ? (
                      <p className={`text-[12px] mt-1.5 font-medium flex items-center gap-1.5 ${
                        isBangalorePincode(formData.pincode)
                          ? 'text-[var(--forest-text)]'
                          : 'text-[var(--rose)]'
                      }`}>
                        {isBangalorePincode(formData.pincode) && <Check className="w-3.5 h-3.5" />}
                        {pincodeInfo}
                      </p>
                    ) : (
                      <p className={hintClass}>We currently serve Bangalore only. Enter pincode to verify availability.</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>College / Institution <span className="text-[var(--muted-2)] normal-case tracking-normal font-normal">(optional)</span></label>
                    <input
                      type="text"
                      value={formData.college}
                      onChange={e => setFormData(prev => ({ ...prev, college: e.target.value }))}
                      placeholder="e.g. IIIT Bangalore"
                      className={inputClass}
                    />
                    <p className={hintClass}>College users get a verified badge for faster trust.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={signup.isPending}
                    className="w-full py-4 rounded-xl text-[15px] font-semibold text-white bg-[var(--forest)] transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {signup.isPending ? 'Creating account...' : 'Create account & start buying'}
                  </button>

                  {/* Trust signals */}
                  <div className="flex flex-col gap-2 pt-1">
                    {[
                      { icon: <Wrench className="w-3.5 h-3.5" />, text: '1-year doorstep service included' },
                      { icon: <Truck className="w-3.5 h-3.5" />, text: 'Bangalore-based fast delivery' },
                      { icon: <Shield className="w-3.5 h-3.5" />, text: 'Trusted local sellers, verified listings' },
                    ].map((t, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-[12px] text-[var(--forest-text)] font-medium">
                        {t.icon}
                        {t.text}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-center text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors pt-1"
                  >
                    ← Back to step 1
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Continue as guest */}
          <div className="text-center mt-5">
            <Link href="/browse" className="text-[13px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors">
              Skip for now — <span className="underline">browse as guest</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
