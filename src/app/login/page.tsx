'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight, Shield, Sparkles, UserCheck } from 'lucide-react';
import { MitraDoodleAvatar } from '@/components/illustrations/MitraDoodleAvatar';

export default function LoginPage() {
  const router = useRouter();
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState('Hostel Superintendent');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setLoading(true);
    // Store user session identifiers
    window.localStorage.setItem('mitra:userName', nameInput.trim());
    window.localStorage.setItem('mitra:userRole', roleInput);
    
    setTimeout(() => {
      router.push('/today');
    }, 600);
  };

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-cloud px-6 py-10">
      <div className="w-full max-w-sm space-y-6 text-center">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center space-y-3"
        >
          <MitraDoodleAvatar size={76} />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-morning-sun/20 px-3 py-1 text-xs font-bold text-morning-sun-strong border border-morning-sun/30">
            <Sparkles className="h-3.5 w-3.5" /> Caregiver Access Portal
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-moon">
            Welcome Back to MITRA
          </h1>
          <p className="text-xs text-earth">
            Mentoring Intelligence for Tribal Residential Ashramshala
          </p>
        </motion.div>

        {/* Login Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleLogin}
          className="rounded-card border border-moon/10 bg-cloud-strong p-6 space-y-4 shadow-sm text-left"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-moon flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-forest" /> Your Full Name / Honorific
            </label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Rajesh Patil Sir / Sunita Tai"
              className="w-full rounded-button border border-moon/15 bg-cloud px-3.5 py-2.5 text-xs text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-moon flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-morning-sun-strong" /> Designation / Role
            </label>
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="w-full rounded-button border border-moon/15 bg-cloud px-3.5 py-2.5 text-xs text-moon focus:border-morning-sun focus:outline-none"
            >
              <option value="Hostel Superintendent">Hostel Superintendent (गृहपाल)</option>
              <option value="Assistant Superintendent">Assistant Superintendent</option>
              <option value="Headmaster / Principal">Headmaster / Principal (मुख्याध्यापक)</option>
              <option value="Project Officer (PO)">Project Officer / Inspector</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !nameInput.trim()}
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-button bg-morning-sun px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-morning-sun-strong disabled:opacity-40"
          >
            {loading ? 'Logging in...' : 'Sign In to MITRA'} <ArrowRight className="h-4 w-4" />
          </button>
        </motion.form>

        {/* New User Onboarding Link */}
        <p className="text-xs text-earth">
          First time here?{' '}
          <Link href="/onboarding" className="font-bold text-morning-sun-strong hover:underline">
            Complete Initial Setup →
          </Link>
        </p>
      </div>
    </main>
  );
}
