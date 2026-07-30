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
  Users,
  Compass,
  CheckCircle2,
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

// The 5 Core Pillars of MITRA Operational Framework (From System Blueprints)
const FIVE_PILLARS = [
  {
    id: 'ALL',
    name: 'All Pillars',
    desc: 'Complete 10-Module Operational Framework',
    badge: '10 Modules',
    color: 'from-morning-sun/20 to-cloud-strong border-morning-sun/30 text-morning-sun-strong',
    icon: Compass,
  },
  {
    id: 'PILLAR_1',
    name: 'Pillar 1: Daily Conversations & SEL Support',
    desc: 'Modules 1 & 3: Non-judgmental dialogue, CASEL emotional coaching, and restorative care.',
    badge: 'Modules 1 & 3',
    color: 'from-morning-sun/15 to-cloud-strong border-morning-sun/25 text-morning-sun-strong',
    icon: HeartHandshake,
    modules: ['MODULE_1', 'MODULE_3'],
    imgGradient: 'from-amber-500/20 via-orange-400/20 to-yellow-600/10',
    svgIcon: '💬',
  },
  {
    id: 'PILLAR_2',
    name: 'Pillar 2: Hostel Operations & Restorative Student Care',
    desc: 'Modules 2 & 4: Daily kitchen inspection, food quality, homesickness, and student wellbeing.',
    badge: 'Modules 2 & 4',
    color: 'from-forest/15 to-cloud-strong border-forest/25 text-forest',
    icon: Heart,
    modules: ['MODULE_2', 'MODULE_4'],
    imgGradient: 'from-emerald-600/20 via-green-500/20 to-teal-700/10',
    svgIcon: '🏠',
  },
  {
    id: 'PILLAR_3',
    name: 'Pillar 3: Critical SOPs & Government Guidelines',
    desc: 'Modules 5 & 6: Snake bite, POCSO, emergency escalation, and official legal circular library.',
    badge: 'Modules 5 & 6',
    color: 'from-clay/15 to-cloud-strong border-clay/25 text-clay',
    icon: ShieldAlert,
    modules: ['MODULE_5', 'MODULE_6'],
    imgGradient: 'from-red-600/20 via-rose-500/20 to-orange-700/10',
    svgIcon: '🚨',
  },
  {
    id: 'PILLAR_4',
    name: 'Pillar 4: Digital Register & Administrative Logs',
    desc: 'Module 7: Automated conversion of informal chat notes into official digital registries.',
    badge: 'Module 7',
    color: 'from-river/15 to-cloud-strong border-river/25 text-river',
    icon: FileText,
    modules: ['MODULE_7'],
    imgGradient: 'from-cyan-600/20 via-sky-500/20 to-blue-700/10',
    svgIcon: '📋',
  },
  {
    id: 'PILLAR_5',
    name: 'Pillar 5: Warden Mindfulness, Habits & Self-Care',
    desc: 'Modules 8, 9 & 10: Reflection journal, daily habit builder, and caregiver burnout mitigation.',
    badge: 'Modules 8, 9 & 10',
    color: 'from-purple-600/15 to-cloud-strong border-purple-600/25 text-purple-700',
    icon: Sparkles,
    modules: ['MODULE_8', 'MODULE_9', 'MODULE_10'],
    imgGradient: 'from-purple-600/20 via-indigo-500/20 to-pink-600/10',
    svgIcon: '🧘',
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
      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-morning-sun/15 text-morning-sun-strong font-bold">
            📚
          </div>
          <h1 className="text-xl font-bold tracking-tight text-moon">Knowledge Base · 5 Core Pillars</h1>
        </div>
        <p className="text-xs text-earth">
          Organized into the 5 core operational pillars of Maharashtra Tribal Ashramshala Governance.
        </p>
      </header>

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

      {/* 5 Pillar Filter Tiles Carousel */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-earth">Select Operational Pillar</p>
        <div className="-mx-6 flex gap-3 overflow-x-auto px-6 pb-2 scrollbar-none">
          {FIVE_PILLARS.map((p) => {
            const isSelected = selectedPillar === p.id;
            const Icon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`flex shrink-0 min-w-[200px] flex-col justify-between rounded-card p-3.5 border transition-all text-left ${
                  isSelected
                    ? `bg-gradient-to-br ${p.color} shadow-sm border-morning-sun-strong/60 ring-1 ring-morning-sun`
                    : 'bg-cloud-strong border-moon/10 hover:border-moon/20'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{p.svgIcon || '📖'}</span>
                  <span className="rounded-full bg-cloud px-2 py-0.5 text-[10px] font-bold text-earth border border-moon/10">
                    {p.badge}
                  </span>
                </div>
                <div className="mt-3 space-y-0.5">
                  <h3 className="text-xs font-bold text-moon">{p.name}</h3>
                  <p className="text-[10px] text-earth line-clamp-2">{p.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tile-Based Module Cards */}
      {loading ? (
        <div className="py-12 text-center text-xs text-moon/50">Loading operational modules...</div>
      ) : items.length === 0 ? (
        <div className="rounded-card border border-moon/10 bg-cloud-strong p-6 text-center text-xs text-earth">
          No modules found matching your query or selected pillar.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => {
            const pillar = FIVE_PILLARS.find((p) => p.modules?.includes(item.category)) || FIVE_PILLARS[1];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setActiveModalItem(item)}
                className="cursor-pointer overflow-hidden rounded-card border border-moon/10 bg-cloud-strong shadow-xs transition-all hover:border-morning-sun/50"
              >
                {/* Visual Banner Tile Header */}
                <div className={`relative h-24 bg-gradient-to-r ${pillar.imgGradient} p-4 flex flex-col justify-between border-b border-moon/10`}>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cloud/90 px-2.5 py-0.5 text-[10px] font-bold text-moon border border-moon/10">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="text-2xl">{pillar.svgIcon}</span>
                  </div>
                  <h2 className="text-sm font-bold text-moon line-clamp-1">{item.title}</h2>
                </div>

                {/* Card Content Body */}
                <div className="p-4 space-y-2">
                  <p className="line-clamp-2 text-xs leading-relaxed text-moon/80">
                    {item.summary}
                  </p>
                  {item.officialSource && (
                    <p className="text-[10px] text-earth font-medium flex items-center gap-1">
                      <ExternalLink className="h-3 w-3 text-morning-sun-strong" />
                      Ref: {item.officialSource}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-moon/5">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="rounded bg-cloud px-1.5 py-0.5 text-[10px] text-earth">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-morning-sun-strong">
                      Read SOP Playbook &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Interactive Reader Modal */}
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
