'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MessageCircle, ShieldAlert, BookOpen, FileText, Bell, ClipboardList, X, Check } from 'lucide-react';
import { getTodayBriefing } from '@/actions/today';
import { submitDailyLog, getTodayLogs } from '@/actions/dailyLog';
import { dismissNotification } from '@/actions/notifications';

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
type ReminderItem = { id: string; title: string; message: string; level: string };
type LogEntry = {
  id: string;
  attendanceCount: number;
  sickCount: number;
  mealQuality: string | null;
  notes: string | null;
  createdAt: string;
};

const MEAL_QUALITY = ['Good', 'Average', 'Poor'];

const QUICK_ACTIONS = [
  { label: 'Talk to MITRA', icon: MessageCircle, href: '/mitra' },
  {
    label: 'Report an Incident',
    icon: ShieldAlert,
    href: '/mitra?query=' + encodeURIComponent('I want to report an incident that just happened in the hostel.'),
  },
  { label: 'Search Knowledge', icon: BookOpen, href: '/knowledge' },
  {
    label: "Generate Today's Report",
    icon: FileText,
    href: '/mitra?query=' + encodeURIComponent("Help me generate today's daily administrative report."),
  },
];

export default function TodayPage() {
  const [state, setState] = useState<'loading' | 'no-user' | 'offline' | 'error' | 'ready'>(
    'loading'
  );
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [now] = useState(() => new Date());
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [dismissing, setDismissing] = useState<string | null>(null);

  const [logModalOpen, setLogModalOpen] = useState(false);
  const [todayLogs, setTodayLogs] = useState<LogEntry[]>([]);
  const [attendanceCount, setAttendanceCount] = useState('');
  const [sickCount, setSickCount] = useState('');
  const [mealQuality, setMealQuality] = useState<string | null>(null);
  const [logNotes, setLogNotes] = useState('');
  const [savingLog, setSavingLog] = useState(false);

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
          setReminders(result.notifications);
          setState('ready');
          if (result.user?.id && typeof window !== 'undefined' && !userId) {
            window.localStorage.setItem('mitra:userId', result.user.id);
          }
          getTodayLogs(result.user.id).then((logResult) => {
            if (logResult.success) setTodayLogs(logResult.logs);
          });
        } else {
          setState('no-user');
        }
      })
      .catch(() => setState('error'));
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleDismiss = async (id: string) => {
    setDismissing(id);
    const res = await dismissNotification(id);
    if (res.success) {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
    setDismissing(null);
  };

  const handleSubmitLog = async () => {
    if (!briefing?.success) return;
    setSavingLog(true);
    const res = await submitDailyLog({
      userId: briefing.user.id,
      attendanceCount: attendanceCount ? Number(attendanceCount) : undefined,
      sickCount: sickCount ? Number(sickCount) : undefined,
      mealQuality: mealQuality ?? undefined,
      notes: logNotes || undefined,
    });
    if (res.success) {
      setAttendanceCount('');
      setSickCount('');
      setMealQuality(null);
      setLogNotes('');
      setLogModalOpen(false);
      const logResult = await getTodayLogs(briefing.user.id);
      if (logResult.success) setTodayLogs(logResult.logs);
    }
    setSavingLog(false);
  };

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

  const { user } = briefing;
  const addressee = user.honorific || user.name;
  const period = getTimePeriod(now.getHours());
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const journey = computeJourney(minutesNow);
  const priority = journey.find((item) => item.status === 'current') ?? journey[0];

  const briefingLines = [
    `${GREETING_WORD[period]}, ${addressee}.`,
    `Today begins with ${priority.label.toLowerCase()}.`,
    reminders.length > 0
      ? `There ${reminders.length === 1 ? 'is' : 'are'} ${reminders.length} thing${reminders.length === 1 ? '' : 's'} worth your attention today.`
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

      <section className="rounded-card bg-cloud-strong p-5">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-earth">
            <ClipboardList className="h-3.5 w-3.5" />
            Log Today
          </p>
          <button
            onClick={() => setLogModalOpen(true)}
            className="rounded-button bg-morning-sun px-3 py-1.5 text-xs font-semibold text-white"
          >
            + Add Entry
          </button>
        </div>
        {todayLogs.length > 0 ? (
          <div className="mt-3 space-y-2">
            {todayLogs.map((log) => (
              <div key={log.id} className="rounded-button bg-cloud px-3 py-2 text-xs text-moon/80">
                <span className="font-medium text-moon">
                  {new Date(log.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {' · '}
                {log.attendanceCount > 0 && `Attendance ${log.attendanceCount}`}
                {log.sickCount > 0 && ` · Sick ${log.sickCount}`}
                {log.mealQuality && ` · Meal: ${log.mealQuality}`}
                {log.notes && <p className="mt-1 text-moon/70">{log.notes}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-moon/50">Nothing logged yet today.</p>
        )}
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

      {reminders.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-earth">
            Important Reminders
          </p>
          <div className="space-y-2">
            {reminders.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-2 rounded-button bg-cloud-strong px-4 py-3 text-sm text-moon"
              >
                <Bell className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
                <div className="flex-1">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-moon/60">{n.message}</p>
                </div>
                <button
                  onClick={() => handleDismiss(n.id)}
                  disabled={dismissing === n.id}
                  aria-label="Dismiss reminder"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-moon/40 hover:bg-moon/10 hover:text-moon disabled:opacity-40"
                >
                  <Check className="h-4 w-4" />
                </button>
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
          {QUICK_ACTIONS.map(({ label, icon: Icon, href }) => {
            const isIncident = label === 'Report an Incident';
            return (
              <Link
                key={label}
                href={href}
                className={`flex flex-col items-start gap-2 rounded-button p-3.5 border transition-all ${
                  isIncident
                    ? 'bg-clay/10 border-clay/30 hover:bg-clay/20'
                    : 'bg-cloud-strong border-moon/5 hover:border-moon/15'
                }`}
              >
                <Icon className={`h-5 w-5 ${isIncident ? 'text-clay' : 'text-morning-sun-strong'}`} />
                <span className={`text-xs font-semibold ${isIncident ? 'text-clay font-bold' : 'text-moon'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <Link
        href="/mitra"
        aria-label="Talk to MITRA"
        className="fixed bottom-24 right-6 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-morning-sun text-white shadow-lg"
      >
        <Mic className="h-6 w-6" />
      </Link>

      <AnimatePresence>
        {logModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-moon/40 backdrop-blur-xs p-0 sm:items-center sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-cloud p-6 shadow-xl sm:rounded-card"
            >
              <div className="flex items-start justify-between border-b border-moon/10 pb-3">
                <h2 className="text-lg font-semibold text-moon">Log Today</h2>
                <button
                  onClick={() => setLogModalOpen(false)}
                  className="rounded-full p-1 text-moon/50 hover:bg-moon/10 hover:text-moon"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto py-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-earth">Attendance count</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={attendanceCount}
                      onChange={(e) => setAttendanceCount(e.target.value.replace(/\D/g, ''))}
                      placeholder="0"
                      className="w-full rounded-button border border-moon/10 bg-cloud-strong px-3 py-2 text-sm text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-medium text-earth">Sick count</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={sickCount}
                      onChange={(e) => setSickCount(e.target.value.replace(/\D/g, ''))}
                      placeholder="0"
                      className="w-full rounded-button border border-moon/10 bg-cloud-strong px-3 py-2 text-sm text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-earth">Meal quality</span>
                  <div className="flex gap-2">
                    {MEAL_QUALITY.map((q) => (
                      <button
                        key={q}
                        onClick={() => setMealQuality(q)}
                        className={`flex-1 rounded-button border px-3 py-2 text-sm font-medium transition-colors ${
                          mealQuality === q
                            ? 'border-morning-sun bg-morning-sun/15 text-moon'
                            : 'border-moon/10 bg-cloud-strong text-moon/70'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="space-y-1">
                  <span className="text-xs font-medium text-earth">Notes</span>
                  <textarea
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="Anything worth remembering about today..."
                    rows={3}
                    className="w-full resize-none rounded-button border border-moon/10 bg-cloud-strong px-3 py-2 text-sm text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
                  />
                </label>
              </div>

              <button
                onClick={handleSubmitLog}
                disabled={savingLog}
                className="flex min-h-[48px] w-full items-center justify-center rounded-button bg-morning-sun text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {savingLog ? 'Saving...' : 'Save Entry'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
