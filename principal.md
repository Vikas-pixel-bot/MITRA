# MITRA: Non-Negotiable Product & Design Principles

> *This document defines the non-negotiable laws governing all UI/UX design, AI behavior, and engineering for the MITRA PWA.*

---

## 1. The 10 MITRA Laws

### Law 1: The 15-Second Rule
> A Superintendent or Warden must understand today's priority within 15 seconds of opening the app.
- **Good Example**: Opening directly into a single, high-priority time-aware briefing card.
- **Bad Example**: A cluttered dashboard with 12 competing metric widgets.

### Law 2: Humans Over Forms
> Never force a user to fill out a 12-field form when they can simply talk or type naturally.
- **AI Behavior**: Ask "What happened?", extract (Time, Student, Incident, Action) into structured data, and present a summary back for confirmation.

### Law 3: Explain the "Why"
> Never issue authoritative commands ("Do X"). Always ground recommendations in reasoning.
- **Example**: *"Based on the Maharashtra Hostel SOP (Section 4.2)..."* or *"Because the student has had a fever since yesterday..."*

### Law 4: AI Should Feel Slow When Needed
> Do not rush responses during emotional check-ins.
- Taking a 1.5-second pause ("Mitra is thinking...") during distress or reflection creates an empathetic, human interaction.

### Law 5: Celebrate Quietly
> No fireworks or confetti animations for adult wardens.
- Use warm, human, quiet acknowledgments: *"You've completed your evening reflection 3 days in a row. That's great consistency."*

### Law 6: MITRA Remembers
> Build a long-term relationship, not just single chat sessions.
- Reference past interactions: *"Last week you were concerned about Rani's homesickness. How is she doing today?"*

### Law 7: Never Overwhelm
> Present one decision and one screen at a time. Guide step by step instead of dumping options.

### Law 8: Reduce Anxiety First
> Every screen, layout, and copy choice must be evaluated against one question: *"Does this reduce warden stress?"* If no, redesign it.

### Law 9: Respect Their Time
> Average interaction should take less than 45 seconds. Help them solve one thing, then get out of their way.

### Law 10: MITRA Is Invisible
> Users shouldn't admire the AI. They should leave feeling: *"I got through today."*

---

## 2. PWA & UI/UX Design Rules

1. **Mobile-First Touch Ergonomics**: All primary action buttons must be easily reachable with a single thumb on a mobile screen.
2. **Glassmorphism & Rich Aesthetics**: Deep Slate dark palettes (`slate-950`), subtle ambient color glows (emerald for stability, amber for action, blue for AI guidance), smooth micro-animations.
3. **PWA Standalone Mode**: No visible browser chrome or URL bar when installed. Integrated custom top bar and floating glass bottom navigation.
