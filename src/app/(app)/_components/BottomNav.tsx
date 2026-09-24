'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sun, BookOpen, Users, UserRound } from 'lucide-react';

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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-moon/15 bg-cloud/98 backdrop-blur-md shadow-lg [padding-bottom:env(safe-area-inset-bottom)]"
      aria-label="Spaces"
    >
      <div className="mx-auto flex w-full max-w-md items-stretch justify-between px-3 py-1.5">
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-button px-2 py-1 text-[11px] font-bold transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 rounded-button bg-morning-sun/15 border border-morning-sun/30"
                  transition={{ type: 'spring', damping: 22, stiffness: 350 }}
                />
              )}
              <Icon
                className={`h-5 w-5 z-10 transition-transform ${
                  isActive ? 'scale-110 text-morning-sun-strong' : 'text-moon/50'
                }`}
              />
              <span
                className={`z-10 text-[10px] tracking-tight ${
                  isActive ? 'text-moon font-extrabold' : 'text-moon/60 font-medium'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
