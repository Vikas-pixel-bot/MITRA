'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Phone, AlertTriangle, Activity, X, ExternalLink, HeartHandshake } from 'lucide-react';

const EMERGENCY_SITES = [
  { title: 'Snake Bite Protocol', action: 'Inject Anti-Snake Venom (ASV) & immediate ambulance dispatch', call: '108 Ambulance' },
  { title: 'High Fever / Sick Room', action: 'Move to isolated sick room, monitor temperature, notify doctor', call: 'PHC Doctor' },
  { title: 'POCSO / Child Abuse', action: 'Immediate mandatory reporting to Childline & Project Officer', call: '1098 Childline' },
];

export function EmergencyActionOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Banner Quick Access Emergency Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-3 right-4 z-40 flex items-center gap-1.5 rounded-full border border-emergency/30 bg-emergency/15 px-3 py-1 text-xs font-bold text-emergency shadow-xs hover:bg-emergency hover:text-white transition-all"
      >
        <ShieldAlert className="h-4 w-4 animate-pulse" />
        <span>Emergency SOS</span>
      </button>

      {/* Emergency Protocol Drawer Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-moon/60 backdrop-blur-sm p-0 sm:items-center sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-cloud p-6 shadow-2xl border-2 border-emergency sm:rounded-card space-y-4"
            >
              <div className="flex items-center justify-between border-b border-emergency/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emergency text-white">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-moon">Emergency Response Mode</h2>
                    <p className="text-[11px] text-emergency font-semibold">Immediate Step-by-Step SOP Direct Action</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="rounded-full p-1 text-earth hover:text-moon">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto py-2 text-xs">
                {EMERGENCY_SITES.map((site) => (
                  <div key={site.title} className="rounded-card border border-emergency/30 bg-emergency/10 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-emergency">{site.title}</h3>
                      <span className="flex items-center gap-1 rounded-full bg-emergency text-white px-2.5 py-0.5 text-[10px] font-bold">
                        <Phone className="h-3 w-3" /> {site.call}
                      </span>
                    </div>
                    <p className="text-xs text-moon leading-relaxed font-medium">{site.action}</p>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        window.dispatchEvent(
                          new CustomEvent('open-mitra-chat', {
                            detail: { query: `URGENT EMERGENCY: Guide me on ${site.title} SOP protocol immediately!` },
                          })
                        );
                      }}
                      className="w-full rounded-button bg-emergency py-2 text-xs font-bold text-white shadow-xs hover:bg-emergency/90"
                    >
                      Activate Emergency Guidance in MITRA &rarr;
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-moon/10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-button border border-moon/10 bg-cloud-strong py-2.5 text-xs font-semibold text-moon hover:bg-cloud"
                >
                  Return to Normal Operations
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
