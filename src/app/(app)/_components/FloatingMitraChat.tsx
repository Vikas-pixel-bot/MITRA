'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Minimize2, Maximize2 } from 'lucide-react';

function extractText(parts: { type: string; text?: string }[]) {
  return parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text ?? '')
    .join('\n');
}

export function FloatingMitraChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const userIdRef = useRef<string | undefined>(undefined);
  const conversationIdRef = useRef<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    userIdRef.current = window.localStorage.getItem('mitra:userId') ?? undefined;

    // Listen for custom trigger event to open floating chat with query
    const handleOpenMitra = (e: CustomEvent<{ query?: string }>) => {
      setIsOpen(true);
      if (e.detail?.query) {
        setInput(e.detail.query);
      }
    };

    window.addEventListener('open-mitra-chat' as any, handleOpenMitra as any);
    return () => window.removeEventListener('open-mitra-chat' as any, handleOpenMitra as any);
  }, []);

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

  const isThinking = status === 'submitted';

  return (
    <>
      {/* Floating Chat Launcher Button (Bottom-Right) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-morning-sun to-morning-sun-strong text-white shadow-lg border border-white/20"
          aria-label="Open MITRA Floating Assistant"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-forest text-[9px] font-bold text-white">
            AI
          </span>
        </motion.button>
      )}

      {/* Floating Chat Modal Drawer */}
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
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-morning-sun text-white font-bold text-xs shadow-xs">
                  🙏
                </div>
                <div>
                  <h3 className="text-sm font-bold text-moon flex items-center gap-1">
                    MITRA Companion <Sparkles className="h-3.5 w-3.5 text-morning-sun-strong" />
                  </h3>
                  <p className="text-[10px] text-earth">Incident Reporting & SOP AI Guidance</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-moon/60 hover:bg-moon/10 hover:text-moon"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-earth">
                  <MessageCircle className="h-8 w-8 text-morning-sun-strong" />
                  <p className="font-semibold text-moon">Namaskar! How can I assist you right now?</p>
                  <p className="max-w-[220px] text-[11px]">
                    Ask about Hostel SOPs, report a student incident, or seek emergency guidance.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-button px-3.5 py-2.5 leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-morning-sun/20 text-moon font-medium'
                        : 'bg-cloud-strong text-moon border border-moon/5'
                    }`}
                  >
                    {extractText(message.parts)}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex justify-start">
                  <div className="rounded-button bg-cloud-strong px-3.5 py-2 text-moon/50 italic">
                    MITRA is thinking...
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

            {/* Input Bar */}
            <div className="flex items-center gap-2 border-t border-moon/10 bg-cloud-strong p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask MITRA or report incident..."
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
