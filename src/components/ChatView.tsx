'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Settings, Mic, Send, MoreVertical, Menu, Camera, Paperclip, Loader2 } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { getChatHistory, saveChatMessage } from '@/actions/db';

export default function ChatView() {
  const [localInput, setLocalInput] = useState('');
  const [initialMessages, setInitialMessages] = useState<any[]>([]);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  
  useEffect(() => {
    async function fetchHistory() {
      const res = await getChatHistory();
      if (res.success && res.messages.length > 0) {
        // Map DB messages to ai-sdk format
        const formatted = res.messages.map((m: any) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
          parts: [{ type: 'text' as const, text: m.content }]
        }));
        setInitialMessages(formatted);
      }
      setIsHistoryLoaded(true);
    }
    fetchHistory();
  }, []);

  const { messages, sendMessage, status } = useChat({
    id: 'mitra-chat',
    messages: initialMessages,
  });
  const isLoading = status === 'submitted' || status === 'streaming';
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Proactive Prompting Logic
  useEffect(() => {
    // Only run this AFTER history is loaded, and if there are NO messages
    if (isHistoryLoaded && messages.length === 0) {
      const currentHour = new Date().getHours();
      let promptText = "Hello! How are things at the hostel today?";
      
      if (currentHour >= 5 && currentHour < 10) {
        promptText = "Good morning! 🌅 Did all students wake up on time today? How are you feeling this morning?";
      } else if (currentHour >= 18 && currentHour < 22) {
        promptText = "Good evening! 🌙 How was dinner? Did you have any health concerns or incidents today?";
      } else if (currentHour >= 22 || currentHour < 5) {
        promptText = "It's late. Before you rest, let's spend two minutes reflecting on today. How are you feeling?";
      }

      // Automatically append the AI's first question without waiting for the user
      sendMessage({
        role: 'assistant',
        content: promptText,
      });

      // Also save it to the DB so it persists
      saveChatMessage('assistant', promptText);
    }
  }, [isHistoryLoaded, messages.length, sendMessage]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (localInput.trim() === '') return;
    
    sendMessage({
      role: 'user',
      content: localInput,
    });
    setLocalInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest('form');
      if (form && localInput.trim() !== '') {
        form.requestSubmit();
      }
    }
  };

  if (!isHistoryLoaded) {
    return (
      <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center overflow-hidden border border-blue-200 dark:border-blue-800">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">M</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-slate-900 dark:text-white leading-none">MITRA</h1>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">AI Companion</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5 no-scrollbar scroll-smooth">
        <div className="flex justify-center">
          <span className="px-3 py-1 bg-slate-200/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-full">
            Today
          </span>
        </div>

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role !== 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-200 dark:border-blue-800 mt-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">M</span>
              </div>
            )}
            
            <div className={`flex flex-col gap-1 max-w-[85%] ${m.role === 'user' ? 'items-end' : ''}`}>
              <div className={`p-4 rounded-2xl shadow-sm ${
                m.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-sm' 
                  : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-bl-sm'
              }`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-200 dark:border-blue-800 mt-auto">
              <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">M</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-sm shadow-sm border border-slate-100 dark:border-slate-700/50 flex gap-1 items-center">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-3 pb-safe">
        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <button type="button" className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center px-4 py-1 border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
            <textarea
              className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-32 min-h-[44px] py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-[15px]"
              placeholder="Type or speak a message..."
              rows={1}
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            {localInput.length === 0 ? (
              <button type="button" className="p-2 ml-1 text-slate-400 hover:text-blue-500 transition-colors shrink-0">
                <Camera className="w-5 h-5" />
              </button>
            ) : null}
          </div>

          {localInput.length > 0 ? (
            <button 
              type="submit"
              disabled={isLoading}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full transition-all shrink-0 shadow-md transform active:scale-95 flex items-center justify-center w-12 h-12"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          ) : (
            <button 
              type="button" 
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shrink-0 shadow-md transform active:scale-95 flex items-center justify-center w-12 h-12"
            >
              <Mic className="w-5 h-5" />
            </button>
          )}
        </form>
      </footer>
    </div>
  );
}
