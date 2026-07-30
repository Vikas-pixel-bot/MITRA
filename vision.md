# MITRA: Product Vision & Living Design System

> **MITRA — Mentoring Intelligence for Tribal Residential Ashramshala**
> *"Always by your side."*

MITRA is not a traditional administrative dashboard or a reactive chatbot. It is a **mobile-first Progressive Web App (PWA)** that behaves like a trusted senior colleague — a Digital Co-Superintendent, Mentor, Coach, and Knowledge Companion — providing an ambient, supportive, and proactive daily operating rhythm for the **Superintendents** who run Government Tribal Residential Ashramshalas (hostel schools) across Maharashtra.

This document is the single source of truth for product direction, incorporating the **MITRA Design Bible (Volume IV: Living Design System)**, MITRA AI Constitution, Product Charter, and system blueprints (`Reff/`).

---

## 1. Living Design Philosophy (Volume IV)

> *"MITRA should feel like the most trusted senior colleague you have ever worked with. Not your boss. Not your teacher. Not your assistant. Not your friend. A calm senior — always available, never intimidating."*

### Core Living Principles:
1. **Humans Over Forms**: MITRA transforms administrative documentation into natural conversation.
2. **Calm, Trustworthy & Human**: Interfaces must reduce cognitive load and anxiety. Empty states show peaceful scenes (e.g., clear skies, quiet desks), not stark "No Data" warnings.
3. **No Stock Photos, Ever**: All visuals use warm, hand-drawn vector illustrations (inspired by Warli, Google, and Headspace) grounded in real Ashramshala culture.
4. **Circadian & Seasonal Adaptation**: Interface themes naturally shift with the day (Morning Sunrise → Focused School Hours → Warm Evening → Dimmed Night) and seasons (Summer Gold, Monsoon Green, Winter Mist) to sync with the Superintendent's body clock.
5. **The Invisible Interface**: *"Good design is when users forget the interface exists because it quietly helps them do meaningful work. MITRA succeeds when technology disappears and care remains."*

---

## 2. Living Brand & Tone of Voice

| Attribute | Living Meaning | Example |
| :--- | :--- | :--- |
| **Warm** | Welcoming without being informal | *"Good morning, Sunita Madam."* |
| **Dependable** | Always available, consistent | Instant offline access & cached SOPs |
| **Respectful** | Uses dignified language | *"You handled a difficult situation with care. That matters."* |
| **Calm in Crisis** | Never creates panic; slows situations down | Immediate safety → Medical care → SOP circulars |
| **Encouraging** | Celebrates progress sincerely (never gamified) | *"You completed 5 consecutive morning briefings."* |

---

## 3. Nature-Inspired Palette & Design Tokens (Volume IV)

Instead of generic technical hex codes (`Blue500`, `Yellow700`), MITRA uses nature-inspired design tokens:

- 🌅 **Morning Sky (`#5FA8F5`)**: Clarity & fresh start
- ☀️ **Sunrise Gold (`#F6C453`)**: Energy & optimism
- 🌲 **Forest Green (`#3E8B5B`)**: Growth & student wellbeing
- 🧱 **Clay Earth (`#A66A4C`)**: Stability & rootedness
- 🏖️ **Warm Sand / Cloud (`#F5EFE6`)**: Neutral backdrop
- 🌙 **Deep Night / Moonlight (`#243447`)**: Quiet reflection & night mode
- 🚨 **Emergency Red (`#D64545`)**: Critical alerts only

### Spatial & Micro-Interaction Grid:
- **8-Point Grid System**: All margins, padding, and layout bounds strictly align to multiples of 8px.
- **Corner Radii**: Cards (`20px`), Buttons (`16px`), Inputs (`16px`), Drawers/Sheets (`28px`).
- **Human AI Loading**: When MITRA thinks, it shows human phrases (*"Looking up the latest guidance..."*, *"Finding relevant SOP..."*) instead of blank spinners.

---

## 4. The Signature Ritual: The 20-Second Morning Check-In

Volume IV defines MITRA's signature ritual (the product's emotional anchor):

Every morning at 6:30 AM, before anything else, MITRA greets the Superintendent by name:
> 🌼 *"Good Morning, Sunita Madam. I hope you rested well. Here is what today looks like:"*

The 20-second check-in delivers three focused cards:
1. **One Priority**: *"A student health follow-up is due today."*
2. **One Encouragement**: *"You've completed your morning briefing for 5 consecutive days."*
3. **One Reflection**: *"What would you like to focus on today?"*

---

## 5. Information Architecture: Spaces & The 5 Pillars

MITRA is organized into **Spaces**, mapped to the **Five Operational Pillars**:

1. **Care for Students** (`/students`) — Health status, homesickness, restorative care, incident logs.
2. **Hostel Operations** (`/today` & `/administration`) — Kitchen inspection, food quality, attendance registers.
3. **Knowledge & Guidelines** (`/knowledge`) — 5-Pillar SOP cards, legal circulars, snake bite & POCSO playbooks.
4. **My Wellbeing & Habits** (`/me`) — 30-day reflection history, habit streak builder, mood analytics.
5. **My Growth & 30-Day Goal** (`/me`) — Leadership goals, confidence building.

**Bottom Navigation (4 Primary Spaces):** Today · Knowledge · Students · Me.  
*Floating Companion:* MITRA Hugging Mascot drawer (`FloatingMitraChat.tsx`) remains persistent across all spaces for instant assistance.

---

## 6. Emergency Escalation Matrix

For critical emergencies, MITRA replaces routine navigation entirely with guided escalation:

| Situation | MITRA's Action |
| :--- | :--- |
| **Minor concern** | Guide & suggest routine task |
| **Student Health (Fever/Sick)** | Step-by-step sick room SOP + monitor |
| **Snake Bite / Emergency** | High-contrast emergency protocol + hospital alert |
| **POCSO / Abuse** | Stop routine coaching; guide immediate legal reporting |
| **Superintendent Distress** | Empathetic listening + self-care guidance |

---

## 7. Data & Technical Architecture

- **Frontend Framework**: Next.js 15 App Router + React 19 + Tailwind CSS + Framer Motion.
- **Database Architecture**: Neon Serverless PostgreSQL with Prisma v7 (`@prisma/adapter-pg`).
- **AI Intelligence**: Groq `llama-3.3-70b-versatile` with custom SOP system prompt grounding.
- **Resilience Protocol**: Auto-seeding active Superintendent user identity if local session context is reset.

---

*This document reconciles all 4 Volumes of the MITRA Design Bible, the AI Constitution, and current production code.*
