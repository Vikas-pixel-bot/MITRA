'use client';

import React from 'react';
import { Home, MessageCircle, ClipboardList, AlertTriangle } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'chat' | 'journal' | 'incident';
  onChangeTab: (tab: 'home' | 'chat' | 'journal' | 'incident') => void;
}

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  return (
    <nav className="absolute bottom-0 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        <button 
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            activeTab === 'home' 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Home className={`w-6 h-6 ${activeTab === 'home' ? 'fill-current opacity-20' : ''}`} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        
        <button 
          onClick={() => onChangeTab('chat')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors relative ${
            activeTab === 'chat' 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <MessageCircle className={`w-6 h-6 ${activeTab === 'chat' ? 'fill-current opacity-20' : ''}`} />
            {activeTab !== 'chat' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            )}
          </div>
          <span className="text-[10px] font-medium">Mitra AI</span>
        </button>

        <button 
          onClick={() => onChangeTab('journal')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            activeTab === 'journal' 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <ClipboardList className={`w-6 h-6 ${activeTab === 'journal' ? 'fill-current opacity-20' : ''}`} />
          <span className="text-[10px] font-medium">Journal</span>
        </button>

        <button 
          onClick={() => onChangeTab('incident')}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            activeTab === 'incident' 
              ? 'text-blue-600 dark:text-blue-400' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <AlertTriangle className={`w-6 h-6 ${activeTab === 'incident' ? 'fill-current opacity-20' : ''}`} />
          <span className="text-[10px] font-medium">Incident</span>
        </button>
      </div>
    </nav>
  );
}
