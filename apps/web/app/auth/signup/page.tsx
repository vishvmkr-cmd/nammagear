'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { useSignup } from '@/lib/auth';
import { GoogleSignInButton } from '@/components/google-sign-in-button';
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

type FieldErrors = {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  pincode?: string;
};

function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address';
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must include at least one number';
  return null;
}

function validateName(name: string): string | null {
  if (!name.trim()) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  if (name.trim().length > 50) return 'Name must be under 50 characters';
  return null;
}

function validatePhone(phone: string): string | null {
  if (!phone) return 'Phone number is required for delivery & service support';
  if (!/^[6-9]\d{9}$/.test(phone)) return 'Enter a valid 10-digit Indian mobile number starting with 6-9';
  return null;
}

function validatePincode(pincode: string): string | null {
  if (!pincode) return 'Pincode is required';
  if (!/^\d{6}$/.test(pincode)) return 'Pincode must be 6 digits';
  if (!isBangalorePincode(pincode)) return 'We currently serve Bangalore only (560001–560103)';
  return null;
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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const pwStrength = useMemo(() => getPasswordStrength(formData.password), [formData.password]);

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let err: string | null = null;
    switch (field) {
      case 'email': err = validateEmail(formData.email); break;
      case 'password': err = validatePassword(formData.password); break;
      case 'name': err = validateName(formData.name); break;
      case 'phone': err = validatePhone(formData.phone); break;
      case 'pincode': err = validatePincode(formData.pincode); break;
    }
    setFieldErrors(prev => ({ ...prev, [field]: err || undefined }));
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      let err: string | null = null;
      switch (field) {
        case 'email': err = validateEmail(value); break;
        case 'password': err = validatePassword(value); break;
        case 'name': err = validateName(value); break;
        case 'phone': err = validatePhone(value); break;
        case 'pincode': err = validatePincode(value); break;
      }
      setFieldErrors(prev => ({ ...prev, [field]: err || undefined }));
    }
  };

  const canProceedStep1 = !validateEmail(formData.email) && !validatePassword(formData.password);

  const handleProceedStep1 = () => {
    const emailErr = validateEmail(formData.email);
    const passwordErr = validatePassword(formData.password);

    if (emailErr || passwordErr) {
      setFieldErrors(prev => ({ ...prev, email: emailErr || undefined, password: passwordErr || undefined }));
      setTouched(prev => ({ ...prev, email: true, password: true }));
      return;
    }

    setError('');
    setStep(2);
  };

  const handlePincodeChange = (val: string) => {
    handleFieldChange('pincode', val);
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

    const nameErr = validateName(formData.name);
    const phoneErr = validatePhone(formData.phone);
    const pincodeErr = validatePincode(formData.pincode);

    if (nameErr || phoneErr || pincodeErr) {
      setFieldErrors(prev => ({
        ...prev,
        name: nameErr || undefined,
        phone: phoneErr || undefined,
        pincode: pincodeErr || undefined,
      }));
      setTouched(prev => ({ ...prev, name: true, phone: true, pincode: true }));
      return;
    }

    try {
      await signup.mutateAsync(formData);
      router.push('/browse');
    } catch (err: any) {
      const msg = err.message || 'Signup failed';
      if (msg.toLowerCase().includes('email') && msg.toLowerCase().includes('exist')) {
        setFieldErrors(prev => ({ ...prev, email: 'This email is already registered. Try signing in.' }));
        setStep(1);
      } else {
        setError(msg);
      }
    }
  };

  const inputClass = 'w-full px-4 py-3.5 rounded-xl text-[15px] bg-[var(--bg-elevated)] text-[var(--ink)] border outline-none transition-all focus:ring-2 focus:ring-[var(--forest)]/10 placeholder:text-[var(--muted-2)]';
  const inputDefault = `${inputClass} border-[var(--line-strong)] focus:border-[var(--forest)]`;
  const inputError = `${inputClass} border-[var(--rose)] focus:border-[var(--rose)]`;
  const labelClass = 'block text-[12px] font-semibold tracking-[0.08em] uppercase text-[var(--ink-soft)] mb-2';
  const hintClass = 'text-[12px] text-[var(--muted)] mt-1.5 leading-snug';
  const fieldErrClass = 'text-[12px] text-[var(--rose)] mt-1.5 font-medium';

  const getInputClass = (field: string) =>
    touched[field] && fieldErrors[field as keyof FieldErrors] ? inputError : inputDefault;

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
                      autoFocus
                      value={formData.email}
                      onChange={e => handleFieldChange('email', e.target.value)}
                      onBlur={() => handleBlur('email')}
                      placeholder="you@example.com"
                      className={getInputClass('email')}
                    />
                    {touched.email && fieldErrors.email ? (
                      <p className={fieldErrClass}>{fieldErrors.email}</p>
                    ) : (
                      <p className={hintClass}>Any email works. College email gets you a verified badge.</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e => handleFieldChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        placeholder="Minimum 8 characters"
                        className={`${getInputClass('password')} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                      </button>
                    </div>
                    {touched.password && fieldErrors.password ? (
                      <p className={fieldErrClass}>{fieldErrors.password}</p>
                    ) : null}

                    {/* Strength meter */}
                    {formData.password.length > 0 && !fieldErrors.password && (
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

                    {/* Password requirements */}
                    {formData.password.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {[
                          { test: formData.password.length >= 8, label: 'At least 8 characters' },
                          { test: /[A-Z]/.test(formData.password), label: 'One uppercase letter' },
                          { test: /[0-9]/.test(formData.password), label: 'One number' },
                          { test: /[^A-Za-z0-9]/.test(formData.password), label: 'One special character (recommended)' },
                        ].map((req, i) => (
                          <div key={i} className="flex items-center gap-2 text-[11px]">
                            <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${req.test ? 'bg-[var(--forest-soft)] text-[var(--forest-text)]' : 'bg-[var(--bg-muted)] text-[var(--muted)]'}`}>
                              {req.test && <Check className="w-2.5 h-2.5" />}
                            </span>
                            <span className={req.test ? 'text-[var(--forest-text)]' : 'text-[var(--muted)]'}>{req.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Google OAuth */}
                  <div className="relative flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-[var(--line)]" />
                    <span className="text-[11px] uppercase tracking-[0.1em] text-[var(--muted-2)]">or</span>
                    <div className="flex-1 h-px bg-[var(--line)]" />
                  </div>

                  <GoogleSignInButton nextPath="/browse" />

                  <button
                    type="button"
                    onClick={handleProceedStep1}
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
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label className={labelClass}>Full name</label>
                    <input
                      type="text"
                      autoFocus
                      value={formData.name}
                      onChange={e => handleFieldChange('name', e.target.value)}
                      onBlur={() => handleBlur('name')}
                      placeholder="Aditya Patel"
                      className={getInputClass('name')}
                    />
                    {touched.name && fieldErrors.name && (
                      <p className={fieldErrClass}>{fieldErrors.name}</p>
                    )}
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
                        maxLength={10}
                        value={formData.phone}
                        onChange={e => handleFieldChange('phone', e.target.value.replace(/\D/g, ''))}
                        onBlur={() => handleBlur('phone')}
                        placeholder="98765 43210"
                        className={`${getInputClass('phone')} rounded-l-none`}
                      />
                    </div>
                    {touched.phone && fieldErrors.phone ? (
                      <p className={fieldErrClass}>{fieldErrors.phone}</p>
                    ) : (
                      <p className={hintClass}>Required for delivery coordination &amp; service support</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>Bangalore pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={e => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
                      onBlur={() => handleBlur('pincode')}
                      placeholder="560095"
                      className={getInputClass('pincode')}
                    />
                    {touched.pincode && fieldErrors.pincode ? (
                      <p className={fieldErrClass}>{fieldErrors.pincode}</p>
                    ) : pincodeInfo ? (
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
                      className={inputDefault}
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
