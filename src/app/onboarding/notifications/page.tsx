'use client';

import { useRouter } from 'next/navigation';
import { OnboardingShell } from '../_components/OnboardingShell';
import { PrimaryButton } from '../_components/PrimaryButton';
import { useOnboarding } from '../_context';
import type { OnboardingData } from '../_context';

function Toggle({
  label,
  description,
  checked,
  onChange,
  locked,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange?: () => void;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={locked}
      className={`flex w-full items-center justify-between gap-3 rounded-button bg-cloud-strong px-4 py-3.5 text-left ${
        locked ? 'opacity-70' : ''
      }`}
    >
      <span>
        <span className="block text-sm font-semibold text-moon">{label}</span>
        <span className="block text-xs text-moon/60">{description}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-morning-sun' : 'bg-moon/15'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </span>
    </button>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const { data, updateNotifications } = useOnboarding();
  const n = data.notifications;

  const toggleKey = (key: keyof OnboardingData['notifications']) =>
    updateNotifications({ [key]: !n[key] });

  return (
    <OnboardingShell
      footer={
        <PrimaryButton onClick={() => router.push('/onboarding/briefing')}>
          Continue
        </PrimaryButton>
      }
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-moon">
          When would you like me to check in with you?
        </h1>
        <p className="text-sm text-earth">You can change these anytime later.</p>
      </div>

      <div className="space-y-3">
        <Toggle
          label="Morning Briefing"
          description="Recommended"
          checked={n.morningBriefing}
          onChange={() => toggleKey('morningBriefing')}
        />
        <Toggle
          label="Evening Reflection"
          description="Recommended"
          checked={n.eveningReflection}
          onChange={() => toggleKey('eveningReflection')}
        />
        <Toggle label="Critical Alerts" description="Always On" checked locked />
        <Toggle
          label="Weekly Learning Tip"
          description="Optional"
          checked={n.weeklyLearningTip}
          onChange={() => toggleKey('weeklyLearningTip')}
        />
        <Toggle
          label="Wellbeing Reminder"
          description="Optional"
          checked={n.wellbeingReminder}
          onChange={() => toggleKey('wellbeingReminder')}
        />
      </div>
    </OnboardingShell>
  );
}
