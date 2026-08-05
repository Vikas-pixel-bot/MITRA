---
name: ui-ux-pro-max
description: Complete UI/UX design system reference for the MITRA AI codebase — semantic color tokens, typography, spacing/radius grid, component conventions, brand voice, accessibility rules, and mobile-first layout patterns. Use this whenever building or reviewing any screen, component, or piece of copy in this project, so new work matches the established system instead of drifting from it. Triggers on "design", "UI", "UX", "screen", "page", "component", "color", "token", "spacing", "typography", "accessibility", "layout", "copy", "empty state".
metadata:
  project: MITRA AI
  design-system: Volume IV Living Design System
---

# MITRA AI — UI/UX Design System

MITRA is a mobile-first PWA for hostel Superintendents in Government Tribal Residential Ashramshalas. Every design decision should read as **"a calm senior colleague, not your boss, not an app trying to entertain you."** Two people/agents build this app in parallel and have drifted from each other before (see git history) — this skill exists to be the one shared source of truth so new screens actually match what's already shipped.

For animation/transition specifics, see the `motion-framer` skill — don't duplicate that here.

## Brand voice (read this before writing any copy)

| Attribute | Meaning | Example |
|---|---|---|
| Warm | Welcoming, never informal-to-the-point-of-casual | "Good morning, Sunita Madam." |
| Dependable | Consistent, always available | Instant offline access, cached SOPs |
| Respectful | Dignified language, never condescending | "You handled a difficult situation with care. That matters." |
| Calm in crisis | Slows things down, never panics | Immediate safety → medical care → SOP circulars, one step at a time |
| Encouraging | Sincere, never gamified | "You completed 5 consecutive morning briefings." — not badges/points/confetti |

Never write copy that judges, shames, or implies the user forgot/failed something. Never use exclamation-heavy hype copy. Never invent a specific circular number, legal citation, or SOP detail that isn't actually in the Knowledge base — say "I'm not fully certain, please confirm with your Principal" instead.

## Color tokens

Semantic names only — never raw Tailwind palette classes (`bg-blue-500` etc.) in app UI. Defined in `src/app/globals.css`:

| Token | Light value | Use for |
|---|---|---|
| `morning-sky` | `#eaf2f4` | Rare — pale accent backgrounds |
| `morning-sun` / `morning-sun-strong` | `#e8983a` / `#cf7d21` | Primary accent — CTAs, active states, highlights |
| `forest` | `#2f6b4f` | Growth/wellbeing/success-adjacent accents (habits, streaks) |
| `river` | `#3e7c8c` | Info/secondary accent, links |
| `earth` | `#7a5b43` | Secondary text (subtitles, labels, metadata) |
| `clay` | `#c15b3c` | Warm secondary accent (incident/report actions) |
| `moon` | `#241f18` | Primary text; also the dark-mode surface base |
| `cloud` / `cloud-strong` | warm off-white, **semi-transparent** (55%/68% alpha) | Card/surface background — see Glassmorphic surfaces below |
| `emergency` | reserved red | **Only** for genuine emergency UI (SOS overlay). Never for routine errors or validation. |
| `success` | green | Confirmation states |

### Glassmorphic surfaces

The UI is glassmorphic: `--color-cloud` and `--color-cloud-strong` are semi-transparent (not opaque), `body` renders a soft ambient gradient wash (radial gradients built from `color-mix()` of `morning-sun`/`river`/`forest`, so it still shifts with the circadian state), and a global unlayered CSS rule in `globals.css` applies `backdrop-filter: blur(20px) saturate(160%)` to every `bg-cloud`/`bg-cloud-strong` surface (and their `/90`, `/95`, `/40` opacity variants) — **this is applied once, globally, for every component that already uses these semantic tokens.**

Practical implications when building new UI:
- **Never hardcode `background-color` or use raw Tailwind palette classes for a card/section surface** — always use `bg-cloud` or `bg-cloud-strong`. That's what makes the glass effect (and dark-mode/circadian theming) apply automatically with zero extra work.
- **Don't add your own `backdrop-filter`** to a new component that already uses `bg-cloud`/`bg-cloud-strong` — it's redundant, the global rule already covers it. Only hand-roll blur for a genuinely new surface color that isn't one of these tokens.
- **Borders and shadows are deliberately left to each component** (the global glass rule only sets `backdrop-filter`, nothing else) — keep using per-card borders like `border border-moon/10` or context-specific ones (`border-clay/30` for incident-tinted cards, `border-forest/20` for growth cards) exactly as before; they still render correctly on top of the glass background.
- If you introduce a brand-new opacity variant of `bg-cloud`/`bg-cloud-strong` (e.g. `bg-cloud/80`) that isn't already in the global blur selector list in `globals.css`, add it to that list too, or it'll render as a flat translucent color with no blur.

Every token has a light and dark value plus **circadian overrides** (`[data-circadian="MORNING|SCHOOL|EVENING|NIGHT"]` in `globals.css`) that shift `cloud`/`morning-sun` through the day — don't hardcode hex values in components, always reference the CSS custom properties via Tailwind's `bg-cloud-strong`, `text-earth`, etc. so circadian/dark-mode theming keeps working.

Use `text-emergency`/`bg-emergency` sparingly and deliberately — it's the one color in the system allowed to break the calm palette, and it loses its signal value if used for anything routine.

## Typography

Font stack (set in `layout.tsx` / `globals.css`): **Inter** (Latin UI text) → **Noto Sans Devanagari** (Marathi/Hindi, automatic glyph fallback) → **Noto Sans** (general fallback). Never introduce a new font. Never use a decorative/display font — this is a utility app for tired people at 6:30 AM, not a marketing site.

Standard text scale in components (Tailwind classes actually in use):
- Page/section title: `text-xl font-bold` or `text-lg font-semibold`
- Card title: `text-base font-semibold` / `text-sm font-bold`
- Body: `text-sm` / `text-xs`
- Micro-labels (uppercase section headers): `text-[10px]`/`text-[11px] font-semibold uppercase tracking-wider text-earth`

## Spacing & radius grid

8-point spacing grid (8/16/24/32/40/48) — Tailwind's default scale already aligns to this, just don't reach for arbitrary odd values (`p-[13px]`) without a real reason.

Corner radii (defined as CSS vars, used via `rounded-button` / `rounded-card`):
- Buttons & inputs: `16px` (`rounded-button`)
- Cards: `20px` (`rounded-card`)
- Drawers/bottom sheets: `28px` (top corners only, `rounded-t-card` variants used with the sheet pattern — see `motion-framer` skill)

## Layout conventions

- **Mobile-first, constrained width**: the whole app shell is capped at `max-w-md`, centered (`src/app/(app)/layout.tsx`) — build for a phone screen first, not a desktop breakpoint first.
- **Safe-area insets**: always account for notches/home-indicators on real pages — `[padding-top:max(1.5rem,env(safe-area-inset-top))]` at the top of scrollable pages, `pb-24`/`pb-28` at the bottom to clear the fixed `BottomNav` + `FloatingMitraChat`.
- **Bottom nav is 4 items**: Today · Knowledge · Students · Me (`BottomNav.tsx`). MITRA conversation is reached via the persistent `FloatingMitraChat` drawer, not a 5th nav tab — don't reintroduce a dedicated MITRA nav item without an explicit product decision, that was a deliberate change from the original docs.
- **Card-based sections**, not dense tables — every Space (Today/Knowledge/Students/Me) is built from stacked `rounded-card bg-cloud-strong p-4/p-5` sections, each with a small uppercase micro-label header. Match this rather than inventing a new section chrome.

## Icons

`lucide-react` is the only icon library in this project — don't add Heroicons/Tabler/react-icons/etc. Icons are typically `h-4 w-4` inline with text, `h-5 w-5` as standalone action icons, sized up to `h-6 w-6`/`h-7 w-7` only for hero/empty-state moments.

## Illustration

**No stock photos, ever.** All visuals are warm, simple hand-built vector illustrations (see `src/components/illustrations/WelcomeIllustration.tsx`, `MitraDoodleAvatar.tsx`) — flat shapes, warm earthy palette matching the color tokens above, no photorealism, nothing that looks like a corporate stock-photo caregiving scene. If a screen needs an illustration and none exists yet, build a new simple SVG/vector component in `src/components/illustrations/` rather than sourcing an image.

## Empty & loading states

- Empty states show calm, specific copy — never a bare "No data" — and where relevant a peaceful visual, not a broken-looking blank box. E.g. "Nothing logged yet today," "No reflections logged yet. Share your first thought above!"
- Loading states use short human phrases ("Preparing today's briefing...", "MITRA is thinking...") rather than a bare spinner — this is an explicit Constitution rule ("Human AI Loading"). A subtle pulse/fade indicator can accompany the text, but text is the primary signal.
- Error states must be honest and calm, never technical: "I couldn't prepare today's briefing because the connection is unstable. You can still continue your work, and I'll update the briefing when we're back online." Never silently substitute fabricated placeholder data for a real failure — surface it (see the `today.ts`/`me.ts` fix history if you need the concrete example of what not to do).

## Accessibility

- Minimum touch target: **48dp** (`min-h-[48px]` on primary buttons/inputs is the established baseline; 44px is the accepted minimum for secondary/inline actions, not the default).
- Respect `prefers-reduced-motion` (handled globally, see `motion-framer` skill).
- Every icon-only button needs an `aria-label` (see `BottomNav`, dismiss/close buttons across modals).
- Language: the app is Marathi/Hindi/English — don't assume Latin-only text will fit; test that long Devanagari strings don't overflow fixed-width chips/buttons.

## Component conventions to reuse, not reinvent

- **Selectable pill/chip** (single or multi-select): bordered rounded-button, `border-morning-sun bg-morning-sun/15 text-moon` when selected, `border-moon/10 bg-cloud-strong text-moon/70` when not — see `src/app/onboarding/_components/OptionChip.tsx` and the filter pills in `knowledge/page.tsx`/`students/page.tsx`.
- **Primary CTA button**: `bg-morning-sun` fill, white text, `rounded-button`, `min-h-[48px]`, `hover:bg-morning-sun-strong`, `disabled:opacity-40` — see `src/app/onboarding/_components/PrimaryButton.tsx`.
- **Bottom-sheet modal**: see `motion-framer` skill's Pattern 2 — reuse verbatim, don't build a new modal shell.
- **Section header**: icon + `text-xs font-semibold uppercase tracking-wide text-earth` label, used identically at the top of every card section across Today/Knowledge/Students/Me.

When in doubt, open the nearest existing Space page (`today/page.tsx`, `me/page.tsx`, `knowledge/page.tsx`, `students/page.tsx`) and match its patterns before inventing new ones.
