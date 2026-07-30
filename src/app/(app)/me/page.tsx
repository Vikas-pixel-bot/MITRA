'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserRound, Target, Settings, Sparkles } from 'lucide-react';
import { getMeOverview, addReflection } from '@/actions/me';

type Overview = Awaited<ReturnType<typeof getMeOverview>>;

const MOODS = [
  { id: 'GOOD', emoji: '😊', label: 'Good' },
  { id: 'OKAY', emoji: '😐', label: 'Okay' },
  { id: 'TOUGH', emoji: '😔', label: 'Tough' },
];

export default function MePage() {
  const [state, setState] = useState<'loading' | 'no-user' | 'error' | 'ready'>('loading');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [saving, setSaving] = useState(false);
  const [now] = useState(() => Date.now());

  const load = () => {
    const userId = window.localStorage.getItem('mitra:userId');
    getMeOverview(userId)
      .then((result) => {
        if (result.success) {
          setOverview(result);
          setState('ready');
          if (result.user?.id && typeof window !== 'undefined' && !userId) {
            window.localStorage.setItem('mitra:userId', result.user.id);
          }
        } else {
          setState('no-user');
        }
      })
      .catch(() => setState('error'));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveReflection = async () => {
    if (!overview?.success || !reflectionText.trim()) return;
    setSaving(true);
    const res = await addReflection(overview.user.id, reflectionText, mood ?? undefined);
    if (res.success) {
      setReflectionText('');
      setMood(null);
      load();
    }
    setSaving(false);
  };

  if (state === 'loading') {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center px-6 text-center text-sm text-moon/50">
        Loading your growth journey...
      </main>
    );
  }

  if (state === 'no-user' || state === 'error' || !overview?.success) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-lg font-semibold text-moon">Let&apos;s get you set up first</h1>
        <p className="max-w-xs text-sm text-earth">
          Finish onboarding so MITRA can track your goal and reflections.
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

  const { user, goal, reflections } = overview;
  const addressee = user.honorific || user.name;
  const daysIn = goal
    ? Math.max(1, Math.floor((now - new Date(goal.createdAt).getTime()) / 86400000) + 1)
    : null;

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-5 px-6 pb-24 [padding-top:max(1.5rem,env(safe-area-inset-top))]">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-morning-sun/15 text-morning-sun-strong">
            <UserRound className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-moon">{addressee}</h1>
        </div>
        <p className="text-xs text-earth">Every month, a calmer, more confident you.</p>
      </header>

      {goal && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-card bg-cloud-strong p-5"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-earth">
            <Target className="h-3.5 w-3.5" />
            30-Day Goal · Day {daysIn} of 30
          </div>
          <p className="mt-2 text-base font-semibold text-moon">{goal.title}</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-moon/10">
            <div
              className="h-full rounded-full bg-morning-sun"
              style={{ width: `${Math.min(100, ((daysIn ?? 0) / 30) * 100)}%` }}
            />
          </div>
        </motion.section>
      )}

      {user.primaryChallenges.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-earth">
            What you told MITRA
          </p>
          <div className="flex flex-wrap gap-2">
            {user.primaryChallenges.map((c) => (
              <span
                key={c}
                className="rounded-full bg-cloud-strong px-3 py-1.5 text-xs font-medium text-moon"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-card bg-morning-sun/10 p-4">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-earth">
          <Sparkles className="h-3.5 w-3.5" />
          Two-Minute Reflection
        </p>
        <div className="mb-2 flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-button py-2 text-xs font-medium transition-colors ${
                mood === m.id ? 'bg-morning-sun/25 text-moon' : 'bg-cloud-strong text-moon/60'
              }`}
            >
              <span className="text-lg">{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>
        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="What's one thing that went well today?"
          rows={2}
          className="w-full resize-none rounded-button border border-moon/10 bg-cloud px-3 py-2 text-sm text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
        />
        <button
          onClick={handleSaveReflection}
          disabled={!reflectionText.trim() || saving}
          className="mt-2 flex min-h-[40px] w-full items-center justify-center rounded-button bg-morning-sun text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save Reflection'}
        </button>
      </section>

      {reflections.length > 0 && (
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-earth">
            Past Reflections
          </p>
          <div className="space-y-2">
            {reflections.map((r) => (
              <div key={r.id} className="rounded-button bg-cloud-strong px-4 py-3 text-sm text-moon">
                <div className="mb-1 flex items-center justify-between text-xs text-moon/50">
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  {r.mood && <span>{MOODS.find((m) => m.id === r.mood)?.emoji}</span>}
                </div>
                {r.content}
              </div>
            ))}
          </div>
        </section>
      )}

      <Link
        href="/administration"
        className="flex items-center justify-between rounded-button border border-moon/10 bg-cloud-strong px-4 py-3.5 text-sm font-medium text-moon"
      >
        <span className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-earth" />
          Administration &amp; Settings
        </span>
        <span className="text-moon/40">→</span>
      </Link>
    </main>
  );
}
