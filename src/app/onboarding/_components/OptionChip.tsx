'use client';

import type { ReactNode } from 'react';

export function OptionChip({
  label,
  selected,
  onClick,
  disabled,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`flex min-h-[48px] w-full items-center gap-2 rounded-button border px-4 py-3 text-left text-sm font-medium transition-colors ${
        selected
          ? 'border-morning-sun bg-morning-sun/15 text-moon'
          : 'border-moon/10 bg-cloud-strong text-moon/80 hover:border-moon/20'
      } ${disabled && !selected ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
