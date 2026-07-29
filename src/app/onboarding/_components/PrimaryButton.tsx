'use client';

import type { ButtonHTMLAttributes } from 'react';

export function PrimaryButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex min-h-[48px] w-full items-center justify-center rounded-button bg-morning-sun px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-morning-sun-strong disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-morning-sun ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
