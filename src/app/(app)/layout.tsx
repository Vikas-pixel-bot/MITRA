import type { ReactNode } from 'react';
import { BottomNav } from './_components/BottomNav';
import { FloatingMitraChat } from './_components/FloatingMitraChat';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pb-20">
      {children}
      <FloatingMitraChat />
      <BottomNav />
    </div>
  );
}
