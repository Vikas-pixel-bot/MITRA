'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  BookOpen,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sun,
  Award,
  Zap,
  Lock,
  PhoneCall,
  Activity,
  Heart,
} from 'lucide-react';
import { WelcomeIllustration } from '@/components/illustrations/WelcomeIllustration';
import { MitraDoodleAvatar } from '@/components/illustrations/MitraDoodleAvatar';

const FEATURES = [
  {
    icon: Compass,
    title: '5 Core Operational Pillars',
    desc: 'Brings together student care, hostel kitchen inspections, official circulars, digital registers, and caregiver self-care into 1 seamless app.',
    color: 'from-amber-500/20 to-orange-400/10 border-amber-500/30 text-amber-800',
  },
  {
    icon: Sparkles,
    title: 'Voice-Enabled AI Companion',
    desc: 'Speak naturally in Marathi or English. MITRA listens, answers SOP queries, and synthesizes spoken audio guidance hands-free.',
    color: 'from-morning-sun/20 to-sky-500/10 border-morning-sun/30 text-morning-sun-strong',
  },
  {
    icon: ShieldCheck,
    title: 'Emergency SOS Protocol',
    desc: '1-tap instant action SOPs for Snake Bites, Sick Room Isolation, and mandatory POCSO legal reporting with direct emergency dispatches.',
    color: 'from-emergency/20 to-rose-500/10 border-emergency/30 text-emergency',
  },
  {
    icon: HeartHandshake,
    title: 'Caregiver Wellbeing & Habits',
    desc: 'Supports the Superintendent with a 20-second morning check-in, daily hydration micro-nudges, and 30-day habit streak trackers.',
    color: 'from-forest/20 to-emerald-500/10 border-forest/30 text-forest',
  },
];

const WHO_USES_IT = [
  {
    role: 'Hostel Superintendents & Wardens',
    purpose: 'To streamline daily routine checks, log student health, sample kitchen food quality, and track daily tasks with zero paperwork burden.',
  },
  {
    role: 'Ashramshala School Leadership',
    purpose: 'To ensure 100% adherence to Maharashtra Tribal Development Department legal circulars, safety guidelines, and student care SOPs.',
  },
  {
    role: 'Tribal Residential Students',
    purpose: 'Beneficiaries of a safer, warmer, and emotionally nurturing hostel environment built on CASEL Social-Emotional Learning principles.',
  },
];

const ADVANTAGES = [
  'Offline-first PWA resilience for remote tribal regions with unstable network connectivity.',
  'Humans Over Forms: Converts complex administrative documentation into natural voice dialogue.',
  'Nature-inspired Circadian UI that shifts themes with morning, school, evening, and night rhythms.',
  '30-Day Wellbeing & Habit streak tracking tailored to prevent caregiver burnout.',
];

export default function WelcomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const userId = window.localStorage.getItem('mitra:userId');
    // We allow visiting landing page, but if user clicks explore or begins onboarding, it guides them.
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center px-6 text-center text-sm text-moon/50">
        Preparing MITRA Platform Overview...
      </main>
    );
  }

  return (
    <main className="flex min-h-[100dvh] w-full flex-col items-center bg-cloud px-4 py-8 [padding-top:max(2rem,env(safe-area-inset-top))] [padding-bottom:max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="w-full max-w-xl space-y-8">
        
        {/* Top Header & Brand Identity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center space-y-3"
        >
          <div className="flex items-center justify-center">
            <MitraDoodleAvatar size={76} />
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-morning-sun/20 px-3 py-1 text-xs font-bold text-morning-sun-strong border border-morning-sun/30">
            <Sparkles className="h-3.5 w-3.5" /> Official Ashramshala Digital Companion
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-moon leading-tight">
            MITRA AI Platform
          </h1>
          <p className="text-xs font-semibold text-earth uppercase tracking-widest">
            Mentoring Intelligence for Tribal Residential Ashramshala
          </p>
          <p className="text-sm text-moon/80 max-w-md leading-relaxed font-medium">
            &quot;Always by your side.&quot; A trusted senior colleague assisting Superintendents with daily hostel rhythm, student care, official SOPs, and caregiver wellbeing.
          </p>
        </motion.div>

        {/* Call to Action Button Row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-2.5 sm:flex-row"
        >
          <Link
            href="/today"
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-button bg-morning-sun px-6 py-3 text-sm font-bold text-white shadow-md transition-colors hover:bg-morning-sun-strong"
          >
            Launch Today&apos;s Space <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/onboarding"
            className="flex min-h-[48px] items-center justify-center rounded-button border border-moon/15 bg-cloud-strong px-5 py-3 text-sm font-bold text-moon hover:bg-cloud"
          >
            Setup / Onboarding
          </Link>
        </motion.div>

        {/* Section 1: What is MITRA & Product Vision */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-card border border-morning-sun/30 bg-gradient-to-br from-morning-sun/15 via-cloud-strong to-cloud p-5 space-y-3 shadow-xs"
        >
          <div className="flex items-center gap-2 text-morning-sun-strong font-bold text-xs uppercase tracking-wider">
            <Compass className="h-4 w-4" /> What is MITRA & Product Vision
          </div>
          <h2 className="text-lg font-bold text-moon">
            Not a boss, not an administrative burden — a calm senior colleague.
          </h2>
          <p className="text-xs text-moon/80 leading-relaxed">
            MITRA replaces rigid government forms and isolated messaging groups with a <strong>proactive, mobile-first PWA</strong>. Built around real Maharashtra Tribal Development Department circulars and CASEL Social-Emotional Learning standards, MITRA guides daily kitchen sampling, dormitory attendance, emergency protocols, and caregiver self-care.
          </p>
        </motion.section>

        {/* Section 2: Core Capabilities & Modules */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center gap-2 text-earth font-bold text-xs uppercase tracking-wider">
            <Zap className="h-4 w-4 text-morning-sun-strong" /> Core Platform Capabilities
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-card border bg-gradient-to-br p-4 space-y-2 shadow-xs ${item.color}`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" />
                    <h3 className="text-xs font-bold text-moon">{item.title}</h3>
                  </div>
                  <p className="text-[11px] text-moon/80 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Section 3: Who Uses MITRA? */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-card border border-moon/10 bg-cloud-strong p-5 space-y-3 shadow-xs"
        >
          <div className="flex items-center gap-2 text-earth font-bold text-xs uppercase tracking-wider">
            <Users className="h-4 w-4 text-forest" /> Who Uses MITRA?
          </div>
          <div className="space-y-2.5">
            {WHO_USES_IT.map((u) => (
              <div key={u.role} className="rounded-button border border-moon/10 bg-cloud p-3 space-y-1">
                <h4 className="text-xs font-bold text-moon flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-forest" /> {u.role}
                </h4>
                <p className="text-[11px] text-earth leading-relaxed">{u.purpose}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 4: Key Pros & Advantages */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-card border border-forest/20 bg-gradient-to-br from-forest/10 via-cloud-strong to-cloud p-5 space-y-3 shadow-xs"
        >
          <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider">
            <Award className="h-4 w-4" /> Why Choose MITRA? Key Pros
          </div>
          <ul className="space-y-2">
            {ADVANTAGES.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-moon/85 leading-relaxed">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-forest text-[9px] font-bold text-white">
                  ✓
                </span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Bottom Launch Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-card border border-morning-sun/30 bg-cloud-strong p-6 text-center space-y-4 shadow-md"
        >
          <div className="flex justify-center">
            <MitraDoodleAvatar size={60} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-moon">Ready to experience MITRA?</h3>
            <p className="text-xs text-earth max-w-xs mx-auto">
              Start your day with the 20-second morning briefing and guided hostel rhythm.
            </p>
          </div>
          <Link
            href="/today"
            className="inline-flex min-h-[48px] w-full max-w-xs items-center justify-center gap-2 rounded-button bg-morning-sun px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-morning-sun-strong"
          >
            Enter MITRA Platform <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

      </div>
    </main>
  );
}
