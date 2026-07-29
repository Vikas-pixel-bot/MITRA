'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mic, Sun } from 'lucide-react';
import { useOnboarding } from '../_context';
import { saveOnboardingUser } from '@/actions/user';

export default function BriefingPage() {
  const { data, resolvedGoal } = useOnboarding();
  const name = data.name.trim() || 'there';
  const honorific = data.honorific ? ` ${data.honorific}` : '';

  useEffect(() => {
    saveOnboardingUser(data)
      .then((result) => {
        if (result.success && result.userId) {
          window.localStorage.setItem('mitra:userId', result.userId);
        }
      })
      .catch((err) => {
        console.error('Failed to sync onboarding to database:', err);
      });
  }, [data]);

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-10 [padding-top:max(2.5rem,env(safe-area-inset-top))] [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-6 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-morning-sun/15">
          <Sun className="h-7 w-7 text-morning-sun-strong" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-moon">
            Good Morning, {name}
            {honorific}.
          </h1>
          <p className="text-base leading-relaxed text-moon/80">
            Today is your first day with MITRA. I don&apos;t know everything yet, but I already
            know one important thing: you care deeply about your students.
          </p>
          {resolvedGoal && (
            <p className="text-base leading-relaxed text-moon/80">
              This month, we&apos;re focusing on: &ldquo;{resolvedGoal}&rdquo;
            </p>
          )}
          <p className="text-sm text-earth">
            Whenever you need me, just tap the microphone and speak naturally.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        className="flex w-full max-w-sm flex-col gap-3"
      >
        <Link
          href="/mitra"
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-button bg-morning-sun px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-morning-sun-strong"
        >
          <Mic className="h-4 w-4" />
          Talk to MITRA
        </Link>
        <Link
          href="/today"
          className="flex min-h-[48px] w-full items-center justify-center rounded-button border border-moon/10 bg-cloud-strong px-6 py-3.5 text-base font-semibold text-moon transition-colors hover:border-moon/20"
        >
          Start My Day
        </Link>
      </motion.div>
    </main>
  );
}
