'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, FileText, Loader2, Send } from 'lucide-react';
import { getUnresolvedIncident, logIncident, resolveIncident } from '@/actions/incidents';

type Incident = {
  id: string;
  description: string;
  suggestedAction: string | null;
  status: string;
};

export default function IncidentTrackerView() {
  const [loading, setLoading] = useState(true);
  const [unresolvedIncident, setUnresolvedIncident] = useState<Incident | null>(null);
  
  // State for logging a new incident
  const [newDescription, setNewDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justLoggedIncident, setJustLoggedIncident] = useState<Incident | null>(null);

  // State for resolving
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await getUnresolvedIncident();
      if (res.success && res.incident) {
        setUnresolvedIncident(res.incident);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleLogIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDescription.trim()) return;

    setIsSubmitting(true);
    let suggestedAction = "Please follow standard protocol. Evaluate the situation calmly.";
    
    try {
      // Get AI suggestion
      const response = await fetch('/api/incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newDescription }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.suggestedAction) {
          suggestedAction = data.suggestedAction;
        }
      }
    } catch (error) {
      console.error('Error getting AI advice for incident:', error);
      // fallback advice already set
    }

    try {
      // Save to DB even if AI failed
      const res = await logIncident(newDescription, suggestedAction);
      if (res.success && res.incident) {
        setJustLoggedIncident(res.incident);
        setNewDescription('');
      } else {
        alert("Failed to save the incident to the database. Please try again.");
      }
    } catch (error) {
      console.error('Error saving incident to DB:', error);
      alert("A network error occurred while saving. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unresolvedIncident || !resolutionNotes.trim()) return;

    setIsResolving(true);
    const res = await resolveIncident(unresolvedIncident.id, resolutionNotes);
    if (res.success) {
      setUnresolvedIncident(null);
      setResolutionNotes('');
    }
    setIsResolving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 font-sans overflow-y-auto no-scrollbar pb-28 text-slate-100">
      {/* Header */}
      <header className="px-6 py-6 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800/80 sticky top-0 z-10 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">Restorative Care</span>
          <h1 className="text-2xl font-black tracking-tight text-white mt-1">Incident Tracker</h1>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>
      </header>

      <main className="px-6 py-6 flex flex-col gap-6 max-w-xl mx-auto w-full">
        
        {/* Unresolved Incident Follow-up Card */}
        {unresolvedIncident && (
          <section className="bg-gradient-to-b from-rose-950/40 to-slate-900/60 p-6 rounded-3xl border border-rose-500/30 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <h2 className="font-bold text-rose-200 tracking-wide text-sm">Action Required</h2>
              </div>
              <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">Pending Follow-up</span>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-sm text-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">What Happened</span>
              {unresolvedIncident.description}
            </div>

            {unresolvedIncident.suggestedAction && (
              <div className="bg-blue-950/30 p-4 rounded-2xl border border-blue-500/30 text-sm text-blue-100 space-y-1">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <span>Mitra's Guidance</span>
                </div>
                <p className="leading-relaxed text-slate-200 text-xs mt-1">{unresolvedIncident.suggestedAction}</p>
              </div>
            )}
            
            <form onSubmit={handleResolve} className="flex flex-col gap-3 pt-2">
              <label className="text-xs font-semibold text-slate-300">Resolution Notes & Restorative Measures:</label>
              <textarea
                className="w-full p-3.5 rounded-2xl border border-slate-800 bg-slate-900/90 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 min-h-[90px] transition-all"
                placeholder="Describe how the situation was handled and restorative steps taken..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isResolving}
                className="w-full bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-rose-950/50 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isResolving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Mark Incident as Resolved
              </button>
            </form>
          </section>
        )}

        {/* Recently Logged Incident Feedback */}
        {justLoggedIncident && !unresolvedIncident && (
          <section className="bg-gradient-to-b from-blue-950/40 to-slate-900/60 p-6 rounded-3xl border border-blue-500/30 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-blue-200 text-base">Incident Logged</h2>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">SEL Advice Generated</span>
            </div>
            
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 text-sm text-slate-200 leading-relaxed">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-2">Suggested SEL Approach</span>
              {justLoggedIncident.suggestedAction}
            </div>

            <button 
              onClick={() => {
                setUnresolvedIncident(justLoggedIncident);
                setJustLoggedIncident(null);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-400 text-xs font-bold py-3 rounded-2xl transition-all hover:border-blue-500/40 flex items-center justify-center gap-2"
            >
              Move to Pending Resolution List
            </button>
          </section>
        )}

        {/* Log New Incident Form */}
        {!unresolvedIncident && !justLoggedIncident && (
          <section className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base">Log New Incident</h2>
                <p className="text-xs text-slate-400">Report an event to receive instant SEL-aligned advice</p>
              </div>
            </div>

            <form onSubmit={handleLogIncident} className="flex flex-col gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  What happened at the hostel?
                </label>
                <textarea
                  className="w-full p-4 rounded-2xl border border-slate-800 bg-slate-950/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[140px] transition-all"
                  placeholder="Describe the incident (e.g., student conflict, illness, behavioral issue)..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-950/50 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                Log & Get Restorative Guidance
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
