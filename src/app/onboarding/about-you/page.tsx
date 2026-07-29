'use client';

import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../_components/OnboardingShell';
import { OptionChip } from '../_components/OptionChip';
import { PrimaryButton } from '../_components/PrimaryButton';
import { useOnboarding, type ExperienceRange, type Honorific } from '../_context';

const HONORIFICS: { value: Honorific; label: string }[] = [
  { value: 'Sir', label: 'Sir' },
  { value: 'Madam', label: 'Madam' },
  { value: '', label: "I'd rather you just use my name" },
];

const EXPERIENCE_RANGES: ExperienceRange[] = [
  'Less than 1 year',
  '1–5 years',
  '5–10 years',
  'More than 10 years',
];

export default function AboutYouPage() {
  const router = useRouter();
  const { data, update } = useOnboarding();
  const trimmedName = data.name.trim();

  return (
    <OnboardingShell
      footer={
        <PrimaryButton
          disabled={!trimmedName || !data.experience}
          onClick={() => router.push('/onboarding/your-school')}
        >
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight text-moon">May I know your name?</h1>
        <input
          value={data.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Your name"
          className="min-h-[48px] w-full rounded-button border border-moon/10 bg-cloud-strong px-4 text-base text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
        />

        {trimmedName && (
          <div className="space-y-2">
            <p className="text-sm text-earth">
              It&apos;s a pleasure to meet you, {trimmedName}
              {data.honorific ? ` ${data.honorific}` : ''}.
            </p>
            <div className="flex flex-wrap gap-2">
              {HONORIFICS.map((h) => (
                <button
                  key={h.label}
                  type="button"
                  onClick={() => update({ honorific: h.value })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    data.honorific === h.value
                      ? 'border-morning-sun bg-morning-sun/15 text-moon'
                      : 'border-moon/10 text-moon/60 hover:border-moon/20'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-moon">
          Since how many years have you been working as a Superintendent?
        </p>
        <div className="space-y-3">
          {EXPERIENCE_RANGES.map((range) => (
            <OptionChip
              key={range}
              label={range}
              selected={data.experience === range}
              onClick={() => update({ experience: range })}
            />
          ))}
        </div>
      </div>
    </OnboardingShell>
  );
}
