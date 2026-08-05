---
name: motion-framer
description: Framer Motion conventions for the MITRA AI codebase — when to animate, which patterns to reuse (fade-in-on-mount, AnimatePresence bottom sheets, active-state transitions), and the brand-mandated motion rules (no bounce, no shake, respects prefers-reduced-motion). Use this whenever adding or reviewing any animation, transition, modal, or drawer in this project. Triggers on "animate", "motion.div", "AnimatePresence", "transition", "modal", "bottom sheet", "drawer", "fade in", "slide up".
metadata:
  project: MITRA AI
  library: framer-motion ^12
---

# Framer Motion in MITRA AI

`framer-motion` (`^12.43.0`) is the only animation library in this project. Every screen-entrance, modal, and state transition should reuse one of the patterns below rather than inventing new easing/timing — the two people/agents building this app have drifted on motion styling before; this skill exists to stop that.

## The brand rule, non-negotiable

From the design system (`vision.md` / MITRA AI Constitution): **motion never bounces, never shakes — only fades, slides, and breathes.** MITRA is a calm senior colleague, not a playful app. Concretely:

- No `type: 'spring'` with low damping / high stiffness that overshoots and wobbles.
- No `scale` bounce on tap/hover beyond a very subtle `0.98`–`1.02`.
- No attention-grabbing shake/wiggle for errors or validation — use color + calm copy instead.
- Springs are allowed **only** for the bottom-sheet pattern below, and only with high damping (`25`+) so they settle without overshoot — that reads as "settling into place," not "bouncing."
- Always let `prefers-reduced-motion` win. This is already handled globally in `src/app/globals.css` (an `@media (prefers-reduced-motion: reduce)` block zeroes out animation/transition durations app-wide), so **individual components do not need to check `prefers-reduced-motion` themselves** — just use the patterns below and the global CSS handles the rest.

## Pattern 1 — Section/card fade-in on mount

The default for any content that appears when a page loads or a data fetch resolves. Used throughout `today/page.tsx`, `me/page.tsx`, `onboarding/*`.

```tsx
<motion.section
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
  className="rounded-card bg-cloud-strong p-5"
>
  {/* content */}
</motion.section>
```

- `y: 8` for small inline cards, `y: 12` for hero/section-level blocks. Never more than ~16px — this is a settle-in, not a slide-in.
- `duration: 0.5`–`0.6`, always `ease: 'easeOut'`. No spring here.
- For a sequence of cards appearing together, stagger with `transition={{ delay: 0.15 }}`, `{ delay: 0.3 }`, etc. — see `src/app/page.tsx` (Welcome screen) for the reference stagger.

## Pattern 2 — Bottom sheet / modal (AnimatePresence)

The one place a spring is used, for the Knowledge reader modal, the Today "Log Today" entry sheet, and the Emergency overlay. Reuse this exact shape — don't hand-roll a new modal transition.

```tsx
<AnimatePresence>
  {isOpen && (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-moon/40 backdrop-blur-xs p-0 sm:items-center sm:p-4">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-card bg-cloud p-6 shadow-xl sm:rounded-card"
      >
        {/* sheet content */}
      </motion.div>
    </div>
  )}
</AnimatePresence>
```

- `damping: 25, stiffness: 250` is the tuned value that settles without visible overshoot — don't lower damping to "make it snappier," that reintroduces bounce.
- Mobile-first: full-width bottom sheet (`items-end`, `rounded-t-card`) that becomes a centered dialog on `sm:` breakpoints (`items-center`, `rounded-card`).
- Backdrop is always `bg-moon/40 backdrop-blur-xs` — the semantic "moon" token, not a raw black overlay.

## Pattern 3 — Active/selected state transitions

For tab bars, filter pills, and toggles (see `BottomNav.tsx`, `today/page.tsx`'s mood picker), don't animate at all with Framer Motion — use a plain Tailwind `transition-colors` / `transition-all` on the element. Framer Motion is for entrance/exit choreography, not for routine color/border state changes; reaching for `motion.div` there is overkill and has bitten this project with unnecessary re-render churn before.

```tsx
<button className={`transition-colors ${isActive ? 'bg-morning-sun/15 text-moon' : 'text-moon/60'}`}>
```

## What NOT to do

- Don't add `whileHover`/`whileTap` scale effects to primary buttons — the brand voice is calm, not playful/game-like. If you want tap feedback, a subtle `active:scale-[0.98]` in Tailwind is enough.
- Don't use `type: 'spring'` outside the bottom-sheet pattern.
- Don't build a second modal/sheet transition style — extend Pattern 2, don't invent Pattern 4.
- Don't add loading spinners with continuous rotation as the primary "AI is thinking" indicator — this project uses text ("MITRA is thinking...") per the Constitution's "Human AI Loading" rule, not a spinner. If a visual indicator is added alongside, keep it a gentle pulse/fade, not a spin.
