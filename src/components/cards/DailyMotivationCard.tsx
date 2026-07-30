'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Sun, Award, Coffee, ShieldCheck } from 'lucide-react';
import { MitraDoodleAvatar } from '@/components/illustrations/MitraDoodleAvatar';

const DAILY_MOTIVATION_QUOTES = [
  {
    quote: "Your quiet dedication every single day creates a safe, loving home for children who look up to you.",
    author: "Dedicated Caregiver Appreciation",
    theme: "from-amber-500/15 via-cloud-strong to-orange-400/10 border-amber-500/30",
  },
  {
    quote: "Superintendent Sir, taking care of yourself is not selfish — it is how you keep giving your best to the children.",
    author: "Caregiver Wellbeing Principle",
    theme: "from-forest/15 via-cloud-strong to-emerald-500/10 border-forest/30",
  },
  {
    quote: "In every small routine check, kitchen inspection, and gentle conversation, you build a brighter future for Ashramshala students.",
    author: "Ashramshala Leadership",
    theme: "from-river/15 via-cloud-strong to-sky-500/10 border-river/30",
  },
  {
    quote: "Thank you for being the calm anchor during crisis and the caring mentor during quiet moments. You truly matter.",
    author: "MITRA Companion Honor",
    theme: "from-purple-600/15 via-cloud-strong to-pink-500/10 border-purple-600/30",
  },
  {
    quote: "Leadership in residential schools is about heart. Your patience transforms challenges into growth for every child.",
    author: "Restorative Leadership",
    theme: "from-morning-sun/20 via-cloud-strong to-amber-500/10 border-morning-sun/30",
  },
];

export function DailyMotivationCard({ addressee }: { addressee?: string }) {
  const quoteData = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_MOTIVATION_QUOTES[dayOfYear % DAILY_MOTIVATION_QUOTES.length];
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-card border bg-gradient-to-br p-4.5 shadow-xs ${quoteData.theme} space-y-2.5`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MitraDoodleAvatar size={32} />
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-cloud px-2.5 py-0.5 text-[10px] font-bold text-moon border border-moon/10 shadow-xs">
              <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> Daily Caregiver Appreciation
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-earth">Thank You, {addressee || 'Superintendent Sir'} 🙏</span>
      </div>

      <p className="text-xs font-medium text-moon leading-relaxed italic pl-1 border-l-2 border-morning-sun-strong">
        &quot;{quoteData.quote}&quot;
      </p>

      <div className="flex items-center justify-between text-[10px] text-earth pt-1 border-t border-moon/5">
        <span className="font-semibold">{quoteData.author}</span>
        <span className="flex items-center gap-1 font-bold text-forest">
          <ShieldCheck className="h-3 w-3" /> Always By Your Side
        </span>
      </div>
    </motion.section>
  );
}
