'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Droplets, Utensils, MessageCircle, Moon, FileText, Loader2 } from 'lucide-react';
import { getTodayHabits, toggleHabitLog } from '@/actions/db';

type Habit = {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
};

// Map string icon names to Lucide components
const IconMap: Record<string, React.ReactNode> = {
  Droplets: <Droplets className="w-5 h-5 text-blue-500" />,
  Utensils: <Utensils className="w-5 h-5 text-orange-500" />,
  MessageCircle: <MessageCircle className="w-5 h-5 text-green-500" />,
  FileText: <FileText className="w-5 h-5 text-purple-500" />,
  Moon: <Moon className="w-5 h-5 text-indigo-500" />,
};

interface JournalViewProps {
  setActiveTab?: (tab: 'home' | 'chat' | 'journal' | 'incident') => void;
}

export default function JournalView({ setActiveTab }: JournalViewProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHabits() {
      const res = await getTodayHabits();
      if (res.success) {
        setHabits(res.habits);
      }
      setLoading(false);
    }
    loadHabits();
  }, []);

  const toggleHabit = async (id: string) => {
    // Optimistic UI update
    const targetHabit = habits.find(h => h.id === id);
    if (!targetHabit) return;
    
    const newStatus = !targetHabit.completed;
    setHabits(habits.map(h => h.id === id ? { ...h, completed: newStatus } : h));

    // Background DB update
    await toggleHabitLog(id, newStatus);
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progressPercentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 font-sans overflow-y-auto no-scrollbar pb-24">
      
      {/* Header */}
      <header className="px-5 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Habits & Journal</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your daily self-care and routines.</p>
      </header>

      <main className="px-5 py-6 flex flex-col gap-8">
        
        {/* Progress Card */}
        <section className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-3">
            <div>
              <h2 className="font-bold text-lg text-slate-800 dark:text-slate-200">Daily Progress</h2>
              <p className="text-xs text-slate-500 mt-1">{completedCount} of {habits.length} habits completed</p>
            </div>
            <span className="text-xl font-bold text-blue-600">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </section>

        {/* Habit List */}
        <section>
          <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-4 px-1">Today's Habits</h3>
          <div className="flex flex-col gap-3">
            {habits.map(habit => (
              <button 
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] ${
                  habit.completed 
                    ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300'
                }`}
              >
                <div className="shrink-0">
                  {habit.completed ? (
                    <CheckCircle2 className="w-7 h-7 text-blue-500" />
                  ) : (
                    <Circle className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
                <div className="flex items-center gap-3 flex-1 text-left">
                  <div className={`p-2 rounded-xl ${habit.completed ? 'bg-white dark:bg-slate-800 shadow-sm' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                    {IconMap[habit.icon] || <Circle className="w-5 h-5 text-slate-500" />}
                  </div>
                  <span className={`font-semibold text-sm ${habit.completed ? 'text-blue-900 dark:text-blue-100' : 'text-slate-700 dark:text-slate-300'}`}>
                    {habit.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* End of Day Reflection Prompt */}
        <section className="mt-2 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <h3 className="font-bold text-lg mb-2 relative z-10">Evening Reflection</h3>
          <p className="text-indigo-100 text-sm mb-4 relative z-10 leading-relaxed">
            Take a moment to process your day. What challenged you today, and what went well?
          </p>
          <button 
            onClick={() => setActiveTab && setActiveTab('chat')}
            className="bg-white text-indigo-600 px-5 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform relative z-10"
          >
            Start Journal Entry
          </button>
        </section>

      </main>
    </div>
  );
}
