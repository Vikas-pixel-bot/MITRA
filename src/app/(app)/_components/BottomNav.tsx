'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, MessageCircle, BookOpen, Users, UserRound } from 'lucide-react';

const TABS = [
  { href: '/today', label: 'Today', icon: Sun },
  { href: '/knowledge', label: 'Knowledge', icon: BookOpen },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/me', label: 'Me', icon: UserRound },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-moon/10 bg-cloud/95 backdrop-blur-sm [padding-bottom:env(safe-area-inset-bottom)]"
      aria-label="Spaces"
    >
      <div className="mx-auto flex w-full max-w-sm items-stretch justify-between px-2 py-1.5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex min-h-[48px] flex-1 flex-col items-center justify-center gap-1 rounded-button px-2 py-1.5 text-[11px] font-medium transition-colors"
            >
              <Icon
                className={`h-5 w-5 ${isActive ? 'text-morning-sun-strong' : 'text-moon/50'}`}
              />
              <span className={isActive ? 'text-moon' : 'text-moon/50'}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
