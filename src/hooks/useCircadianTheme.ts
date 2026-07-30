'use client';

import { useEffect, useState } from 'react';

export type CircadianPhase = 'MORNING' | 'SCHOOL' | 'EVENING' | 'NIGHT';

export function useCircadianTheme() {
  const [phase, setPhase] = useState<CircadianPhase>('MORNING');

  useEffect(() => {
    const updatePhase = () => {
      const hour = new Date().getHours();
      let currentPhase: CircadianPhase = 'MORNING';

      if (hour >= 5 && hour < 11) {
        currentPhase = 'MORNING'; // 5 AM - 11 AM: Sunrise Gold & Sky
      } else if (hour >= 11 && hour < 17) {
        currentPhase = 'SCHOOL'; // 11 AM - 5 PM: Focused Clarity
      } else if (hour >= 17 && hour < 21) {
        currentPhase = 'EVENING'; // 5 PM - 9 PM: Warm Sand & Forest
      } else {
        currentPhase = 'NIGHT'; // 9 PM - 5 AM: Dimmed Moonlight
      }

      setPhase(currentPhase);
      document.documentElement.setAttribute('data-circadian', currentPhase);
    };

    updatePhase();
    const interval = setInterval(updatePhase, 60000);
    return () => clearInterval(interval);
  }, []);

  return phase;
}
