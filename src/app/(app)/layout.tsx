import type { ReactNode } from 'react';
import { BottomNav } from './_components/BottomNav';

export default function AppShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pb-20">
      {children}
      <BottomNav />
    </div>
  );
}
