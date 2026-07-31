'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  AlertTriangle,
  Heart,
  Plus,
  X,
  MessageCircle,
  UserCheck,
  Activity,
} from 'lucide-react';
import {
  getStudents,
  seedStudentsIfEmpty,
  addStudentNote,
  updateStudentHealth,
} from '@/actions/students';

type StudentItem = {
  id: string;
  name: string;
  rollNo: string | null;
  gender: string | null;
  grade: string | null;
  healthStatus: string;
  riskFlag: boolean;
  notes: string | null;
  casesCount: number;
  recentCases: {
    id: string;
    title: string;
    severity: string;
    status: string;
    createdAt: string;
  }[];
};

const HEALTH_FILTERS = [
  { id: 'ALL', label: 'All Students' },
  { id: 'RISK', label: 'Attention Needed', icon: AlertTriangle },
  { id: 'FEVER', label: 'Sick Room / Fever', icon: Activity },
  { id: 'HOMESICK', label: 'Homesick', icon: Heart },
  { id: 'HEALTHY', label: 'Healthy', icon: UserCheck },
];

export default function StudentsPage() {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStudent, setActiveStudent] = useState<StudentItem | null>(null);

  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    await seedStudentsIfEmpty();
    const isRisk = selectedFilter === 'RISK';
    const statusFilter = isRisk ? 'ALL' : selectedFilter;
    const res = await getStudents({
      query: searchQuery,
      healthStatus: statusFilter,
      riskFlagOnly: isRisk,
    });
    if (res.success && res.students) {
      setStudents(res.students);
    }
    setLoading(false);
  };

  // One-time + on-filter-change sync from the server into local state,
  // same pattern used across the other Spaces.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchStudents();
  }, [selectedFilter, searchQuery]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  const handleAddNote = async () => {
    if (!activeStudent || !newNote.trim()) return;
    setAddingNote(true);
    const res = await addStudentNote(activeStudent.id, newNote.trim());
    if (res.success) {
      setNewNote('');
      await fetchStudents();
      setActiveStudent((prev) =>
        prev
          ? {
              ...prev,
              notes: prev.notes ? `${prev.notes}\n• ${newNote.trim()}` : `• ${newNote.trim()}`,
            }
          : null
      );
    }
    setAddingNote(false);
  };

  const handleToggleHealth = async (newStatus: string, isRisk: boolean) => {
    if (!activeStudent) return;
    const res = await updateStudentHealth(activeStudent.id, newStatus, isRisk);
    if (res.success) {
      await fetchStudents();
      setActiveStudent((prev) =>
        prev
          ? {
              ...prev,
              healthStatus: newStatus,
              riskFlag: isRisk,
            }
          : null
      );
    }
  };

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-5 px-6 pb-24 [padding-top:max(1.5rem,env(safe-area-inset-top))]">
      {/* Header Banner with Student Care Illustration */}
      <div className="relative overflow-hidden rounded-card border border-morning-sun/20 bg-gradient-to-r from-morning-sun/15 to-cloud-strong p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-[210px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-morning-sun/20 px-2 py-0.5 text-[10px] font-bold text-morning-sun-strong">
              <Users className="h-3 w-3" /> Restorative Student Care
            </span>
            <h1 className="text-xl font-bold tracking-tight text-moon">Student Care & Wellbeing</h1>
            <p className="text-xs text-earth">
              Track student health, restorative care needs, and support history in real time.
            </p>
          </div>
          <div className="h-20 w-24 shrink-0 overflow-hidden rounded-card border border-moon/10 shadow-xs">
            <img src="/students-banner.png" alt="Student Care Illustration" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      {/* Search input */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-moon/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student by name, roll no, or grade..."
          className="w-full rounded-button border border-moon/10 bg-cloud-strong py-3 pl-10 pr-4 text-sm text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-moon/50 hover:text-moon"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="w-full overflow-x-auto pb-2 pt-1 scrollbar-none">
        <div className="flex gap-2 min-w-max px-0.5">
          {HEALTH_FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-button px-3.5 py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-morning-sun text-white shadow-xs'
                    : 'border border-moon/10 bg-cloud-strong text-moon/80 hover:bg-moon/5'
                }`}
              >
                {filter.icon && <filter.icon className="h-3.5 w-3.5" />}
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Student cards list */}
      {loading ? (
        <div className="py-12 text-center text-sm text-moon/50">Loading student directory...</div>
      ) : students.length === 0 ? (
        <div className="rounded-card border border-moon/10 bg-cloud-strong p-6 text-center text-sm text-earth">
          No students found matching your criteria.
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((student) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setActiveStudent(student)}
              className={`cursor-pointer rounded-card border p-4 transition-all hover:border-morning-sun/40 ${
                student.riskFlag
                  ? 'border-clay/30 bg-clay/5'
                  : 'border-moon/10 bg-cloud-strong'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-moon">{student.name}</h2>
                    {student.riskFlag && (
                      <span className="flex items-center gap-1 rounded-full bg-clay/15 px-2 py-0.5 text-[10px] font-semibold text-clay">
                        <AlertTriangle className="h-3 w-3" /> Flagged
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-earth">
                    {student.grade || 'Ashramshala'} • Roll: {student.rollNo || 'N/A'} • {student.gender}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    student.healthStatus === 'FEVER'
                      ? 'bg-clay/15 text-clay'
                      : student.healthStatus === 'HOMESICK'
                        ? 'bg-morning-sun/15 text-morning-sun-strong'
                        : 'bg-moon/10 text-earth'
                  }`}
                >
                  {student.healthStatus}
                </span>
              </div>

              {student.notes && (
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-moon/70">
                  {student.notes}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-moon/5 pt-2 text-[11px] text-earth">
                <span>{student.casesCount} cases recorded</span>
                <span className="font-medium text-morning-sun-strong">View Profile &rarr;</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Student Drawer Modal */}
      <AnimatePresence>
        {activeStudent && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-moon/40 backdrop-blur-xs p-0 sm:items-center sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-cloud p-6 shadow-xl sm:rounded-card"
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-moon/10 pb-3">
                <div>
                  <h2 className="text-lg font-semibold text-moon">{activeStudent.name}</h2>
                  <p className="text-xs text-earth">
                    {activeStudent.grade} • Roll: {activeStudent.rollNo}
                  </p>
                </div>
                <button
                  onClick={() => setActiveStudent(null)}
                  className="rounded-full p-1 text-moon/50 hover:bg-moon/10 hover:text-moon"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-moon">
                {/* Quick Health Status Controls */}
                <div className="rounded-card bg-cloud-strong p-3 space-y-2">
                  <p className="font-semibold text-moon text-xs">Current Health & Care Status</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleToggleHealth('HEALTHY', false)}
                      className={`rounded-button px-3 py-1.5 text-xs font-medium ${
                        activeStudent.healthStatus === 'HEALTHY'
                          ? 'bg-morning-sun text-white'
                          : 'border border-moon/10 bg-cloud text-moon'
                      }`}
                    >
                      Healthy
                    </button>
                    <button
                      onClick={() => handleToggleHealth('FEVER', true)}
                      className={`rounded-button px-3 py-1.5 text-xs font-medium ${
                        activeStudent.healthStatus === 'FEVER'
                          ? 'bg-clay text-white'
                          : 'border border-moon/10 bg-cloud text-moon'
                      }`}
                    >
                      Sick / Fever
                    </button>
                    <button
                      onClick={() => handleToggleHealth('HOMESICK', false)}
                      className={`rounded-button px-3 py-1.5 text-xs font-medium ${
                        activeStudent.healthStatus === 'HOMESICK'
                          ? 'bg-morning-sun-strong text-white'
                          : 'border border-moon/10 bg-cloud text-moon'
                      }`}
                    >
                      Homesick Support
                    </button>
                  </div>
                </div>

                {/* Notes History */}
                <div className="rounded-card bg-cloud-strong p-3 space-y-2">
                  <p className="font-semibold text-moon text-xs">Warden & Support Notes</p>
                  <div className="whitespace-pre-line text-moon/80 leading-relaxed bg-cloud p-3 rounded-button border border-moon/5">
                    {activeStudent.notes || 'No specific warden notes recorded yet.'}
                  </div>

                  {/* Add Note Form */}
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add observation or care note..."
                      className="flex-1 rounded-button border border-moon/10 bg-cloud px-3 py-2 text-xs text-moon focus:border-morning-sun focus:outline-none"
                    />
                    <button
                      disabled={addingNote || !newNote.trim()}
                      onClick={handleAddNote}
                      className="flex items-center gap-1 rounded-button bg-morning-sun px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Recent Cases */}
                <div className="rounded-card bg-cloud-strong p-3 space-y-2">
                  <p className="font-semibold text-moon text-xs">Associated Cases</p>
                  {activeStudent.recentCases.length === 0 ? (
                    <p className="text-earth">No formal cases filed for this student.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {activeStudent.recentCases.map((c) => (
                        <div key={c.id} className="rounded border border-moon/5 bg-cloud p-2">
                          <p className="font-medium text-moon">{c.title}</p>
                          <p className="text-[10px] text-earth">
                            Severity: {c.severity} • Status: {c.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="flex items-center gap-2 border-t border-moon/10 pt-3">
                <Link
                  href={`/mitra?query=${encodeURIComponent(`Log an incident or talk about student: ${activeStudent.name}`)}`}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-button bg-morning-sun text-xs font-semibold text-white shadow-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                  Discuss with MITRA
                </Link>
                <button
                  onClick={() => setActiveStudent(null)}
                  className="flex min-h-[44px] items-center justify-center rounded-button border border-moon/10 px-4 text-xs font-semibold text-moon hover:bg-cloud-strong"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
