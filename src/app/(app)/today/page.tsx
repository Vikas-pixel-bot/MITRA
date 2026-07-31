'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MessageCircle,
  ShieldAlert,
  BookOpen,
  FileText,
  Clock,
  Droplets,
  Heart,
  Sparkles,
  CheckSquare,
  Square,
  Plus,
  Bell,
  X,
  Smile,
  Meh,
  Frown,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { getTodayBriefing } from '@/actions/today';
import { getNotifications, dismissNotification } from '@/actions/notifications';
import { submitDailyLog, getTodayLogs } from '@/actions/dailyLog';
import { getProactiveCheckpoints, CheckpointPrompt } from '@/actions/proactive';
import { getTodayTasks, toggleTaskCompleted, addTodayTask, deleteTask, TaskItem } from '@/actions/tasks';
import { addReflection } from '@/actions/me';
import { WelcomeIllustration } from '@/components/illustrations/WelcomeIllustration';
import { DailyMotivationCard } from '@/components/cards/DailyMotivationCard';

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
const MOODS = [
  { label: 'Energized', icon: Smile, color: 'text-forest bg-forest/10' },
  { label: 'Calm', icon: Heart, color: 'text-river bg-river/10' },
  { label: 'Exhausted', icon: Frown, color: 'text-clay bg-clay/10' },
];

export default function TodayPage() {
  const [state, setState] = useState<'loading' | 'no-user' | 'offline' | 'error' | 'ready'>(
    'loading'
  );
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [dismissing, setDismissing] = useState<string | null>(null);

  // Proactive companion state
  const [checkpoint, setCheckpoint] = useState<CheckpointPrompt | null>(null);
  const [waterCount, setWaterCount] = useState(2);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodSaved, setMoodSaved] = useState(false);

  // Tasks & Checklist
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [addingTask, setAddingTask] = useState(false);

  // Daily Log Modal
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState('');
  const [sickCount, setSickCount] = useState('');
  const [mealQuality, setMealQuality] = useState<string | null>(null);
  const [logNotes, setLogNotes] = useState('');
  const [savingLog, setSavingLog] = useState(false);
  const [todayLogs, setTodayLogs] = useState<LogEntry[]>([]);

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
          if (result.user?.id && typeof window !== 'undefined' && !userId) {
            window.localStorage.setItem('mitra:userId', result.user.id);
          }
          getNotifications(result.user.id).then((notifRes) => {
            if (notifRes.success) setReminders(notifRes.notifications);
          });
          getTodayLogs(result.user.id).then((logResult) => {
            if (logResult.success) setTodayLogs(logResult.logs);
          });
          getTodayTasks(result.user.id).then((taskRes) => {
            if (taskRes.success) setTasks(taskRes.tasks);
          });
        } else {
          setState('error');
        }
      })
      .catch(() => setState('error'));

    getProactiveCheckpoints(userId).then((res) => {
      if (res.success && res.activeCheckpoint) {
        setCheckpoint(res.activeCheckpoint);
      }
    });
  }, []);

  const openFloatingChat = (query?: string) => {
    window.dispatchEvent(new CustomEvent('open-mitra-chat', { detail: { query } }));
  };

  const handleToggleTask = async (taskId: string, currentCompleted: boolean) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !currentCompleted } : t))
    );
    await toggleTaskCompleted(taskId, !currentCompleted);
  };

  const handleAddTask = async () => {
    const userId = briefing?.success ? briefing.user.id : (typeof window !== 'undefined' ? window.localStorage.getItem('mitra:userId') : null);
    if (!newTaskTitle.trim() || !userId) return;
    setAddingTask(true);
    const res = await addTodayTask(userId, newTaskTitle, newTaskTime);
    if (res.success && res.task) {
      setTasks((prev) => [
        ...prev,
        {
          id: res.task.id,
          title: res.task.title,
          completed: res.task.completed,
          timeSlot: res.task.timeSlot,
          createdAt: typeof res.task.createdAt === 'string' ? res.task.createdAt : new Date(res.task.createdAt).toISOString(),
        },
      ]);
      setNewTaskTitle('');
      setNewTaskTime('');
    }
    setAddingTask(false);
  };

  const handleDeleteTask = async (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTask(taskId);
  };

  const handleSaveMood = async (moodLabel: string) => {
    setSelectedMood(moodLabel);
    setMoodSaved(true);
    if (briefing?.success) {
      await addReflection(briefing.user.id, `Logged daily mood check-in: ${moodLabel}`, moodLabel);
    }
  };

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
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-5 px-6 pb-28 [padding-top:max(1.5rem,env(safe-area-inset-top))]">
      {/* Visual Header Banner with Rich Colors */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-card bg-gradient-to-br from-morning-sun/20 via-cloud-strong to-forest/10 p-5 border border-morning-sun/20 shadow-xs"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-[200px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-morning-sun/20 px-2.5 py-0.5 text-[11px] font-semibold text-morning-sun-strong">
              <Sparkles className="h-3 w-3" /> Proactive Companion
            </span>
            <h1 className="text-xl font-bold tracking-tight text-moon">
              Namaskar, {addressee}! 🙏
            </h1>
            <p className="text-xs text-earth">
              I&apos;m right here with you to guide today&apos;s hostel rhythm.
            </p>
          </div>
          <div className="h-20 w-24 shrink-0 overflow-hidden rounded-card shadow-xs">
            <WelcomeIllustration />
          </div>
        </div>

        {/* In-place Mood Check-In Widget (No redirect to chat needed!) */}
        <div className="mt-4 rounded-button bg-cloud/90 p-3 border border-moon/10 space-y-2">
          <p className="text-xs font-semibold text-moon flex items-center justify-between">
            <span>How are you feeling right now today?</span>
            {moodSaved && <span className="text-[10px] text-forest font-medium">✓ Mood Logged</span>}
          </p>
          <div className="flex gap-2">
            {MOODS.map(({ label, icon: Icon, color }) => (
              <button
                key={label}
                onClick={() => handleSaveMood(label)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-button py-2 px-2 text-xs font-medium border transition-all ${
                  selectedMood === label
                    ? 'border-morning-sun-strong bg-morning-sun/20 font-bold text-moon'
                    : 'border-moon/10 bg-cloud-strong text-moon hover:bg-moon/5'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 text-morning-sun-strong" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Proactive Checkpoint & Hydration Widget */}
      {checkpoint && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-card border border-river/30 bg-gradient-to-r from-river/10 to-cloud-strong p-4 shadow-xs"
        >
          <div className="flex items-center justify-between border-b border-moon/10 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-river">
              <Clock className="h-4 w-4" />
              Proactive Checkpoint ({checkpoint.timeSlot})
            </div>
            <span className="rounded-full bg-river/15 px-2 py-0.5 text-[10px] font-semibold text-river">
              Active Routine
            </span>
          </div>

          <h2 className="mt-2 text-base font-semibold text-moon">{checkpoint.title}</h2>
          <p className="mt-1 text-xs text-earth">{checkpoint.subtitle}</p>

          {/* Hydration Tracker (In-place action) */}
          <div className="mt-3 flex items-center justify-between rounded-button bg-cloud p-3 border border-moon/5">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-river" />
              <div>
                <p className="text-xs font-semibold text-moon">Hydration Reminder</p>
                <p className="text-[11px] text-earth">{waterCount} of 4 glasses taken today</p>
              </div>
            </div>
            <button
              onClick={() => setWaterCount((prev) => Math.min(6, prev + 1))}
              className="flex items-center gap-1 rounded-button bg-river/15 px-3 py-1.5 text-xs font-semibold text-river hover:bg-river/25"
            >
              + Drink Water
            </button>
          </div>
        </motion.section>
      )}

      {/* Today's Checklist & Reminders Section (Night Checkoff) */}
      <section className="rounded-card border border-moon/10 bg-cloud-strong p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-moon/10 pb-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-morning-sun-strong" />
            <div>
              <h2 className="text-sm font-bold text-moon">Today&apos;s Routine Checklist</h2>
              <p className="text-[11px] text-earth">
                {completedCount} of {tasks.length} tasks completed today
              </p>
            </div>
          </div>
          <span className="rounded-full bg-morning-sun/15 px-2.5 py-0.5 text-[10px] font-bold text-morning-sun-strong">
            Check off before sleep
          </span>
        </div>

        {/* Task list items */}
        <div className="space-y-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => handleToggleTask(t.id, t.completed)}
              className={`flex cursor-pointer items-center justify-between rounded-button p-3 text-xs border transition-colors ${
                t.completed
                  ? 'bg-forest/10 border-forest/20 text-moon/60 line-through'
                  : 'bg-cloud border-moon/10 text-moon hover:border-morning-sun/30'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {t.completed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-forest" />
                ) : (
                  <Square className="h-4 w-4 shrink-0 text-earth/50" />
                )}
                <span className="font-medium">{t.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {t.timeSlot && (
                  <span className="shrink-0 rounded bg-cloud-strong px-2 py-0.5 text-[10px] text-earth font-mono">
                    {t.timeSlot}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => handleDeleteTask(e, t.id)}
                  className="rounded p-1 text-earth hover:bg-emergency/10 hover:text-emergency transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add custom routine task input with Time input */}
        <div className="flex flex-col gap-2 pt-2 border-t border-moon/10 sm:flex-row sm:items-center">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTask();
              }
            }}
            placeholder="Routine task (e.g. Inspect RO Filter)..."
            className="flex-1 rounded-button border border-moon/10 bg-cloud px-3 py-2 text-xs text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTask();
                }
              }}
              placeholder="Time (e.g. 5:30 PM)"
              className="w-32 rounded-button border border-moon/10 bg-cloud px-3 py-2 text-xs text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
            />
            <button
              disabled={addingTask || !newTaskTitle.trim()}
              onClick={handleAddTask}
              className="flex h-9 min-w-[36px] items-center justify-center rounded-button bg-morning-sun px-3 text-xs font-semibold text-white shadow-xs hover:bg-morning-sun-strong disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Action Trigger Buttons */}
      <section className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-earth">Need Assistance or SOP Guidance?</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => openFloatingChat('I want to report an urgent incident in the hostel.')}
            className="flex flex-col items-start gap-2 rounded-button p-3.5 border bg-clay/10 border-clay/30 hover:bg-clay/20 text-left"
          >
            <ShieldAlert className="h-5 w-5 text-clay" />
            <span className="text-xs font-bold text-clay">Report an Incident</span>
          </button>

          <button
            onClick={() => openFloatingChat('Help me with hostel operations SOP and guidance.')}
            className="flex flex-col items-start gap-2 rounded-button p-3.5 border bg-cloud-strong border-moon/10 hover:border-morning-sun/30 text-left"
          >
            <MessageCircle className="h-5 w-5 text-morning-sun-strong" />
            <span className="text-xs font-semibold text-moon">Seek AI Guidance</span>
          </button>
        </div>
      </section>

      {/* Daily Digital Register Button & Records */}
      <section className="rounded-card border border-forest/20 bg-forest/5 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-forest" />
            <div>
              <h2 className="text-sm font-semibold text-moon">Daily Digital Register</h2>
              <p className="text-[11px] text-earth">Log student presence, health events, or food quality directly</p>
            </div>
          </div>
          <button
            onClick={() => setLogModalOpen(true)}
            className="rounded-button bg-forest px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-forest/90"
          >
            + New Log
          </button>
        </div>

        {todayLogs.length > 0 && (
          <div className="space-y-2 border-t border-forest/10 pt-2">
            <p className="text-[11px] font-semibold uppercase text-earth">Today&apos;s Saved Logs</p>
            {todayLogs.map((log) => (
              <div key={log.id} className="rounded-button bg-cloud p-2.5 text-xs border border-moon/5 space-y-1">
                <div className="flex justify-between text-moon font-medium">
                  <span>Presence: {log.attendanceCount ?? 'N/A'}</span>
                  <span>Sick: {log.sickCount ?? 0}</span>
                  {log.mealQuality && <span>Meal: {log.mealQuality}</span>}
                </div>
                {log.notes && <p className="text-earth text-[11px] italic">{log.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reminders & Notifications */}
      {reminders.length > 0 && (
        <section className="rounded-card bg-cloud-strong p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earth">
            <Bell className="h-4 w-4 text-morning-sun-strong" />
            Active Superintendent Alerts ({reminders.length})
          </div>
          <div className="space-y-2">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="flex items-center justify-between rounded-button bg-cloud p-3 text-xs border border-moon/5"
              >
                <div>
                  <p className="font-semibold text-moon">{rem.title}</p>
                  <p className="text-earth">{rem.message}</p>
                </div>
                <button
                  disabled={dismissing === rem.id}
                  onClick={() => handleDismiss(rem.id)}
                  className="rounded p-1 text-earth hover:bg-moon/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Daily Digital Log Modal */}
      {logModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-moon/40 backdrop-blur-xs p-0 sm:items-center sm:p-4">
          <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-cloud p-6 shadow-xl sm:rounded-card space-y-4">
            <div className="flex items-center justify-between border-b border-moon/10 pb-3">
              <h2 className="text-base font-semibold text-moon">Daily Register Entry</h2>
              <button onClick={() => setLogModalOpen(false)} className="text-earth hover:text-moon">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-moon">Student Attendance</label>
                  <input
                    type="number"
                    value={attendanceCount}
                    onChange={(e) => setAttendanceCount(e.target.value)}
                    placeholder="e.g. 118"
                    className="mt-1 w-full rounded-button border border-moon/10 bg-cloud-strong p-2.5 text-sm text-moon focus:border-morning-sun focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-moon">Sick Room Count</label>
                  <input
                    type="number"
                    value={sickCount}
                    onChange={(e) => setSickCount(e.target.value)}
                    placeholder="e.g. 2"
                    className="mt-1 w-full rounded-button border border-moon/10 bg-cloud-strong p-2.5 text-sm text-moon focus:border-morning-sun focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-moon">Hostel Meal Quality</label>
                <div className="mt-1 flex gap-2">
                  {MEAL_QUALITY.map((mq) => (
                    <button
                      key={mq}
                      onClick={() => setMealQuality(mq)}
                      className={`flex-1 rounded-button py-2 text-xs font-medium border ${
                        mealQuality === mq
                          ? 'bg-morning-sun text-white border-morning-sun'
                          : 'bg-cloud-strong border-moon/10 text-moon'
                      }`}
                    >
                      {mq}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-moon">Notes / Incident Observation</label>
                <textarea
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="Record any specific hostel update or child care observation..."
                  rows={3}
                  className="mt-1 w-full resize-none rounded-button border border-moon/10 bg-cloud-strong p-2.5 text-sm text-moon focus:border-morning-sun focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-moon/10">
              <button
                disabled={savingLog}
                onClick={handleSubmitLog}
                className="flex-1 min-h-[44px] rounded-button bg-forest text-xs font-semibold text-white shadow-xs"
              >
                {savingLog ? 'Saving...' : 'Save to Register'}
              </button>
              <button
                onClick={() => setLogModalOpen(false)}
                className="min-h-[44px] px-4 rounded-button border border-moon/10 text-xs font-semibold text-moon"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
