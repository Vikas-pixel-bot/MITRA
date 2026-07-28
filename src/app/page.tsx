'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Brain, Users, BookOpen, UserCheck, ShieldCheck, Clock, Lightbulb, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const fadeInUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center fixed top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 group relative cursor-help">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">M</div>
          <span className="font-bold text-xl tracking-tight">MITRA</span>
          
          {/* Tooltip on Hover */}
          <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-slate-800 text-white text-sm rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <strong>M</strong>entoring <strong>I</strong>ntelligence for <strong>T</strong>ribal <strong>R</strong>esidential <strong>A</strong>shramshalas
            <div className="absolute -top-2 left-4 w-4 h-4 bg-slate-800 rotate-45"></div>
          </div>
        </div>
        <Link 
          href="/platform" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-transform active:scale-95 shadow-sm"
        >
          Open App
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 flex flex-col items-center text-center relative">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl -z-10"></div>
        
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Meet <span className="text-blue-600 dark:text-blue-400 group relative cursor-help border-b-2 border-dashed border-blue-400 inline-block">
              MITRA
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[300px] p-3 bg-slate-800 text-white text-sm rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                Mentoring Intelligence for Tribal Residential Ashramshalas
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rotate-45"></div>
              </div>
            </span>
          </h1>
          <p className="text-lg md:text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
            Mentoring Intelligence for Tribal Residential Ashramshalas
          </p>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed mx-auto">
            The AI Companion empowering wardens with instant guidance, daily rhythm structures, and emotional support to create joyful residential environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/platform" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:-translate-y-1"
            >
              Enter Warden Platform <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Who Uses MITRA Section */}
      <section className="py-20 px-6 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Who is MITRA for?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Designed specifically for the dedicated staff of Government Ashram Schools, ensuring they are never alone in their duties.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <UserCheck className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Hostel Wardens</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Primary caregivers managing daily routines, student emotional wellbeing, and conflict resolution in residential setups.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <ShieldCheck className="w-10 h-10 text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Headmasters</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                School leaders overseeing the alignment of hostel management with the broader educational and Happiness Curriculum goals.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
              <BookOpen className="w-10 h-10 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Teachers & Staff</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Educators collaborating with wardens to maintain consistent Social Emotional Learning environments outside classroom hours.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* What can MITRA do (Features) Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-950">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Platform Features</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              A comprehensive toolkit that moves beyond tracking, moving towards proactive coaching and mentoring.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 flex gap-4">
              <div className="mt-1"><Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" /></div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">Proactive AI Companion</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Mitra reaches out to you based on the time of day, reminding you of routine checks and providing a private space to discuss hostel challenges securely.</p>
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 flex gap-4">
              <div className="mt-1"><AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" /></div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">Intelligent Incident Tracker</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Log student conflicts or issues. Mitra immediately generates restorative, SEL-aligned advice and ensures you follow up on unresolved incidents.</p>
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 flex gap-4">
              <div className="mt-1"><Heart className="w-8 h-8 text-green-600 dark:text-green-400" /></div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">Daily Habit Builder</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Track your own daily wellbeing routines. You can't pour from an empty cup; Mitra ensures wardens prioritize their own basic self-care.</p>
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 flex gap-4">
              <div className="mt-1"><Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" /></div>
              <div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-slate-100">Happiness Curriculum Integration</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">All AI responses and suggested measures are strictly aligned with the principles of the Happiness Curriculum and trauma-informed care.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Why SEL Matters */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Social Emotional Learning (SEL)?</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Hostel wardens are more than administrators; they are emotional anchors. Understanding SEL transforms conflict into connection.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Self-Awareness</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Helping wardens and students recognize their emotions, understand their triggers, and build a foundation for emotional regulation.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Relationship Skills</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Fostering empathy, active listening, and conflict resolution without relying solely on punitive discipline.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-950 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Responsible Decisions</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Coaching students through difficult moments to make choices that benefit their future and the community.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Happiness Curriculum Corner */}
      <section className="py-20 px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-blue-600 -skew-y-3 transform origin-top-left -z-10"></div>
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto text-white text-center"
        >
          <div className="inline-block p-4 bg-white/20 rounded-2xl backdrop-blur-md mb-6 border border-white/30">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">The Happiness Curriculum Corner</h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed mb-10">
            Mitra isn't just a generic chatbot. It is built as an interactive layer on top of the established MSMS ecosystem, training materials, and the Happiness Curriculum. It provides guidance consistent with your exact program goals.
          </p>
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 text-left grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Core Principles:</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-sm font-bold">1</div>
                  <span>Mindful Awareness (ध्यान)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-sm font-bold">2</div>
                  <span>Critical Thinking & Storytelling</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center text-sm font-bold">3</div>
                  <span>Activity-Based Reflection</span>
                </li>
              </ul>
            </div>
            <div className="bg-blue-800/50 p-6 rounded-2xl border border-blue-500/30">
              <p className="italic text-blue-50">
                "Over time, Mitra evolves into an AI-powered operating system for hostel management, combining operational guidance, Social Emotional Learning, and wellbeing coaching."
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto">
        <p className="font-semibold text-slate-800 dark:text-slate-200">MITRA</p>
        <p className="text-sm mt-2">Mentoring Intelligence for Tribal Residential Ashramshalas</p>
      </footer>
    </div>
  );
}
