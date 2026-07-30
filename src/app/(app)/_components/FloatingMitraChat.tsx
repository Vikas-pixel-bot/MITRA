'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Sun, BookOpen, Users, UserRound, ShieldAlert, Mic, MicOff, Volume2 } from 'lucide-react';
import { MitraDoodleAvatar } from '@/components/illustrations/MitraDoodleAvatar';
import { useCircadianTheme } from '@/hooks/useCircadianTheme';

function extractText(parts: { type: string; text?: string }[]) {
  return parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text ?? '')
    .join('\n');
}

const QUICK_GUIDE_CHIPS = [
  { label: '📅 Today & Tasks', route: '/today', query: 'Show me my routine and tasks for today' },
  { label: '📚 Knowledge & SOPs', route: '/knowledge', query: 'Guide me on hostel SOP guidelines' },
  { label: '🧑‍🤝‍🧑 Student Wellbeing', route: '/students', query: 'Help me check student profiles and health status' },
  { label: '🧘 Habits & Mood', route: '/me', query: 'Let us track my habits and reflection log' },
  { label: '🚨 Report Emergency', route: '/knowledge', query: 'I need to report an emergency incident' },
];

export function FloatingMitraChat() {
  const router = useRouter();
  const circadianPhase = useCircadianTheme(); // Volume IV dynamic Circadian day phase
  const [isOpen, setIsOpen] = useState(false);
  const [showAutoPopup, setShowAutoPopup] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const userIdRef = useRef<string | undefined>(undefined);
  const conversationIdRef = useRef<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    userIdRef.current = window.localStorage.getItem('mitra:userId') ?? undefined;

    // Trigger proactive welcome pop-up on initial visit session
    const hasSeenWelcome = window.sessionStorage.getItem('mitra:welcomeShown');
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => {
        setShowAutoPopup(true);
        window.sessionStorage.setItem('mitra:welcomeShown', 'true');
      }, 1200);
      return () => clearTimeout(timer);
    }

    // Listen for custom trigger event to open floating chat with query
    const handleOpenMitra = (e: CustomEvent<{ query?: string }>) => {
      setIsOpen(true);
      setShowAutoPopup(false);
      if (e.detail?.query) {
        setInput(e.detail.query);
      }
    };

    window.addEventListener('open-mitra-chat' as any, handleOpenMitra as any);
    return () => window.removeEventListener('open-mitra-chat' as any, handleOpenMitra as any);
  }, []);

  // Web Speech Recognition Setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'mr-IN'; // Default to Marathi / Indian English

      rec.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join('');
        setInput(transcript);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const speakText = (id: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    setSpeakingMessageId(id);
    window.speechSynthesis.speak(utterance);
  };

  const [transport] = useState(
    () =>
      new DefaultChatTransport({
        api: '/api/mitra/chat',
        body: () => {
          if (!conversationIdRef.current) {
            conversationIdRef.current = crypto.randomUUID();
          }
          return { userId: userIdRef.current, conversationId: conversationIdRef.current };
        },
      })
  );

  const { messages, sendMessage, status, error, regenerate } = useChat({ transport });

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, status, isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput('');
  };

  const handleChipClick = (chip: typeof QUICK_GUIDE_CHIPS[0]) => {
    setShowAutoPopup(false);
    setIsOpen(true);
    sendMessage({ text: chip.query });
    router.push(chip.route);
  };

  const isThinking = status === 'submitted';

  return (
    <>
      {/* Proactive Auto Greeting Popup Bubble */}
      <AnimatePresence>
        {showAutoPopup && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-4 z-50 max-w-[280px] rounded-card border border-morning-sun/30 bg-cloud/95 p-4 shadow-2xl backdrop-blur-md space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MitraDoodleAvatar size={36} />
                <div>
                  <h4 className="text-xs font-bold text-moon">MITRA Companion</h4>
                  <p className="text-[10px] text-earth">Namaskar Superintendent Sir! 🙏</p>
                </div>
              </div>
              <button
                onClick={() => setShowAutoPopup(false)}
                className="rounded-full p-1 text-earth hover:bg-moon/10 hover:text-moon"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-moon leading-relaxed font-medium">
              &quot;How are you feeling right now? Where would you like to go today?&quot;
            </p>

            <div className="flex flex-col gap-1.5 pt-1">
              {QUICK_GUIDE_CHIPS.slice(0, 3).map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleChipClick(chip)}
                  className="rounded-button border border-moon/10 bg-cloud-strong py-1.5 px-2.5 text-left text-[11px] font-semibold text-moon hover:border-morning-sun/40 hover:bg-morning-sun/10"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-moon/10 text-[10px]">
              <button
                onClick={() => {
                  setShowAutoPopup(false);
                  setIsOpen(true);
                }}
                className="font-bold text-morning-sun-strong hover:underline"
              >
                Open Full Chat &rarr;
              </button>
              <button
                onClick={() => setShowAutoPopup(false)}
                className="text-earth hover:text-moon"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button with Doodle Avatar */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setShowAutoPopup(false);
            setIsOpen(true);
          }}
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-morning-sun to-morning-sun-strong text-white shadow-xl border-2 border-white"
          aria-label="Open MITRA Floating Assistant"
        >
          <MitraDoodleAvatar size={50} className="border-none shadow-none" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-forest text-[9px] font-bold text-white">
            AI
          </span>
        </motion.button>
      )}

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-3 bottom-20 z-50 mx-auto flex h-[75vh] max-h-[580px] max-w-lg flex-col overflow-hidden rounded-card border border-morning-sun/30 bg-cloud shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-moon/10 bg-gradient-to-r from-morning-sun/15 to-cloud-strong px-4 py-3">
              <div className="flex items-center gap-2.5">
                <MitraDoodleAvatar size={36} />
                <div>
                  <h3 className="text-sm font-bold text-moon flex items-center gap-1">
                    MITRA Companion <Sparkles className="h-3.5 w-3.5 text-morning-sun-strong" />
                  </h3>
                  <p className="text-[10px] text-earth">
                    Circadian: <span className="font-bold">{circadianPhase} Mode</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 text-moon/60 hover:bg-moon/10 hover:text-moon"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Navigation Chips Row inside Chat Header */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-moon/10 bg-cloud-strong px-3 py-2 scrollbar-none">
              {QUICK_GUIDE_CHIPS.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleChipClick(chip)}
                  className="shrink-0 rounded-full border border-moon/10 bg-cloud px-2.5 py-1 text-[10px] font-semibold text-moon hover:border-morning-sun/40 hover:bg-morning-sun/15"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Messages Feed */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center text-earth">
                  <MitraDoodleAvatar size={60} />
                  <div>
                    <p className="font-bold text-moon text-sm">Namaskar Superintendent Sir! 🙏</p>
                    <p className="max-w-[240px] text-[11px] mt-1 text-earth">
                      I am here to guide your daily hostel rhythm, answer SOP queries, or assist during student incidents.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message) => {
                const textContent = extractText(message.parts);
                const isSpeakingThis = speakingMessageId === message.id;

                return (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[88%]">
                      {message.role !== 'user' && <MitraDoodleAvatar size={28} className="mb-0.5" />}
                      <div
                        className={`group relative whitespace-pre-wrap rounded-button px-3.5 py-2.5 leading-relaxed ${
                          message.role === 'user'
                            ? 'bg-morning-sun/20 text-moon font-medium'
                            : 'bg-cloud-strong text-moon border border-moon/5'
                        }`}
                      >
                        {textContent}

                        {/* Spoken Voice Synthesizer Button */}
                        {message.role !== 'user' && textContent && (
                          <button
                            onClick={() => speakText(message.id, textContent)}
                            className={`mt-1.5 flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold transition-all ${
                              isSpeakingThis
                                ? 'bg-morning-sun text-white animate-pulse'
                                : 'bg-moon/10 text-earth hover:text-moon'
                            }`}
                          >
                            <Volume2 className="h-3 w-3" />
                            {isSpeakingThis ? 'Speaking...' : 'Listen'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isThinking && (
                <div className="flex items-center gap-2 justify-start">
                  <MitraDoodleAvatar size={28} />
                  <div className="rounded-button bg-cloud-strong px-3.5 py-2 text-moon/50 italic">
                    Looking up relevant SOP guidance...
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-button bg-emergency/10 p-3 text-emergency space-y-1">
                  <p>Connection glitch — let&apos;s retry that query.</p>
                  <button onClick={() => regenerate()} className="font-bold underline">
                    Retry
                  </button>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input Bar with Voice Input Toggle */}
            <div className="flex items-center gap-2 border-t border-moon/10 bg-cloud-strong p-3">
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-button border transition-all ${
                  isListening
                    ? 'border-emergency bg-emergency text-white animate-pulse'
                    : 'border-moon/10 bg-cloud text-moon hover:bg-moon/5'
                }`}
                title="Toggle Voice Speech Input"
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-morning-sun-strong" />}
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={isListening ? 'Listening in Marathi / English...' : 'Ask MITRA or speak...'}
                className="min-h-[42px] flex-1 rounded-button border border-moon/10 bg-cloud px-3.5 text-xs text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim() || status === 'streaming' || status === 'submitted'}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-button bg-morning-sun text-white shadow-xs hover:bg-morning-sun-strong disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
