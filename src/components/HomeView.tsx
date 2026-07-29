'use client';

import React from 'react';
import { Heart, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

interface HomeViewProps {
  setActiveTab?: (tab: 'home' | 'chat' | 'journal' | 'incident') => void;
}

export default function HomeView({ setActiveTab }: HomeViewProps) {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 font-sans overflow-y-auto no-scrollbar pb-24">
      {/* Header */}
      <header className="px-5 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm flex justify-between items-center">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigoCustom-700 dark:text-indigo-400">Warden Portal</span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">Admin Dashboard</h1>
        </div>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-extrabold shadow-md shadow-amber-500/20 shrink-0">
          KM
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 flex flex-col gap-6">
        
        {/* Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-sm">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg. Stress Index</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">4.2 <span className="text-sm font-medium text-slate-400">/ 5.0</span></span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">Stable</span>
            </div>
            <p className="text-[10px] text-slate-500">Based on self-reported logs</p>
          </div>

          <div 
            onClick={() => setActiveTab && setActiveTab('incident')}
            className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 shadow-sm cursor-pointer active:scale-95 transition-transform group hover:border-amber-300"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Incidents</span>
              <ShieldAlert className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">1 <span className="text-sm font-medium text-slate-400">Pending</span></span>
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">Action Req</span>
            </div>
            <p className="text-[10px] text-slate-500">Tap to review & resolve</p>
          </div>
        </div>

        {/* Visual Log Tracker */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold uppercase text-slate-500 tracking-wider">Daily Synthesized Logs</h3>
            <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3"/> Live Preview</span>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col gap-2 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider text-[9px]">Attendance</span>
                <span className="text-[10px] text-slate-400">8:15 AM</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Attendance completed with 120 present</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex flex-col gap-2 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider text-[9px]">Health Event</span>
                <span className="text-[10px] text-slate-400">11:30 AM</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Two student fever cases registered. Meds administered.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setActiveTab && setActiveTab('chat')}
            className="mt-5 w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Open Chat to Log New Entry
          </button>
        </div>

        {/* Warden Profile Concept */}
        <div className="bg-indigoCustom-50 dark:bg-indigo-900/20 border border-indigoCustom-100 dark:border-indigo-900/50 rounded-xl p-5 space-y-4 shadow-inner">
          <h4 className="font-extrabold text-indigoCustom-700 dark:text-indigo-400 uppercase tracking-widest text-[10px]">Warden's Active Context</h4>
          
          <div className="space-y-2 bg-white dark:bg-slate-900/50 p-4 rounded-lg border border-indigoCustom-100/50 dark:border-indigo-900/30">
            <div className="flex justify-between font-semibold text-slate-800 dark:text-slate-200 text-xs">
              <span>Recent Concern:</span>
              <span className="text-brand-600 dark:text-amber-500">Rani (Homesick)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed mt-2">
              Mitra has flagged this and will ask on the next checkpoint: "How is Rani feeling today? Did she talk to her mother?"
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
