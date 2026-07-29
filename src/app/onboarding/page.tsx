'use client';

import { useRouter } from 'next/navigation';
import { OnboardingShell } from './_components/OnboardingShell';
import { OptionChip } from './_components/OptionChip';
import { PrimaryButton } from './_components/PrimaryButton';
import { useOnboarding, type Language } from './_context';

const LANGUAGES: Language[] = ['Marathi', 'Hindi', 'English'];

export default function LanguagePage() {
  const router = useRouter();
  const { data, update } = useOnboarding();

  return (
    <OnboardingShell
      footer={
        <PrimaryButton
          disabled={!data.language}
          onClick={() => router.push('/onboarding/meet-mitra')}
        >
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-moon">
          Which language would you like to talk in?
        </h1>
        <p className="text-sm text-earth">
          You can switch anytime by simply saying, &ldquo;Let&apos;s talk in Marathi.&rdquo;
        </p>
      </div>

      <div className="space-y-3">
        {LANGUAGES.map((language) => (
          <OptionChip
            key={language}
            label={language}
            selected={data.language === language}
            onClick={() => update({ language })}
          />
        ))}
      </div>
    </OnboardingShell>
  );
}
