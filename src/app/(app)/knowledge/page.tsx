'use client';

import { useEffect, useState } from 'react';
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
  Activity,
  Heart,
  Sparkles,
  Compass,
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

// The 5 Core Pillars of MITRA Operational Framework with Custom Illustrations
const FIVE_PILLARS = [
  {
    id: 'ALL',
    name: 'All 5 Pillars Framework',
    badge: '10 Modules',
    color: 'from-morning-sun/20 via-cloud-strong to-morning-sun/10 border-morning-sun/30 text-morning-sun-strong',
    image: '/knowledge-banner.png',
    lucideIcon: Compass,
  },
  {
    id: 'PILLAR_1',
    name: 'Pillar 1: Daily Conversations & CASEL SEL Support',
    desc: 'Modules 1 & 3: Non-judgmental dialogue, CASEL emotional coaching, and restorative care.',
    badge: 'Modules 1 & 3',
    color: 'from-amber-500/20 via-cloud-strong to-orange-400/10 border-amber-500/30 text-amber-800',
    image: '/pillar-1.png',
    lucideIcon: HeartHandshake,
    modules: ['MODULE_1', 'MODULE_3'],
  },
  {
    id: 'PILLAR_2',
    name: 'Pillar 2: Hostel Operations & Restorative Student Care',
    desc: 'Modules 2 & 4: Daily kitchen inspection, food quality, homesickness, and student wellbeing.',
    badge: 'Modules 2 & 4',
    color: 'from-forest/20 via-cloud-strong to-emerald-500/10 border-forest/30 text-forest',
    image: '/pillar-2.png',
    lucideIcon: Heart,
    modules: ['MODULE_2', 'MODULE_4'],
  },
  {
    id: 'PILLAR_3',
    name: 'Pillar 3: Critical SOPs & Government Guidelines',
    desc: 'Modules 5 & 6: Snake bite, POCSO, emergency escalation, and official legal circular library.',
    badge: 'Modules 5 & 6',
    color: 'from-clay/20 via-cloud-strong to-rose-500/10 border-clay/30 text-clay',
    image: '/students-banner.png',
    lucideIcon: ShieldAlert,
    modules: ['MODULE_5', 'MODULE_6'],
  },
  {
    id: 'PILLAR_4',
    name: 'Pillar 4: Digital Register & Administrative Logs',
    desc: 'Module 7: Automated conversion of informal chat notes into official digital registries.',
    badge: 'Module 7',
    color: 'from-river/20 via-cloud-strong to-sky-500/10 border-river/30 text-river',
    image: '/knowledge-banner.png',
    lucideIcon: FileText,
    modules: ['MODULE_7'],
  },
  {
    id: 'PILLAR_5',
    name: 'Pillar 5: Superintendent Mindfulness & Self-Care',
    desc: 'Modules 8, 9 & 10: Reflection journal, daily habit builder, and caregiver burnout mitigation.',
    badge: 'Modules 8, 9 & 10',
    color: 'from-purple-600/20 via-cloud-strong to-pink-500/10 border-purple-600/30 text-purple-800',
    image: '/pillar-5.png',
    lucideIcon: Sparkles,
    modules: ['MODULE_8', 'MODULE_9', 'MODULE_10'],
  },
];

export default function KnowledgePage() {
  const [selectedPillar, setSelectedPillar] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeModalItem, setActiveModalItem] = useState<KnowledgeItem | null>(null);

  const fetchItems = async (pillarId: string, q: string) => {
    setLoading(true);
    await seedKnowledgeBase();
    const res = await getKnowledgeItems({ query: q });
    if (res.success && res.items) {
      let filtered = res.items;
      if (pillarId !== 'ALL') {
        const pillar = FIVE_PILLARS.find((p) => p.id === pillarId);
        if (pillar?.modules) {
          filtered = res.items.filter((item) => pillar.modules?.includes(item.category));
        }
      }
      setItems(filtered);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems(selectedPillar, searchQuery);
  }, [selectedPillar, searchQuery]);

  const openFloatingChat = (query?: string) => {
    window.dispatchEvent(new CustomEvent('open-mitra-chat', { detail: { query } }));
  };

  return (
    <main className="flex min-h-[100dvh] w-full flex-col gap-5 px-6 pb-28 [padding-top:max(1.5rem,env(safe-area-inset-top))]">
      {/* Visual Header Banner */}
      <div className="relative overflow-hidden rounded-card border border-morning-sun/20 bg-gradient-to-r from-morning-sun/15 to-cloud-strong p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-[210px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-morning-sun/20 px-2.5 py-0.5 text-[10px] font-bold text-morning-sun-strong">
              <BookOpen className="h-3 w-3" /> Ashramshala SOPs
            </span>
            <h1 className="text-xl font-bold text-moon tracking-tight">5 Core Pillars Knowledge Base</h1>
            <p className="text-xs text-earth">Official SOP playbooks & Maharashtra Governance circulars.</p>
          </div>
          <div className="h-20 w-24 shrink-0 overflow-hidden rounded-card border border-moon/10 shadow-xs">
            <img src="/knowledge-banner.png" alt="Knowledge Banner" className="h-full w-full object-cover" />
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-moon/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search SOPs, POCSO, Snake Bite, CASEL, Food Sample..."
          className="w-full rounded-button border border-moon/10 bg-cloud-strong py-3 pl-10 pr-4 text-xs text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-earth hover:text-moon"
          >
            Clear
          </button>
        )}
      </div>

      {/* 5 Pillar Cards Grid with Large Illustrations */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-earth">Operational Governance Pillars</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FIVE_PILLARS.slice(1).map((p) => {
            const isSelected = selectedPillar === p.id;
            const Icon = p.lucideIcon;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(isSelected ? 'ALL' : p.id)}
                className={`flex flex-col justify-between overflow-hidden rounded-card border text-left transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${p.color} border-morning-sun-strong/80 ring-2 ring-morning-sun shadow-md`
                    : 'bg-cloud-strong border-moon/10 hover:border-morning-sun/30 shadow-xs'
                }`}
              >
                <div className="relative h-28 w-full overflow-hidden border-b border-moon/10">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  <span className="absolute top-2 right-2 rounded-full bg-cloud/90 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-bold text-moon border border-moon/10 shadow-xs">
                    {p.badge}
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="h-4 w-4 shrink-0 text-morning-sun-strong" />
                    <h3 className="text-xs font-bold text-moon line-clamp-1">{p.name.split(':')[1] || p.name}</h3>
                  </div>
                  <p className="text-[11px] text-earth line-clamp-2 leading-relaxed">{p.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {selectedPillar !== 'ALL' && (
          <button
            onClick={() => setSelectedPillar('ALL')}
            className="text-[11px] font-semibold text-morning-sun-strong underline pt-1"
          >
            Clear Pillar Filter (Show All 10 Modules)
          </button>
        )}
      </div>

      {/* Equal Grid View for Module Playbook Cards */}
      {loading ? (
        <div className="py-12 text-center text-xs text-moon/50">Loading operational playbooks...</div>
      ) : items.length === 0 ? (
        <div className="rounded-card border border-moon/10 bg-cloud-strong p-6 text-center text-xs text-earth">
          No modules found matching your query or selected pillar.
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-earth">
            {selectedPillar === 'ALL' ? 'All 10 Module Playbooks' : 'Filtered Playbooks'} ({items.length})
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {items.map((item) => {
              const pillar = FIVE_PILLARS.find((p) => p.modules?.includes(item.category)) || FIVE_PILLARS[1];

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setActiveModalItem(item)}
                  className="flex flex-col justify-between overflow-hidden rounded-card border border-moon/10 bg-cloud-strong shadow-xs transition-all hover:border-morning-sun/50 min-h-[160px]"
                >
                  <div className={`p-3.5 border-b border-moon/10 bg-gradient-to-r ${pillar.color}`}>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-cloud px-2 py-0.5 text-[9px] font-bold text-moon border border-moon/10">
                        {item.category.replace('_', ' ')}
                      </span>
                      <pillar.lucideIcon className="h-4 w-4 text-morning-sun-strong" />
                    </div>
                    <h2 className="mt-1.5 text-xs font-bold text-moon line-clamp-1">{item.title}</h2>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2 text-xs">
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-moon/80">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-moon/5 text-[10px]">
                      <span className="font-semibold text-earth">
                        {item.officialSource ? `Source: ${item.officialSource.slice(0, 20)}...` : 'Official SOP'}
                      </span>
                      <span className="font-bold text-morning-sun-strong">
                        Read SOP &rarr;
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
              <div className="flex items-start justify-between border-b border-moon/10 pb-3">
                <div className="space-y-1">
                  <span className="rounded-full bg-morning-sun/15 px-2.5 py-0.5 text-[10px] font-bold text-morning-sun-strong">
                    {activeModalItem.category.replace('_', ' ')}
                  </span>
                  <h2 className="text-base font-bold text-moon">{activeModalItem.title}</h2>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="rounded-full p-1 text-earth hover:text-moon"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs text-moon leading-relaxed">
                {activeModalItem.officialSource && (
                  <div className="flex items-center gap-1.5 rounded-button bg-morning-sun/10 px-3 py-2 text-earth font-semibold">
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-morning-sun-strong" />
                    <span>Official Source: {activeModalItem.officialSource}</span>
                  </div>
                )}

                <div className="rounded-card bg-cloud-strong p-3">
                  <p className="font-bold text-moon">Module Summary</p>
                  <p className="mt-1 text-moon/80">{activeModalItem.summary}</p>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-moon text-sm">Actionable SOP Guidelines & Playbook</p>
                  <div className="whitespace-pre-line rounded-card border border-moon/10 bg-cloud-strong p-4 font-sans">
                    {activeModalItem.content}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-moon/10 pt-3">
                <button
                  onClick={() => {
                    const query = `Guide me step-by-step using ${activeModalItem.title}`;
                    setActiveModalItem(null);
                    openFloatingChat(query);
                  }}
                  className="flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-button bg-morning-sun text-xs font-semibold text-white shadow-xs"
                >
                  <MessageCircle className="h-4 w-4" />
                  Discuss Module in Floating AI
                </button>
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
