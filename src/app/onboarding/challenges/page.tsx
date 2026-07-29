'use client';

import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../_components/OnboardingShell';
import { OptionChip } from '../_components/OptionChip';
import { PrimaryButton } from '../_components/PrimaryButton';
import { useOnboarding } from '../_context';

const CHALLENGES = [
  'Managing many students',
  'Student health concerns',
  'Parent communication',
  'Student discipline',
  'Food & nutrition',
  'Hostel operations',
  'Documentation & reports',
  'Government compliance',
  'Emergencies',
  'POCSO / Child safety',
  'Staff coordination',
  'Time management',
  'Work-life balance',
  'Feeling overwhelmed',
  'Balancing Warden & Teacher roles',
  'Personal wellbeing',
  'Building trust with students',
  'Managing inspections',
  'Other',
];

const REQUIRED_COUNT = 5;

export default function ChallengesPage() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const { challenges, otherChallengeText } = data;

  const hasOther = challenges.includes('Other');
  const canContinue =
    challenges.length === REQUIRED_COUNT && (!hasOther || otherChallengeText.trim().length > 0);

  const toggle = (challenge: string) => {
    if (challenges.includes(challenge)) {
      update({ challenges: challenges.filter((c) => c !== challenge) });
    } else if (challenges.length < REQUIRED_COUNT) {
      update({ challenges: [...challenges, challenge] });
    }
  };

  return (
    <OnboardingShell
      footer={
        <PrimaryButton disabled={!canContinue} onClick={() => router.push('/onboarding/goal')}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-moon">
          Every Ashramshala is different.
        </h1>
        <p className="text-sm text-earth">
          To support you better, could you tell me five areas that feel most challenging right
          now?
        </p>
        <p className="text-xs font-semibold text-moon/60">
          {challenges.length} of {REQUIRED_COUNT} selected
        </p>
      </div>

      <div className="max-h-[46vh] space-y-2 overflow-y-auto pr-1">
        {CHALLENGES.map((challenge) => (
          <OptionChip
            key={challenge}
            label={challenge}
            selected={challenges.includes(challenge)}
            disabled={!challenges.includes(challenge) && challenges.length >= REQUIRED_COUNT}
            onClick={() => toggle(challenge)}
          />
        ))}
      </div>

      {hasOther && (
        <input
          value={otherChallengeText}
          onChange={(e) => update({ otherChallengeText: e.target.value })}
          placeholder="Tell me more..."
          className="min-h-[48px] w-full rounded-button border border-moon/10 bg-cloud-strong px-4 text-base text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
        />
      )}
    </OnboardingShell>
  );
}
