'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Language = 'Marathi' | 'Hindi' | 'English';
export type Honorific = 'Sir' | 'Madam' | '';
export type ExperienceRange =
  | 'Less than 1 year'
  | '1–5 years'
  | '5–10 years'
  | 'More than 10 years';
export type HostelType = "Boys'" | "Girls'" | 'Co-ed';

export interface OnboardingData {
  language: Language | null;
  name: string;
  honorific: Honorific;
  experience: ExperienceRange | null;
  school: {
    name: string;
    district: string;
    projectOffice: string;
    hostelType: HostelType | null;
    studentCount: string;
  };
  challenges: string[];
  otherChallengeText: string;
  goalChoice: string | null;
  customGoal: string;
  notifications: {
    morningBriefing: boolean;
    eveningReflection: boolean;
    weeklyLearningTip: boolean;
    wellbeingReminder: boolean;
  };
}

const DEFAULT_DATA: OnboardingData = {
  language: null,
  name: '',
  honorific: '',
  experience: null,
  school: {
    name: '',
    district: '',
    projectOffice: '',
    hostelType: null,
    studentCount: '',
  },
  challenges: [],
  otherChallengeText: '',
  goalChoice: null,
  customGoal: '',
  notifications: {
    morningBriefing: true,
    eveningReflection: true,
    weeklyLearningTip: false,
    wellbeingReminder: false,
  },
};

const STORAGE_KEY = 'mitra:onboarding';

export const STEP_ORDER = [
  '/onboarding',
  '/onboarding/meet-mitra',
  '/onboarding/about-you',
  '/onboarding/your-school',
  '/onboarding/challenges',
  '/onboarding/goal',
  '/onboarding/reflect',
  '/onboarding/notifications',
] as const;

interface OnboardingContextValue {
  data: OnboardingData;
  update: (patch: Partial<OnboardingData>) => void;
  updateSchool: (patch: Partial<OnboardingData['school']>) => void;
  updateNotifications: (patch: Partial<OnboardingData['notifications']>) => void;
  resolvedGoal: string;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(DEFAULT_DATA);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        // One-time hydration from an external store (localStorage) after mount,
        // deliberately deferred to avoid an SSR/client hydration mismatch.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setData({ ...DEFAULT_DATA, ...JSON.parse(saved) });
      }
    } catch {
      // Corrupt or inaccessible storage — proceed with defaults.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage unavailable (private browsing, quota) — onboarding still works in-session.
    }
  }, [data]);

  const update = (patch: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const updateSchool = (patch: Partial<OnboardingData['school']>) =>
    setData((prev) => ({ ...prev, school: { ...prev.school, ...patch } }));

  const updateNotifications = (patch: Partial<OnboardingData['notifications']>) =>
    setData((prev) => ({ ...prev, notifications: { ...prev.notifications, ...patch } }));

  const resolvedGoal = data.goalChoice === 'custom' ? data.customGoal : data.goalChoice ?? '';

  return (
    <OnboardingContext.Provider
      value={{ data, update, updateSchool, updateNotifications, resolvedGoal }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return ctx;
}
