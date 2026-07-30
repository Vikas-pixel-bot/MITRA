import type { ReactNode } from 'react';
import { BottomNav } from './_components/BottomNav';
import { FloatingMitraChat } from './_components/FloatingMitraChat';
import { EmergencyActionOverlay } from './_components/EmergencyActionOverlay';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pb-20">
      <EmergencyActionOverlay />
      {children}
      <FloatingMitraChat />
      <BottomNav />
    </div>
  );
}
