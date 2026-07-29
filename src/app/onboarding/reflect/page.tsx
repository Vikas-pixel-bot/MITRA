'use client';

import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../_components/OnboardingShell';
import { PrimaryButton } from '../_components/PrimaryButton';
import { useOnboarding } from '../_context';

export default function ReflectPage() {
  const router = useRouter();
  const { data, resolvedGoal } = useOnboarding();

  const displayChallenges = data.challenges.map((c) =>
    c === 'Other' && data.otherChallengeText ? data.otherChallengeText : c
  );
  const name = data.name.trim() || 'there';
  const honorific = data.honorific ? ` ${data.honorific}` : '';

  return (
    <OnboardingShell
      footer={
        <PrimaryButton onClick={() => router.push('/onboarding/notifications')}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-4">
        <p className="text-lg leading-relaxed text-moon">
          Thank you, {name}
          {honorific}.
        </p>
        <p className="text-base leading-relaxed text-moon/80">
          From what you&apos;ve shared, I understand that you&apos;re currently facing challenges
          with:
        </p>
        <ul className="space-y-1.5">
          {displayChallenges.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-moon/80">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
              {c}
            </li>
          ))}
        </ul>
        <p className="text-base leading-relaxed text-moon/80">
          Over the next month, we&apos;ll work together towards:
        </p>
        <p className="rounded-button bg-cloud-strong px-4 py-3.5 text-base font-medium text-moon">
          &ldquo;{resolvedGoal}&rdquo;
        </p>
        <p className="text-sm text-earth">We&apos;ll take one small step at a time.</p>
      </div>
    </OnboardingShell>
  );
}
