'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useRef, useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

function extractText(parts: { type: string; text?: string }[]) {
  return parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text ?? '')
    .join('\n');
}

export default function MitraChatPage() {
  const [input, setInput] = useState('');
  const userIdRef = useRef<string | undefined>(undefined);
  const conversationIdRef = useRef<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);

  // One-time sync from external browser state (localStorage, the URL's
  // query string) into React state after mount, same pattern used across
  // the other Spaces.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    userIdRef.current = window.localStorage.getItem('mitra:userId') ?? undefined;

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('query');
      if (query) {
        setInput(query);
      }
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // The transport's `body` callback is invoked per-request when a message is
  // actually sent, not during render — refs there always read the latest
  // value, unlike a closure captured once by this useState initializer.
  /* eslint-disable react-hooks/refs */
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
  /* eslint-enable react-hooks/refs */

  const { messages, sendMessage, status, error, regenerate } = useChat({ transport });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage({ text });
    setInput('');
  };

  const isThinking = status === 'submitted';

  return (
    <main className="flex min-h-[100dvh] w-full flex-col [padding-top:max(1.5rem,env(safe-area-inset-top))]">
      <header className="px-6 pb-3">
        <h1 className="text-lg font-semibold text-moon">MITRA</h1>
        <p className="text-xs text-earth">Your thinking partner — ask anything, naturally.</p>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 pb-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-3 pt-16 text-center text-moon/60">
            <MessageCircle className="h-8 w-8 text-morning-sun-strong" />
            <p className="max-w-[240px] text-sm">
              Whenever you feel unsure, just ask. I&apos;m here to listen first.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-button px-4 py-3 text-sm leading-relaxed ${
                message.role === 'user'
                  ? 'bg-morning-sun/20 text-moon'
                  : 'bg-cloud-strong text-moon'
              }`}
            >
              {extractText(message.parts)}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="rounded-button bg-cloud-strong px-4 py-3 text-sm text-moon/50">
              MITRA is thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-start gap-2 rounded-button bg-emergency/10 px-4 py-3 text-sm text-emergency">
            <span>Something went wrong on my end — let&apos;s try that again.</span>
            <button type="button" onClick={() => regenerate()} className="font-semibold underline">
              Retry
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-20 flex items-center gap-2 border-t border-moon/10 bg-cloud px-6 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Tell MITRA what's happening..."
          className="min-h-[48px] flex-1 rounded-button border border-moon/10 bg-cloud-strong px-4 text-base text-moon placeholder:text-moon/40 focus:border-morning-sun focus:outline-none"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || status === 'streaming' || status === 'submitted'}
          aria-label="Send"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-button bg-morning-sun text-white transition-colors hover:bg-morning-sun-strong disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </main>
  );
}
