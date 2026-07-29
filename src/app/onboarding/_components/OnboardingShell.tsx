'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { STEP_ORDER } from '../_context';

export function OnboardingShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const stepIndex = STEP_ORDER.indexOf(pathname as (typeof STEP_ORDER)[number]);

  return (
    <main className="flex min-h-[100dvh] w-full flex-col px-6 py-6 [padding-top:max(1.5rem,env(safe-area-inset-top))] [padding-bottom:max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col">
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => (stepIndex > 0 ? router.push(STEP_ORDER[stepIndex - 1]) : router.push('/'))}
            aria-label="Go back"
            className="flex h-10 w-10 items-center justify-center rounded-full text-moon/70 hover:bg-cloud-strong"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {stepIndex >= 0 && (
            <span className="rounded-full bg-cloud-strong px-3 py-1 text-xs font-semibold text-earth">
              Step {stepIndex + 1} of {STEP_ORDER.length}
            </span>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-1 flex-col justify-center gap-6"
        >
          {children}
        </motion.div>

        {footer && <div className="mt-8">{footer}</div>}
      </div>
    </main>
  );
}
