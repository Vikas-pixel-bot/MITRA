'use client';

import React from 'react';

export function MitraDoodleAvatar({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative shrink-0 overflow-hidden rounded-full bg-gradient-to-tr from-morning-sun/30 via-cloud-strong to-forest/20 p-1 border border-morning-sun/40 shadow-xs flex items-center justify-center ${className}`}
    >
      <img
        src="/mitra-doodle.png"
        alt="MITRA Hugging Companion Doodle"
        className="h-full w-full object-cover rounded-full"
      />
    </div>
  );
}
