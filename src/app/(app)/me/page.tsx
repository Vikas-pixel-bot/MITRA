'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserRound, Target, Sparkles, Calendar, CheckSquare, Square, Plus, HeartHandshake, Smile, Meh, Frown, CheckCircle2 } from 'lucide-react';
import { getMeOverview, addReflection } from '@/actions/me';
import { getUserHabits, toggleHabit, addCustomHabit, HabitItem } from '@/actions/habits';

type Overview = Awaited<ReturnType<typeof getMeOverview>>;

const MOODS = [
  { id: 'Energized', emoji: '😄', label: 'Energized' },
  { id: 'Calm', emoji: '😌', label: 'Calm' },
  { id: 'Tough', emoji: '😔', label: 'Tough' },
];

export default function MePage() {
  const [state, setState] = useState<'loading' | 'no-user' | 'error' | 'ready'>('loading');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [saving, setSaving] = useState(false);
  const [now] = useState(() => Date.now());

  // Habits State
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [addingHabit, setAddingHabit] = useState(false);

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
          getUserHabits(result.user.id).then((habitRes) => {
            if (habitRes.success) setHabits(habitRes.habits);
          });
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

  const handleToggleHabit = async (habitId: string, currentCompleted: boolean) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completedToday: !currentCompleted,
              streak: !currentCompleted ? h.streak + 1 : Math.max(0, h.streak - 1),
            }
          : h
      )
    );
    await toggleHabit(habitId, currentCompleted);
  };

  const handleAddHabit = async () => {
    if (!newHabitName.trim() || !overview?.success) return;
    setAddingHabit(true);
    const res = await addCustomHabit(overview.user.id, newHabitName);
    if (res.success && res.habit) {
      setHabits((prev) => [
        ...prev,
        {
          id: res.habit.id,
          name: res.habit.name,
          category: res.habit.category,
          completedToday: res.habit.completedToday,
          streak: res.habit.streak,
        },
      ]);
      setNewHabitName('');
    }
    setAddingHabit(false);
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
    <main className="flex min-h-[100dvh] w-full flex-col gap-5 px-6 pb-28 [padding-top:max(1.5rem,env(safe-area-inset-top))]">
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-morning-sun/15 text-morning-sun-strong font-bold">
            🙏
          </div>
          <h1 className="text-xl font-bold tracking-tight text-moon">{addressee}</h1>
        </div>
        <p className="text-xs text-earth">Your personal reflection, mood journal, and habit builder.</p>
      </header>

      {/* 30-Day Goal Banner */}
      {goal && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-card border border-morning-sun/20 bg-gradient-to-r from-morning-sun/15 to-cloud-strong p-4 shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-morning-sun-strong">
            <Target className="h-4 w-4" />
            30-Day Goal · Day {daysIn} of 30
          </div>
          <p className="mt-2 text-sm font-semibold text-moon">{goal.title}</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-moon/10">
            <div
              className="h-full rounded-full bg-morning-sun"
              style={{ width: `${Math.min(100, ((daysIn ?? 0) / 30) * 100)}%` }}
            />
          </div>
        </motion.section>
      )}

      {/* Habit Tracker Section */}
      <section className="rounded-card border border-forest/20 bg-forest/5 p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-forest/10 pb-2">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-forest" />
            <div>
              <h2 className="text-sm font-bold text-moon">Habit Builder</h2>
              <p className="text-[11px] text-earth">Pick habits and check off your progress today</p>
            </div>
          </div>
          <span className="rounded-full bg-forest/15 px-2.5 py-0.5 text-[10px] font-bold text-forest">
            Daily Habits
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((h) => (
            <div
              key={h.id}
              onClick={() => handleToggleHabit(h.id, h.completedToday)}
              className={`flex cursor-pointer items-center justify-between rounded-button p-3 text-xs border transition-colors ${
                h.completedToday
                  ? 'bg-forest/15 border-forest/30 text-moon font-medium'
                  : 'bg-cloud border-moon/10 text-moon hover:border-forest/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {h.completedToday ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-forest" />
                ) : (
                  <Square className="h-4 w-4 shrink-0 text-earth/50" />
                )}
                <span>{h.name}</span>
              </div>
              <span className="shrink-0 rounded-full bg-cloud-strong px-2 py-0.5 text-[10px] font-bold text-earth">
                🔥 {h.streak}d streak
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-forest/10">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Add new daily habit..."
            className="flex-1 rounded-button border border-moon/10 bg-cloud px-3 py-2 text-xs text-moon placeholder:text-moon/40 focus:border-forest focus:outline-none"
          />
          <button
            disabled={addingHabit || !newHabitName.trim()}
            onClick={handleAddHabit}
            className="flex h-9 items-center justify-center rounded-button bg-forest px-3 text-xs font-semibold text-white shadow-xs hover:bg-forest/90 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Two-Minute Reflection & Mood Input */}
      <section className="rounded-card border border-moon/10 bg-cloud-strong p-4 space-y-3">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-earth">
          <Sparkles className="h-4 w-4 text-morning-sun-strong" />
          Log Today&apos;s Mood & Reflection
        </p>

        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-button py-2.5 text-xs font-semibold border transition-all ${
                mood === m.id
                  ? 'bg-morning-sun text-white border-morning-sun shadow-xs'
                  : 'bg-cloud border-moon/10 text-moon hover:bg-moon/5'
              }`}
            >
              <span>{m.emoji}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        <textarea
          value={reflectionText}
          onChange={(e) => setReflectionText(e.target.value)}
          placeholder="What made you smile today? Or what challenged you?"
          rows={3}
          className="w-full resize-none rounded-button border border-moon/10 bg-cloud p-3 text-xs text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
        />

        <button
          type="button"
          onClick={handleSaveReflection}
          disabled={saving || !reflectionText.trim()}
          className="w-full min-h-[42px] rounded-button bg-morning-sun text-xs font-semibold text-white shadow-xs hover:bg-morning-sun-strong disabled:opacity-40"
        >
          {saving ? 'Saving...' : 'Save Reflection'}
        </button>
      </section>

      {/* Day-Wise Reflection Log Timeline (Week / Month Mood History) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earth">
          <Calendar className="h-4 w-4 text-river" />
          Day-Wise Reflection History ({reflections.length})
        </div>

        {reflections.length === 0 ? (
          <div className="rounded-card border border-moon/10 bg-cloud-strong p-4 text-center text-xs text-earth">
            No reflections logged yet. Share your first thought above!
          </div>
        ) : (
          <div className="space-y-2.5">
            {reflections.map((r) => {
              const d = new Date(r.createdAt);
              const dateStr = d.toLocaleDateString('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              });
              const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
              const moodItem = MOODS.find((m) => m.id === r.mood);

              return (
                <div
                  key={r.id}
                  className="rounded-card border border-moon/10 bg-cloud-strong p-3.5 space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-moon">{dateStr}</span>
                    <div className="flex items-center gap-2">
                      {moodItem && (
                        <span className="rounded-full bg-cloud px-2 py-0.5 text-[10px] font-semibold text-moon border border-moon/5">
                          {moodItem.emoji} {moodItem.label}
                        </span>
                      )}
                      <span className="text-[10px] text-earth">{timeStr}</span>
                    </div>
                  </div>
                  <p className="text-xs text-moon/90 leading-relaxed">{r.content}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
