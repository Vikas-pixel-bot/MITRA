'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  ShieldAlert,
  FileText,
  HeartHandshake,
  X,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { getKnowledgeItems, seedKnowledgeBase } from '@/actions/knowledge';

type KnowledgeItem = {
  id: string;
  title: string;
  category: string;
  officialSource: string | null;
  summary: string;
  content: string;
  tags: string[];
  updatedAt: string;
};

const CATEGORIES = [
  { id: 'ALL', label: 'All Guidance' },
  { id: 'SOP', label: 'Hostel SOPs', icon: FileText },
  { id: 'CIRCULAR', label: 'Circulars', icon: BookOpen },
  { id: 'LEGAL_POCSO', label: 'Legal & Safety', icon: ShieldAlert },
  { id: 'PLAYBOOK', label: 'Restorative Playbooks', icon: HeartHandshake },
];

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<KnowledgeItem | null>(null);

  const fetchItems = async (cat: string, q: string) => {
    setLoading(true);
    // Ensure initial seed runs if empty
    await seedKnowledgeBase();
    const res = await getKnowledgeItems({ category: cat, query: q });
    if (res.success && res.items) {
      setItems(res.items);
    }
    setLoading(false);
  };

  // One-time + on-filter-change sync from the server into local state,
  // same pattern used across the other Spaces.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchItems(selectedCategory, searchQuery);
  }, [selectedCategory, searchQuery]);
  /* eslint-enable react-hooks/set-state-in-effect */

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-5 px-6 pb-24 [padding-top:max(1.5rem,env(safe-area-inset-top))]">
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-morning-sun/15 text-morning-sun-strong">
            <BookOpen className="h-4 w-4" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-moon">Knowledge & Guidance</h1>
        </div>
        <p className="text-xs text-earth">
          Official MSMS SOPs, circulars, and restorative playbooks — always cited to official sources.
        </p>
      </header>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-moon/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search SOPs, POCSO, health protocols, circulars..."
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

      {/* Category Pills */}
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-button px-3.5 py-2 text-xs font-medium transition-colors ${
                isSelected
                  ? 'bg-morning-sun text-white shadow-sm'
                  : 'border border-moon/10 bg-cloud-strong text-moon/80 hover:bg-moon/5'
              }`}
            >
              {cat.icon && <cat.icon className="h-3.5 w-3.5" />}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Knowledge Cards List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-moon/50">Loading guidance library...</div>
      ) : items.length === 0 ? (
        <div className="rounded-card border border-moon/10 bg-cloud-strong p-6 text-center text-sm text-earth">
          No guidance found matching your search query. Try searching for &ldquo;SOP&rdquo;, &ldquo;POCSO&rdquo;, or &ldquo;Food&rdquo;.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setActiveModalItem(item)}
              className="cursor-pointer rounded-card border border-moon/10 bg-cloud-strong p-4 shadow-xs transition-all hover:border-morning-sun/40"
            >
              <div className="mb-2 flex items-center justify-between">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    item.category === 'LEGAL_POCSO'
                      ? 'bg-clay/15 text-clay'
                      : item.category === 'PLAYBOOK'
                        ? 'bg-morning-sun/15 text-morning-sun-strong'
                        : 'bg-moon/10 text-earth'
                  }`}
                >
                  {item.category.replace('_', ' ')}
                </span>
                {item.officialSource && (
                  <span className="truncate max-w-[180px] text-[10px] text-earth">
                    {item.officialSource}
                  </span>
                )}
              </div>
              <h2 className="text-base font-semibold text-moon">{item.title}</h2>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-moon/70">
                {item.summary}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-cloud px-1.5 py-0.5 text-[10px] text-earth"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-morning-sun-strong">
                  View Playbook &rarr;
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reader Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-moon/40 backdrop-blur-xs p-0 sm:items-center sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-cloud p-6 shadow-xl sm:rounded-card"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-moon/10 pb-3">
                <div className="space-y-1">
                  <span className="rounded-full bg-morning-sun/15 px-2.5 py-0.5 text-[10px] font-semibold text-morning-sun-strong">
                    {activeModalItem.category.replace('_', ' ')}
                  </span>
                  <h2 className="text-lg font-semibold text-moon">{activeModalItem.title}</h2>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="rounded-full p-1 text-moon/50 hover:bg-moon/10 hover:text-moon"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-moon leading-relaxed">
                {activeModalItem.officialSource && (
                  <div className="flex items-center gap-1.5 rounded-button bg-morning-sun/10 px-3 py-2 text-earth font-medium">
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-morning-sun-strong" />
                    <span>Official Source: {activeModalItem.officialSource}</span>
                  </div>
                )}

                <div className="rounded-card bg-cloud-strong p-3">
                  <p className="font-semibold text-moon">Summary</p>
                  <p className="mt-1 text-moon/80">{activeModalItem.summary}</p>
                </div>

                <div className="space-y-2 prose prose-sm max-w-none text-moon/90">
                  <p className="font-semibold text-moon text-sm">Actionable Playbook & Protocol</p>
                  <div className="whitespace-pre-line rounded-card border border-moon/10 bg-cloud-strong p-4">
                    {activeModalItem.content}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center gap-2 border-t border-moon/10 pt-3">
                <Link
                  href={`/mitra?query=${encodeURIComponent(`Guide me on: ${activeModalItem.title}`)}`}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-button bg-morning-sun text-xs font-semibold text-white shadow-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                  Discuss with MITRA AI
                </Link>
                <button
                  onClick={() => setActiveModalItem(null)}
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
