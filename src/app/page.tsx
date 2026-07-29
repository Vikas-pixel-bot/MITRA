'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  ShieldAlert, 
  MessageSquare, 
  HeartHandshake, 
  Home, 
  FileText, 
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Sunset
} from 'lucide-react';

export default function MitraPwaShell() {
  const [activeTab, setActiveTab] = useState<'home' | 'ai' | 'incidents' | 'journal'>('home');
  const [timeState, setTimeState] = useState<{ period: string; title: string; subtitle: string; icon: any }>({
    period: 'Morning Routine',
    title: '6:30 AM Wake-Up & Breakfast',
    subtitle: '120 Students Expected • Check Sick Bay Log',
    icon: Sun,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeState({
        period: 'Morning Routine',
        title: 'Morning Attendance & Breakfast',
        subtitle: 'Focus: Verify student headcount and sick bay check',
        icon: Sun,
      });
    } else if (hour >= 12 && hour < 17) {
      setTimeState({
        period: 'Mid-Day Checkpoint',
        title: 'Afternoon Health & Meal Audit',
        subtitle: 'Focus: Review student fever logs & dining hygiene',
        icon: Sun,
      });
    } else if (hour >= 17 && hour < 21) {
      setTimeState({
        period: 'Evening Duty',
        title: 'Study Hour & Restorative Resolution',
        subtitle: 'Focus: Check evening study hall & resolve pending incidents',
        icon: Sunset,
      });
    } else {
      setTimeState({
        period: 'Night Reflection',
        title: 'Warden Wellbeing & Quiet Check-in',
        subtitle: 'Focus: 2-minute personal reflection before sleep',
        icon: Moon,
      });
    }
  }, []);

  const TimeIcon = timeState.icon;

  return (
    <div className="relative min-h-[100dvh] w-full max-w-md mx-auto bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden shadow-2xl border-x border-slate-900 font-sans pb-24">
      
      {/* Top Ambient Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 blur-3xl rounded-full pointer-events-none" />

      {/* Header Bar */}
      <header className="px-6 pt-6 pb-4 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20 border-b border-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Ashram School PWA</span>
            <h1 className="text-base font-black text-white tracking-tight">MITRA Companion</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 px-6 py-6 overflow-y-auto space-y-6 z-10">
        
        {/* 15-SECOND RULE PRIORITY CARD */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 p-6 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-2xl rounded-full" />
          
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <TimeIcon className="w-4 h-4" />
              <span>{timeState.period}</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 bg-slate-800/80 px-2.5 py-0.5 rounded-full">
              15-Sec Priority
            </span>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight leading-snug">
            {timeState.title}
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {timeState.subtitle}
          </p>

          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <button 
              onClick={() => setActiveTab('ai')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-3.5 px-4 rounded-2xl transition-all shadow-lg shadow-blue-950/50 flex items-center justify-center gap-2 group"
            >
              <span>Talk to Mitra to Log Progress</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* PROACTIVE AI LAW HIGHLIGHT: "Humans Over Forms" */}
        <section className="bg-slate-900/50 p-5 rounded-3xl border border-slate-800/80 backdrop-blur-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              MITRA Law 2 • Humans Over Forms
            </span>
            <Clock className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <p className="text-xs font-medium text-slate-300 leading-relaxed">
            "No 12-field forms here. Simply tell Mitra what happened at the hostel, and AI will synthesize the official records for you."
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={() => setActiveTab('incidents')}
              className="p-3.5 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-slate-800/80 text-left transition-all group"
            >
              <ShieldAlert className="w-5 h-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Log Incident</span>
              <span className="text-[10px] text-slate-500 block">Restorative advice</span>
            </button>

            <button 
              onClick={() => setActiveTab('journal')}
              className="p-3.5 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-slate-800/80 text-left transition-all group"
            >
              <HeartHandshake className="w-5 h-5 text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold text-white block">Quiet Reflection</span>
              <span className="text-[10px] text-slate-500 block">2-min Warden check-in</span>
            </button>
          </div>
        </section>

        {/* ACTIVE CONTEXT & MEMORY CARD (MITRA Law 6) */}
        <section className="bg-gradient-to-r from-indigo-950/30 to-purple-950/20 p-5 rounded-3xl border border-indigo-500/20 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            <span>Mitra Memory Active</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <p className="text-xs text-slate-300 font-medium">
            "Last week you flagged concerns about student homesickness. Mitra will follow up during your evening reflection."
          </p>
        </section>

      </main>

      {/* FLOATING GLASSMOBILE NAVBAR */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-1.5 shadow-2xl shadow-blue-950/50 z-50">
        <div className="flex items-center justify-between">
          {[
            { id: 'home', label: 'Home', icon: Home, badge: false },
            { id: 'ai', label: 'Mitra AI', icon: MessageSquare, badge: true },
            { id: 'incidents', label: 'Incidents', icon: ShieldAlert, badge: false },
            { id: 'journal', label: 'Journal', icon: FileText, badge: false },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                  {tab.badge && !isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                  )}
                </div>
                {isActive && (
                  <span className="text-xs font-bold tracking-wide animate-in fade-in slide-in-from-left-2 duration-300">
                    {tab.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
