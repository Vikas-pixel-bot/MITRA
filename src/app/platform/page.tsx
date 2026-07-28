'use client';

import React, { useState } from 'react';
import HomeView from '@/components/HomeView';
import ChatView from '@/components/ChatView';
import JournalView from '@/components/JournalView';
import IncidentTrackerView from '@/components/IncidentTrackerView';
import BottomNav from '@/components/BottomNav';

export default function PlatformShell() {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'journal' | 'incident'>('home');

  return (
    <div className="relative flex flex-col h-full h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden pb-16">
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'journal' && <JournalView setActiveTab={setActiveTab} />}
        {activeTab === 'incident' && <IncidentTrackerView />}
      </div>

      {/* Persistent Bottom Navigation */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      
    </div>
  );
}
