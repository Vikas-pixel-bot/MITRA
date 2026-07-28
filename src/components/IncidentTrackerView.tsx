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
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 font-sans overflow-y-auto no-scrollbar pb-24">
      <header className="px-5 py-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Incident Tracker</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Log issues and receive SEL-based guidance.</p>
      </header>

      <main className="px-5 py-6 flex flex-col gap-6">
        
        {/* Unresolved Incident Follow-up */}
        {unresolvedIncident && (
          <section className="bg-red-50 dark:bg-red-900/20 p-5 rounded-3xl border border-red-200 dark:border-red-800 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h2 className="font-bold text-red-900 dark:text-red-100">Unresolved Incident</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl mb-4 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold block mb-1">Description:</span>
              {unresolvedIncident.description}
            </div>
            {unresolvedIncident.suggestedAction && (
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl mb-4 text-sm text-slate-700 dark:text-slate-300 border-l-4 border-blue-500">
                <span className="font-semibold block mb-1">Mitra's Advice:</span>
                {unresolvedIncident.suggestedAction}
              </div>
            )}
            
            <form onSubmit={handleResolve} className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-red-900 dark:text-red-100">Was this resolved? Add notes:</label>
              <textarea
                className="w-full p-3 rounded-xl border border-red-200 dark:border-red-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[80px]"
                placeholder="How was the situation handled?"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={isResolving}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isResolving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Mark as Resolved
              </button>
            </form>
          </section>
        )}

        {/* Recently Logged Incident Feedback */}
        {justLoggedIncident && !unresolvedIncident && (
          <section className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-200 dark:border-blue-800 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <h2 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Incident Logged</h2>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">Here is a suggested approach based on SEL principles:</p>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {justLoggedIncident.suggestedAction}
            </div>
            <button 
              onClick={() => {
                setUnresolvedIncident(justLoggedIncident);
                setJustLoggedIncident(null);
              }}
              className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline"
            >
              Continue to resolution
            </button>
          </section>
        )}

        {/* Log New Incident Form */}
        {!unresolvedIncident && !justLoggedIncident && (
          <section className="bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300" />
              <h2 className="font-bold text-slate-800 dark:text-slate-200">Log New Incident</h2>
            </div>
            <form onSubmit={handleLogIncident} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  What happened?
                </label>
                <textarea
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Describe the incident briefly..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
                Log & Get Advice
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}
