'use client';

import React from 'react';
import { Home, MessageCircle, ClipboardList, AlertTriangle } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'chat' | 'journal' | 'incident';
  onChangeTab: (tab: 'home' | 'chat' | 'journal' | 'incident') => void;
}

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'Mitra AI', icon: MessageCircle, badge: true },
    { id: 'journal', label: 'Journal', icon: ClipboardList },
    { id: 'incident', label: 'Incidents', icon: AlertTriangle },
  ] as const;

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-1.5 shadow-2xl shadow-blue-950/40 z-50">
      <div className="flex items-center justify-between relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
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
    </div>
  );
}
