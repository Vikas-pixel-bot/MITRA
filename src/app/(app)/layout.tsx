import type { ReactNode } from 'react';
import { BottomNav } from './_components/BottomNav';
import { FloatingMitraChat } from './_components/FloatingMitraChat';
import { EmergencyActionOverlay } from './_components/EmergencyActionOverlay';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-slate-900/10 sm:bg-slate-900/80 sm:py-6 flex justify-center items-center">
      <div className="relative w-full max-w-md bg-cloud min-h-[100dvh] sm:min-h-[844px] sm:max-h-[900px] sm:rounded-[36px] sm:border-[8px] sm:border-slate-800 sm:shadow-2xl overflow-y-auto pb-20 flex flex-col">
        <EmergencyActionOverlay />
        <div className="flex-1 w-full">
          {children}
        </div>
        <FloatingMitraChat />
        <BottomNav />
      </div>
    </div>
  );
}
