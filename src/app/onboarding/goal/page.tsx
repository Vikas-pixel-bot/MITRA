'use client';

import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../_components/OnboardingShell';
import { OptionChip } from '../_components/OptionChip';
import { PrimaryButton } from '../_components/PrimaryButton';
import { useOnboarding } from '../_context';

const GOALS = [
  'Spend more time with family',
  'Feel less stressed',
  'Handle student issues more confidently',
  'Reduce paperwork',
  'Build better relationships with students',
  'Improve time management',
  'Become more organized',
];

export default function GoalPage() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const isCustom = data.goalChoice === 'custom';
  const canContinue = isCustom ? data.customGoal.trim().length > 0 : Boolean(data.goalChoice);

  return (
    <OnboardingShell
      footer={
        <PrimaryButton disabled={!canContinue} onClick={() => router.push('/onboarding/reflect')}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-moon">
          If MITRA could help you improve just one thing over the next month, what would you
          choose?
        </h1>
      </div>

      <div className="space-y-3">
        {GOALS.map((goal) => (
          <OptionChip
            key={goal}
            label={goal}
            selected={data.goalChoice === goal}
            onClick={() => update({ goalChoice: goal })}
          />
        ))}
        <OptionChip
          label="Write my own goal"
          selected={isCustom}
          onClick={() => update({ goalChoice: 'custom' })}
        />
        {isCustom && (
          <input
            value={data.customGoal}
            onChange={(e) => update({ customGoal: e.target.value })}
            placeholder="My goal for the next 30 days..."
            className="min-h-[48px] w-full rounded-button border border-moon/10 bg-cloud-strong px-4 text-base text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
          />
        )}
      </div>
    </OnboardingShell>
  );
}
