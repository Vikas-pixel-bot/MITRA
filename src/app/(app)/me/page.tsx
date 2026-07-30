'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  UserRound,
  Target,
  Sparkles,
  Calendar,
  CheckSquare,
  Square,
  Plus,
  HeartHandshake,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  TrendingUp,
  Activity,
  Flame,
  Award,
  Trash2,
} from 'lucide-react';
import { getMeOverview, addReflection } from '@/actions/me';
import { getUserHabits, toggleHabit, addCustomHabit, deleteHabit, HabitItem } from '@/actions/habits';
import { MitraDoodleAvatar } from '@/components/illustrations/MitraDoodleAvatar';
import { DailyMotivationCard } from '@/components/cards/DailyMotivationCard';

type Overview = Awaited<ReturnType<typeof getMeOverview>>;

const MOODS = [
  { id: 'Energized', label: 'Energized', icon: Smile, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Calm', label: 'Calm', icon: Meh, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'Tough', label: 'Tough Day', icon: Frown, color: 'text-rose-600 bg-rose-50 border-rose-200' },
];

export default function MePage() {
  const [state, setState] = useState<'loading' | 'no-user' | 'error' | 'ready'>('loading');
  const [overview, setOverview] = useState<Overview | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  const [saving, setSaving] = useState(false);
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [addingHabit, setAddingHabit] = useState(false);
  const [now] = useState(() => Date.now());

  const load = async () => {
    setState('loading');
    const userId = typeof window !== 'undefined' ? window.localStorage.getItem('mitra:userId') : null;
    const res = await getMeOverview(userId);
    if (!res.success) {
      setState('error');
      return;
    }
    setOverview(res);
    if (res.user?.id) {
      if (typeof window !== 'undefined' && !userId) {
        window.localStorage.getItem('mitra:userId');
      }
      const habitRes = await getUserHabits(res.user.id);
      if (habitRes.success) setHabits(habitRes.habits);
    }
    setState('ready');
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveReflection = async () => {
    if (!reflectionText.trim() || !overview?.success) return;
    setSaving(true);
    const res = await addReflection(overview.user.id, reflectionText.trim(), mood || undefined);
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
    const userId = overview?.success ? overview.user.id : (typeof window !== 'undefined' ? window.localStorage.getItem('mitra:userId') : null);
    if (!newHabitName.trim() || !userId) return;
    setAddingHabit(true);
    const res = await addCustomHabit(userId, newHabitName);
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

  const handleDeleteHabit = async (e: React.MouseEvent, habitId: string) => {
    e.stopPropagation();
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
    await deleteHabit(habitId);
  };

  if (state === 'loading') {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center px-6 text-center text-xs text-moon/50">
        Loading your personal reflection space...
      </main>
    );
  }

  if (state === 'error' || !overview?.success) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="max-w-xs text-sm text-moon/80">
          I couldn&apos;t load your growth journey because the connection is unstable. You can
          still continue your work, and I&apos;ll update this once we&apos;re back online.
        </p>
      </main>
    );
  }

  const { user, goal, reflections } = overview;

  const addressee = user.honorific || user.name;
  const daysIn = goal
    ? Math.max(1, Math.floor((now - new Date(goal.createdAt).getTime()) / 86400000) + 1)
    : null;

  // Monthly mood analytics statistics
  const energizedCount = reflections.filter((r) => r.mood === 'Energized').length;
  const calmCount = reflections.filter((r) => r.mood === 'Calm').length;
  const toughCount = reflections.filter((r) => r.mood === 'Tough').length;
  const completedHabitsCount = habits.filter((h) => h.completedToday).length;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-5 px-6 pb-28 [padding-top:max(1.5rem,env(safe-area-inset-top))]">
      {/* Visual Header */}
      <header className="flex items-center justify-between rounded-card border border-morning-sun/20 bg-gradient-to-r from-morning-sun/15 to-cloud-strong p-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-moon">{addressee}</h1>
          </div>
          <p className="text-xs text-earth">Your monthly reflection journal, mood trends, and habit builder.</p>
        </div>
        <MitraDoodleAvatar size={52} />
      </header>

      {/* Daily Rotating Caregiver Motivation & Appreciation Card */}
      <DailyMotivationCard addressee={addressee} />

      {/* 30-Day Goal Banner */}
      {goal && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-card border border-morning-sun/20 bg-gradient-to-r from-morning-sun/15 to-cloud-strong p-4 shadow-xs"
        >
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-morning-sun-strong">
            <span className="flex items-center gap-1.5">
              <Target className="h-4 w-4 text-morning-sun-strong" />
              30-Day Leadership Goal
            </span>
            <span className="rounded-full bg-morning-sun/20 px-2 py-0.5 text-[10px] text-morning-sun-strong">
              Day {daysIn} of 30
            </span>
          </div>
          <p className="mt-2 text-sm font-semibold text-moon">{goal.title}</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-moon/10">
            <div
              className="h-full rounded-full bg-morning-sun transition-all duration-500"
              style={{ width: `${Math.min(100, ((daysIn ?? 0) / 30) * 100)}%` }}
            />
          </div>
        </motion.section>
      )}

      {/* Monthly Wellbeing Analytics Dashboard */}
      <section className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earth">
          <TrendingUp className="h-4 w-4 text-forest" />
          Monthly Wellbeing & Habit Analytics
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-card border border-amber-500/20 bg-amber-500/10 p-3 space-y-1 text-center shadow-xs">
            <span className="text-xl">😄</span>
            <p className="text-base font-bold text-amber-800">{energizedCount}</p>
            <p className="text-[10px] text-amber-700 font-medium">Energized Days</p>
          </div>
          <div className="rounded-card border border-emerald-500/20 bg-emerald-500/10 p-3 space-y-1 text-center shadow-xs">
            <span className="text-xl">😌</span>
            <p className="text-base font-bold text-emerald-800">{calmCount}</p>
            <p className="text-[10px] text-emerald-700 font-medium">Calm Days</p>
          </div>
          <div className="rounded-card border border-purple-500/20 bg-purple-500/10 p-3 space-y-1 text-center shadow-xs">
            <span className="text-xl">🔥</span>
            <p className="text-base font-bold text-purple-800">{maxStreak}d</p>
            <p className="text-[10px] text-purple-700 font-medium">Best Habit Streak</p>
          </div>
        </div>
      </section>

      {/* Habit Builder Section */}
      <section className="rounded-card border border-forest/20 bg-gradient-to-br from-forest/10 via-cloud-strong to-cloud p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-forest/10 pb-2">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-5 w-5 text-forest" />
            <div>
              <h2 className="text-sm font-bold text-moon">Habit Builder & Streak Tracker</h2>
              <p className="text-[11px] text-earth">
                {completedHabitsCount} of {habits.length} habits completed today
              </p>
            </div>
          </div>
          <span className="rounded-full bg-forest/15 px-2.5 py-0.5 text-[10px] font-bold text-forest">
            Daily Rhythm
          </span>
        </div>

        <div className="space-y-2">
          {habits.map((h) => (
            <div
              key={h.id}
              onClick={() => handleToggleHabit(h.id, h.completedToday)}
              className={`flex flex-col gap-2 rounded-button p-3 text-xs border transition-colors cursor-pointer ${
                h.completedToday
                  ? 'bg-forest/15 border-forest/30 text-moon font-medium'
                  : 'bg-cloud border-moon/10 text-moon hover:border-forest/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {h.completedToday ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-forest" />
                  ) : (
                    <Square className="h-4 w-4 shrink-0 text-earth/50" />
                  )}
                  <span className="font-semibold text-moon">{h.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 rounded-full bg-cloud-strong px-2 py-0.5 text-[10px] font-bold text-earth border border-moon/5">
                    🔥 {h.streak} / 30 Days
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteHabit(e, h.id)}
                    className="rounded p-1 text-earth hover:bg-emergency/10 hover:text-emergency transition-colors"
                    title="Delete Habit"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* 30-Day Streak Progress Visual Bar */}
              <div className="space-y-1 pt-1 border-t border-moon/5">
                <div className="flex justify-between text-[9px] text-earth font-medium">
                  <span>30-Day Habit Completion Streak</span>
                  <span>{Math.min(100, Math.round((h.streak / 30) * 100))}% Goal</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-moon/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-forest to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (h.streak / 30) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-forest/10">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddHabit();
              }
            }}
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
      <section className="rounded-card border border-moon/10 bg-cloud-strong p-4 space-y-3 shadow-xs">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-earth">
          <Sparkles className="h-4 w-4 text-morning-sun-strong" />
          Log Today&apos;s Mood & Reflection
        </p>

        <div className="flex gap-2">
          {MOODS.map((m) => {
            const Icon = m.icon;
            const isSelected = mood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-button py-2.5 text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-morning-sun text-white border-morning-sun shadow-xs'
                    : 'bg-cloud border-moon/10 text-moon hover:bg-moon/5'
                }`}
              >
                <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : ''}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
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

      {/* Day-Wise Longitudinal Mood & Reflection Log (Last 30 Days Timeline) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-earth">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-river" />
            Longitudinal Mood & Reflection History ({reflections.length})
          </span>
          <span className="text-[10px] text-earth font-normal">Last 30 Days</span>
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
              const Icon = moodItem?.icon;

              return (
                <div
                  key={r.id}
                  className="rounded-card border border-moon/10 bg-cloud-strong p-3.5 space-y-1.5 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-moon">{dateStr}</span>
                    <div className="flex items-center gap-2">
                      {moodItem && Icon && (
                        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${moodItem.color}`}>
                          <Icon className="h-3 w-3" />
                          {moodItem.label}
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
