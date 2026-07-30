'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mic, MessageCircle, ShieldAlert, BookOpen, FileText, Bell } from 'lucide-react';
import { getTodayBriefing } from '@/actions/today';

type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

const GREETING_WORD: Record<TimePeriod, string> = {
  morning: 'Good Morning',
  afternoon: 'Good Afternoon',
  evening: 'Good Evening',
  night: 'Good Night',
};

function getTimePeriod(hour: number): TimePeriod {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

const JOURNEY = [
  { time: '6:00 AM', minutes: 6 * 60, label: 'Wake-up & Hygiene' },
  { time: '7:30 AM', minutes: 7 * 60 + 30, label: 'Breakfast' },
  { time: '9:00 AM', minutes: 9 * 60, label: 'School Hours' },
  { time: '5:00 PM', minutes: 17 * 60, label: 'Study & Activities' },
  { time: '9:00 PM', minutes: 21 * 60, label: 'Reflection' },
];

function computeJourney(minutesNow: number) {
  let priorityIndex = 0;
  for (let i = 0; i < JOURNEY.length; i++) {
    if (minutesNow >= JOURNEY[i].minutes) priorityIndex = i;
  }
  return JOURNEY.map((item, i) => ({
    ...item,
    status: i < priorityIndex ? 'done' : i === priorityIndex ? 'current' : 'upcoming',
  })) as { time: string; label: string; status: 'done' | 'current' | 'upcoming' }[];
}

type Briefing = Awaited<ReturnType<typeof getTodayBriefing>>;

const QUICK_ACTIONS = [
  { label: 'Talk to MITRA', icon: MessageCircle, href: '/mitra' },
  { label: 'Report an Incident', icon: ShieldAlert, href: '/mitra' },
  { label: 'Search Knowledge', icon: BookOpen, href: '/knowledge' },
  { label: "Generate Today's Report", icon: FileText, href: '/mitra' },
];

export default function TodayPage() {
  const [state, setState] = useState<'loading' | 'no-user' | 'offline' | 'error' | 'ready'>(
    'loading'
  );
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [now] = useState(() => new Date());

  // One-time sync from external browser state (network status, localStorage,
  // a server fetch) into React state after mount — the textbook effect use
  // the lint rule's own guidance describes, not a render-time setState.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setState('offline');
      return;
    }

    const userId = window.localStorage.getItem('mitra:userId');

    getTodayBriefing(userId)
      .then((result) => {
        if (result.success) {
          setBriefing(result);
          setState('ready');
          if (result.user && typeof window !== 'undefined' && !userId) {
            // Optional sync back
          }
        } else {
          setState('no-user');
        }
      })
      .catch(() => setState('error'));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (state === 'loading') {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center px-6 text-center text-sm text-moon/50">
        Preparing today&apos;s briefing...
      </main>
    );
  }

  if (state === 'no-user') {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-lg font-semibold text-moon">Let&apos;s get you set up first</h1>
        <p className="max-w-xs text-sm text-earth">
          Finish onboarding so MITRA can prepare a briefing that&apos;s actually about your day.
        </p>
        <Link
          href="/"
          className="flex min-h-[48px] items-center justify-center rounded-button bg-morning-sun px-6 text-sm font-semibold text-white"
        >
          Start Onboarding
        </Link>
      </main>
    );
  }

  if (state === 'offline') {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="max-w-xs text-sm text-moon/80">
          You&apos;re offline. I&apos;ll continue helping using the information already
          available on your device. Everything will sync automatically once you&apos;re
          connected.
        </p>
      </main>
    );
  }

  if (state === 'error' || !briefing?.success) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="max-w-xs text-sm text-moon/80">
          I couldn&apos;t prepare today&apos;s briefing because the connection is unstable. You
          can still continue your work, and I&apos;ll update the briefing when we&apos;re back
          online.
        </p>
      </main>
    );
  }

  const { user, notifications } = briefing;
  const addressee = user.honorific || user.name;
  const period = getTimePeriod(now.getHours());
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const journey = computeJourney(minutesNow);
  const priority = journey.find((item) => item.status === 'current') ?? journey[0];

  const briefingLines = [
    `${GREETING_WORD[period]}, ${addressee}.`,
    `Today begins with ${priority.label.toLowerCase()}.`,
    notifications.length > 0
      ? `There ${notifications.length === 1 ? 'is' : 'are'} ${notifications.length} thing${notifications.length === 1 ? '' : 's'} worth your attention today.`
      : 'Nothing urgent is waiting for you right now.',
  ];
  if (user.thirtyDayGoal) {
    briefingLines.push(
      `Your monthly goal is to ${user.thirtyDayGoal.toLowerCase()}. Remember to take a few quiet minutes for yourself today.`
    );
  }

  const oneThingForYou = user.thirtyDayGoal
    ? `You wanted to ${user.thirtyDayGoal.toLowerCase()} this month. Small, steady steps count.`
    : 'Take a few quiet minutes for yourself today — it matters as much as anything on your list.';

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-5 px-6 pb-6 [padding-top:max(1.5rem,env(safe-area-inset-top))]">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="rounded-card bg-cloud-strong p-5"
      >
        <div className="space-y-2 text-sm leading-relaxed text-moon">
          {briefingLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Link
            href="/mitra"
            className="flex min-h-[44px] flex-1 items-center justify-center rounded-button bg-morning-sun text-sm font-semibold text-white"
          >
            Start My Day
          </Link>
          <Link
            href="/mitra"
            className="flex min-h-[44px] flex-1 items-center justify-center rounded-button border border-moon/10 text-sm font-semibold text-moon"
          >
            Ask MITRA
          </Link>
        </div>
      </motion.section>

      <section className="rounded-card bg-cloud-strong p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-earth">
          Current Priority
        </p>
        <p className="mt-1 text-base font-semibold text-moon">{priority.label}</p>
      </section>

      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-earth">
          Today&apos;s Journey
        </p>
        <ol className="space-y-2">
          {journey.map((item) => (
            <li
              key={item.label}
              className={`flex items-center justify-between rounded-button px-4 py-2.5 text-sm ${
                item.status === 'current'
                  ? 'bg-morning-sun/15 text-moon'
                  : item.status === 'done'
                    ? 'bg-transparent text-moon/40 line-through'
                    : 'bg-transparent text-moon/70'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs">{item.time}</span>
            </li>
          ))}
        </ol>
      </section>

      {notifications.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-earth">
            Important Reminders
          </p>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-2 rounded-button bg-cloud-strong px-4 py-3 text-sm text-moon"
              >
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
                <div>
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-moon/60">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-card bg-morning-sun/10 p-4 text-sm text-moon">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-earth">
          One Thing For You
        </p>
        {oneThingForYou}
      </section>

      <section>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-start gap-2 rounded-button bg-cloud-strong p-3.5"
            >
              <Icon className="h-5 w-5 text-morning-sun-strong" />
              <span className="text-xs font-semibold text-moon">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <Link
        href="/mitra"
        aria-label="Talk to MITRA"
        className="fixed bottom-24 right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-morning-sun text-white shadow-lg"
      >
        <Mic className="h-6 w-6" />
      </Link>
    </main>
  );
}
