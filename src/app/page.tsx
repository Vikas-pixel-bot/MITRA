'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { WelcomeIllustration } from '@/components/illustrations/WelcomeIllustration';

export default function WelcomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // One-time sync from external browser state (localStorage) into React
  // state after mount — the textbook effect use the lint rule's own
  // guidance describes, not a render-time setState.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const userId = window.localStorage.getItem('mitra:userId');
    if (userId) {
      router.replace('/today');
    } else {
      setChecking(false);
    }
  }, [router]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (checking) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center px-6 text-center text-sm text-moon/50">
        Loading MITRA...
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-10 [padding-top:max(2.5rem,env(safe-area-inset-top))] [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-[260px] overflow-hidden rounded-card shadow-sm"
        >
          <WelcomeIllustration />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          className="flex flex-col items-center gap-4 text-center"
        >
          <p className="text-2xl">🙏</p>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-moon">
              Namaskar! Welcome to MITRA.
            </h1>
            <p className="text-sm font-medium text-earth">
              Mentoring Intelligence for Tribal Residential Ashramshala
            </p>
          </div>
          <p className="max-w-[280px] text-base leading-relaxed text-moon/80">
            I&apos;m here to support you in managing your Ashramshala, caring for
            children, and making your daily work easier.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <Link
          href="/onboarding"
          className="flex min-h-[48px] w-full items-center justify-center rounded-button bg-morning-sun px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-morning-sun-strong"
        >
          Let&apos;s Begin
        </Link>
      </motion.div>
    </main>
  );
}
