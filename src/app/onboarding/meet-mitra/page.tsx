'use client';

import { useRouter } from 'next/navigation';
import { HeartHandshake, FileText, BookOpen, Sparkles } from 'lucide-react';
import { OnboardingShell } from '../_components/OnboardingShell';
import { PrimaryButton } from '../_components/PrimaryButton';

const HELPS_WITH = [
  { icon: HeartHandshake, label: 'Care for students' },
  { icon: FileText, label: 'Handle documentation' },
  { icon: BookOpen, label: 'Understand government guidelines' },
  { icon: Sparkles, label: 'Take care of yourself too' },
];

export default function MeetMitraPage() {
  const router = useRouter();

  return (
    <OnboardingShell
      footer={
        <PrimaryButton onClick={() => router.push('/onboarding/about-you')}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-moon">Hello, I&apos;m MITRA.</h1>
        <p className="text-base leading-relaxed text-moon/80">
          Think of me as your companion. I can help you:
        </p>
      </div>

      <ul className="space-y-3">
        {HELPS_WITH.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="flex items-center gap-3 rounded-button bg-cloud-strong px-4 py-3.5 text-sm font-medium text-moon"
          >
            <Icon className="h-5 w-5 shrink-0 text-forest" />
            {label}
          </li>
        ))}
      </ul>
    </OnboardingShell>
  );
}
