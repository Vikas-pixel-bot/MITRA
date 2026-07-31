import type { ReactNode } from 'react';
import { BottomNav } from './_components/BottomNav';
import { FloatingMitraChat } from './_components/FloatingMitraChat';
import { EmergencyActionOverlay } from './_components/EmergencyActionOverlay';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] w-full bg-cloud flex justify-center">
      <div className="relative w-full max-w-md min-h-[100dvh] pb-24 flex flex-col">
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
