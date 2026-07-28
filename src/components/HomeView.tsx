'use client';

import React, { useState, useEffect } from 'react';
import { Sun, CheckCircle2, AlertTriangle, BookOpen, User, Bell, X, Send } from 'lucide-react';

interface HomeViewProps {
  setActiveTab?: (tab: 'home' | 'chat' | 'journal' | 'incident') => void;
}

export default function HomeView({ setActiveTab }: HomeViewProps) {
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  // Check-in modal form state
  const [checkInSteps, setCheckInSteps] = useState({ attendance: false, kitchen: false, hygiene: false });

  // Digital register state
  const [attendanceCount, setAttendanceCount] = useState('');

  const currentHour = new Date().getHours();
  let greeting = "Good afternoon";
  if (currentHour < 12) greeting = "Good morning";
  else if (currentHour >= 18) greeting = "Good evening";

  // Auto-open check-in on first visit of the day
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastCheckIn = localStorage.getItem('mitra_last_checkin');
    
    // Only auto-open if it's morning and they haven't checked in
    if (lastCheckIn !== today && currentHour < 12) {
      // Add a slight delay for better UX
      const timer = setTimeout(() => setIsCheckInModalOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [currentHour]);

  const handleCheckInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('mitra_last_checkin', today);
    setIsCheckInModalOpen(false);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving attendance
    setIsRegisterModalOpen(false);
    setAttendanceCount('');
    alert(`Attendance of ${attendanceCount} recorded successfully!`);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 font-sans overflow-y-auto no-scrollbar pb-24 relative">
      {/* Header */}
      <header className="px-5 py-6 bg-blue-600 text-white rounded-b-3xl shadow-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Warden Dashboard</p>
              <h1 className="text-xl font-bold">{greeting}, Warden</h1>
            </div>
          </div>
          <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border border-blue-600"></span>
          </button>
        </div>

        {/* Highlight Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="flex items-start gap-3">
            <Sun className="w-6 h-6 text-yellow-300 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg">Daily Morning Routine</h3>
              <p className="text-blue-100 text-sm mt-1 mb-3">Time to check attendance and kitchen preparations.</p>
              <button 
                onClick={() => setIsCheckInModalOpen(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-sm w-full active:scale-95 transition-transform"
              >
                Start Check-in
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-5 py-6 flex flex-col gap-6">
        
        {/* Quick Actions */}
        <section>
          <h2 className="text-slate-800 dark:text-white font-bold text-lg mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveTab && setActiveTab('incident')}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Log Incident</span>
            </button>
            <button 
              onClick={() => setIsRegisterModalOpen(true)}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3 active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Digital Register</span>
            </button>
          </div>
        </section>

        {/* SEL & Learning */}
        <section>
          <h2 className="text-slate-800 dark:text-white font-bold text-lg mb-4">Wellbeing & Learning</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">SEL Coaching Module</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Managing conflict with empathy</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3">
                <div className="bg-purple-500 w-1/3 h-full rounded-full"></div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Check-in Modal Overlay */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-5">
          <div className="bg-white dark:bg-slate-900 w-full sm:w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl p-6 animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Morning Check-in</h2>
              <button onClick={() => setIsCheckInModalOpen(false)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCheckInSubmit} className="flex flex-col gap-4">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer active:scale-[0.98] transition-transform">
                <input 
                  type="checkbox" 
                  checked={checkInSteps.attendance}
                  onChange={(e) => setCheckInSteps({...checkInSteps, attendance: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">Student attendance completed</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer active:scale-[0.98] transition-transform">
                <input 
                  type="checkbox" 
                  checked={checkInSteps.kitchen}
                  onChange={(e) => setCheckInSteps({...checkInSteps, kitchen: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">Kitchen & breakfast inspected</span>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer active:scale-[0.98] transition-transform">
                <input 
                  type="checkbox" 
                  checked={checkInSteps.hygiene}
                  onChange={(e) => setCheckInSteps({...checkInSteps, hygiene: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">Dormitory hygiene checked</span>
              </label>
              
              <button 
                type="submit" 
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
              >
                Complete Check-in
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Digital Register Modal Overlay */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-5">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-xl p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Digital Register</h2>
              <button onClick={() => setIsRegisterModalOpen(false)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Total Present Students
                </label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={attendanceCount}
                  onChange={(e) => setAttendanceCount(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g. 45"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Save Record
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
