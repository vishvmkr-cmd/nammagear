'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Nav } from '@/components/nav';
import { Button } from '@/components/ui/button';
import { useSignup } from '@/lib/auth';
import { Check } from 'lucide-react';

const BANGALORE_PINCODES: Record<string, string> = {
  '560001': 'Bangalore GPO',
  '560002': 'Bangalore City Market',
  '560003': 'Gandhinagar',
  '560027': 'BTM Layout',
  '560029': 'JP Nagar',
  '560030': 'Jayanagar',
  '560034': 'HSR Layout',
  '560035': 'Banashankari',
  '560038': 'Banashankari',
  '560043': 'Koramangala',
  '560047': 'Koramangala',
  '560066': 'Marathahalli',
  '560068': 'Koramangala',
  '560076': 'Electronic City',
  '560085': 'Indiranagar',
  '560092': 'Whitefield',
  '560093': 'Marathahalli',
  '560095': 'Koramangala',
  '560102': 'Yelahanka',
  '560103': 'Jala Hobli',
};

export default function SignUpPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    pincode: '',
    phone: '',
    college: '',
  });
  const [pincodeInfo, setPincodeInfo] = useState('');
  const [error, setError] = useState('');

  const signup = useSignup();

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value;
    setFormData({ ...formData, pincode });
    
    if (pincode.length === 6) {
      if (BANGALORE_PINCODES[pincode]) {
        setPincodeInfo(`${BANGALORE_PINCODES[pincode]} · Bangalore verified`);
      } else {
        setPincodeInfo('Not a valid Bangalore pincode');
      }
    } else {
      setPincodeInfo('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!BANGALORE_PINCODES[formData.pincode]) {
      setError('Invalid Bangalore pincode');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await signup.mutateAsync(formData);
      router.push('/browse');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
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
                Join NammaGear
              </h1>
              <p className="text-sm text-muted">
                Create your account to start buying and selling
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-soft border border-rose/20 rounded-lg text-sm text-rose">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Aditya Patel"
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                />
              </div>

              <div>
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  College Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.name@college.edu.in"
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                />
                <p className="text-xs text-muted mt-1.5">Use your college email for verification</p>
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
                <p className="text-xs text-muted mt-1.5">Minimum 8 characters</p>
              </div>

              <div>
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Bangalore Pincode
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handlePincodeChange}
                  placeholder="560095"
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                />
                {pincodeInfo && (
                  <div className="text-xs mt-2 flex items-center gap-1.5 font-medium">
                    {BANGALORE_PINCODES[formData.pincode] ? (
                      <span className="text-forest-text flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {pincodeInfo}
                      </span>
                    ) : (
                      <span className="text-rose">{pincodeInfo}</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="9876543210"
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                />
                <p className="text-xs text-muted mt-1.5">For WhatsApp contact by buyers</p>
              </div>

              <div>
                <label className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted block mb-2 font-medium">
                  College (Optional)
                </label>
                <input
                  type="text"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="IIIT Bangalore"
                  className="w-full px-[15px] py-3 border-[0.5px] border-[var(--line-strong)] rounded-[10px] font-sans text-sm bg-[var(--form-bg)] text-ink outline-none transition-colors focus:border-forest focus:bg-[var(--bg-elevated)]"
                />
              </div>

              <Button
                type="submit"
                variant="forest"
                size="lg"
                className="w-full justify-center mt-6"
                disabled={signup.isPending}
              >
                {signup.isPending ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-forest-text font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
