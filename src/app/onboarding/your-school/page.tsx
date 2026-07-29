'use client';

import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../_components/OnboardingShell';
import { PrimaryButton } from '../_components/PrimaryButton';
import { useOnboarding, type HostelType } from '../_context';

const HOSTEL_TYPES: HostelType[] = ["Boys'", "Girls'", 'Co-ed'];

const inputClass =
  'min-h-[48px] w-full rounded-button border border-moon/10 bg-cloud-strong px-4 text-base text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none';

export default function YourSchoolPage() {
  const router = useRouter();
  const { data, updateSchool } = useOnboarding();
  const { school } = data;
  const canContinue = school.name.trim() && school.district.trim() && school.hostelType;

  return (
    <OnboardingShell
      footer={
        <PrimaryButton
          disabled={!canContinue}
          onClick={() => router.push('/onboarding/challenges')}
        >
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-moon">About your school</h1>
        <p className="text-sm text-earth">
          Just what I genuinely need — everything else can be synced later.
        </p>
      </div>

      <div className="space-y-3">
        <input
          value={school.name}
          onChange={(e) => updateSchool({ name: e.target.value })}
          placeholder="School name"
          className={inputClass}
        />
        <input
          value={school.district}
          onChange={(e) => updateSchool({ district: e.target.value })}
          placeholder="District"
          className={inputClass}
        />
        <input
          value={school.projectOffice}
          onChange={(e) => updateSchool({ projectOffice: e.target.value })}
          placeholder="Project Office"
          className={inputClass}
        />
        <input
          value={school.studentCount}
          onChange={(e) => updateSchool({ studentCount: e.target.value.replace(/\D/g, '') })}
          placeholder="Approximate number of students"
          inputMode="numeric"
          className={inputClass}
        />

        <div className="flex gap-2 pt-1">
          {HOSTEL_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => updateSchool({ hostelType: type })}
              className={`flex-1 rounded-button border px-3 py-3 text-sm font-medium transition-colors ${
                school.hostelType === type
                  ? 'border-morning-sun bg-morning-sun/15 text-moon'
                  : 'border-moon/10 bg-cloud-strong text-moon/70 hover:border-moon/20'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </OnboardingShell>
  );
}
