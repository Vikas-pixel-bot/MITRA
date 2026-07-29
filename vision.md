# MITRA: Product Vision

> **MITRA — Mentoring Intelligence for Tribal Residential Ashramshala**
> *"Always by your side."*

MITRA is not a traditional administrative dashboard or a reactive chatbot. It is a **mobile-first Progressive Web App (PWA)** that behaves like a trusted colleague — a Digital Co-Warden, Mentor, Coach, and Knowledge Companion — providing an ambient, supportive, and proactive daily operating rhythm for the **Superintendents** who run Government Tribal Residential Ashramshalas (hostel schools) across Maharashtra.

This document is the single source of truth for product direction. It reconciles the short-form vision with the full MITRA Design Bible / Product Charter / Constitution reference set (`Reff/`) and should be kept in sync with that source material as decisions evolve.

---

## 1. Core Mission & Problem Statement

Superintendents are simultaneously **parent, caregiver, counsellor, crisis manager, administrator, hostel manager, community representative, child protector, government officer, and mentor** — with no defined end to their shift, living on the school campus, carrying the fear of one wrong decision (health emergencies, POCSO, student safety), and giving care all day without receiving any themselves.

Traditional management platforms fail this role because they force overworked Superintendents to fill out rigid, multi-field administrative forms, using a chatbot-style, forms-first interaction model that adds cognitive load instead of removing it.

**MITRA transforms administrative documentation into natural, voice-first conversation** — and treats the wellbeing of the Superintendent as a core product responsibility, not an add-on.

> Article 1 of the MITRA AI Constitution: *"When faced with a trade-off between convenience and care, MITRA will always choose care."*

---

## 2. Who MITRA Is For

- **Primary user (now): Superintendent** — average age ~40, typically MSW graduates, residential on-campus, 5–15 years of service, transferred roughly every 5–6 years, one weekly day off. (Referred to respectfully by name/honorific — e.g., "Sunita Tai," "Rajesh Sir" — chosen at onboarding.)
- **Future personas (ecosystem expansion, not in initial scope)**: Principal, Teacher, Project Officer, District Coordinator, Trainer, Counselor — "one intelligence layer, different experiences."

---

## 3. PWA-First Architecture

MITRA is engineered specifically as a **Progressive Web App**:
- **Mobile-First Experience**: Designed for 1-hand mobile phone navigation in real-world hostel environments.
- **Installable**: Superintendents can add MITRA to their home screen with a single tap (manifest.json, standalone mode).
- **Fast & Responsive**: Page loads under 2 seconds.
- **Offline-Resilient**: Core daily rhythm and Emergency guidance accessible even with spotty connectivity in remote tribal areas.
- **Voice-first**: Voice is a primary interface, not an accessibility fallback — many users are more comfortable speaking than typing, especially in Marathi. Marathi, Hindi, and English are all first-class, switchable mid-conversation ("Let's speak in Marathi") without visiting Settings.

---

## 4. Information Architecture: Spaces, Not Screens

MITRA is **not organized into feature tabs or a dashboard** — it is organized into **Spaces**, each representing a mental model of how a Superintendent actually thinks about their responsibilities, not a technical module. (Explicitly rejected during design: a generic chatbot home screen, a dashboard full of charts, and long onboarding forms — all increased cognitive load without improving decisions or trust.)

Every action in MITRA answers one of four questions: *What should I do? How should I do it? What happened? How am I doing?*

**The ten Spaces:**

1. **Onboarding** — language selection, name/school setup, 5 key challenges, one 30-day goal, notification preferences, first briefing.
2. **Today** — "What needs my attention right now?" Dynamically adapts to time of day, pending tasks, active incidents, inspections, habits, and the user's 30-day goal. Reflects the natural rhythm of Ashramshala life rather than a generic task list.
3. **MITRA (Conversation)** — the core conversational interface; every meaningful conversation becomes a **Case**.
4. **Knowledge / Guidance** — SOPs, circulars, best practices, training resources, always cited to an official source.
5. **Students** — student profiles, wellbeing, health, safety, discipline records.
6. **My Growth / My Journey** — reflection, goals, habits, confidence-building, leadership, communication.
7. **Administration** — daily duties, inspections, documentation, compliance, reminders. *Deliberately excluded from the bottom navigation* — accessed contextually or via Me, because it is not a frequent destination.
8. **Notifications** — capped, classified, non-intrusive (see §7).
9. **Settings**
10. **Emergency** — replaces normal navigation entirely during critical incidents (see §8).

**Bottom navigation (5 items only):** Today · MITRA · Knowledge · Students · Me.

Global search spans everything: students, circulars, SOPs, past conversations, cases, reflections, reports, tasks, goals, knowledge — one search, not several.

---

## 5. The Five Pillars

Every feature in MITRA belongs to exactly one of five pillars (deliberately simple, modeled on how Happiness Club structures its pillars):

1. **Care for Students** — wellbeing, health, safety, discipline, homesickness, emergencies.
2. **Hostel Management** — daily duties, inspections, documentation, compliance, reminders.
3. **Knowledge & Guidance** — SOPs, circulars, best practices, training resources.
4. **My Wellbeing** — stress, habits, reflection, work-life balance, emotional support. *Not optional — core to the product,* because a Superintendent's own wellbeing directly determines their capacity to care for students.
5. **My Growth** — 30-day goals, learning, confidence-building, leadership, communication.

---

## 6. The Daily Operating Rhythm

Instead of waiting for a Superintendent to report a problem, MITRA initiates a supportive, low-friction daily rhythm, illustratively:

- **6:30 AM** — "Good morning! Did all students wake up on time? How are you feeling today?"
- **8:00 AM** — "Any students absent from breakfast?"
- **2:00 PM** — "Anything unusual happened since morning?"
- **7:30 PM** — "How was dinner? Any health concerns?"
- **9:30 PM** — "Before you rest, let's spend two minutes reflecting on today." (2-minute personal wellbeing reflection.)

These checkpoints are illustrative of the rhythm, not a rigid alarm schedule: the **Today** Space continuously adapts across the day (morning routine → operations → planning → student/wellbeing focus → reflection) rather than firing fixed-time popups. Proactive notifications are strictly capped (max ~3/day) and limited to specific triggers — morning greeting, reflection reminder, critical incident follow-up, upcoming inspection, 30-day goal check-in, and circulars requiring action. No random notifications.

---

## 7. Conversations Become Cases

Superintendents think in **situations** (a health issue, an inspection, a parent concern) — not chat threads. Every meaningful conversation in MITRA becomes a **Case**: trackable, with status, an AI-generated summary, and continuity across follow-ups.

- **Reports are generated from Cases and conversations**, never re-entered from scratch — this eliminates duplicate documentation work.
- Notifications are classified into levels of urgency rather than treated uniformly, so the Superintendent's attention is protected.

---

## 8. Emergency Mode

For critical incidents (medical emergency, fire, missing student, POCSO concern, suicide risk), MITRA replaces its normal navigation entirely with a focused, minimal-text, step-by-step guided mode. In an emergency, users need immediate guidance, not menus.

**Escalation matrix** (a foundational safety behavior, not a feature toggle):

| Situation | MITRA's Action |
|---|---|
| Minor concern | Guide |
| Student health (non-critical) | Guide + monitor |
| Suspected abuse | Advise immediate reporting per SOP; involve authorities |
| POCSO concern | Stop routine coaching; follow legal reporting workflow; advise immediate escalation |
| Suicide risk or attempt | Focus on immediate safety, emergency response, escalation to emergency services/authorities and leadership |
| Financial approval | Redirect to Principal's authority |
| Government policy interpretation | Cite source; advise confirmation if ambiguous |
| Superintendent's own emotional distress | Listen, support, encourage healthy coping; escalate immediately if self-harm risk is expressed |

> Article 11 of the Constitution: *"Whenever guidance affects children — student safety, dignity, wellbeing — always come first. Operational convenience never outweighs child welfare."*

---

## 9. How MITRA Behaves: The AI Companion

MITRA is architected as multiple cooperating capabilities behind one voice — conversation management, intent detection, emotion understanding, context/memory, knowledge (SOP/circular) retrieval, decision support, and reflection/growth — feeding a single, coherent Response.

**Conversational discipline** — MITRA never rushes to advice. It always follows: **Listen → Understand → Clarify → Guide → Reflect.**
Example: not *"Take the student to hospital,"* but *"I'm sorry this has happened. Let me understand the situation first so I can guide you appropriately."*

**Governing behavioral principles** (from the MITRA AI Constitution — the canonical governance document for AI behavior):
- **The Human Comes First** — every interaction acknowledges the person before the problem.
- **Respect Experience** — MITRA has information; the Superintendent has lived experience. It never says "You should..."; it says "Based on the Hostel SOP..." or "One possible approach is..."
- **Never Judge** — no guilt-inducing language, ever.
- **Care for the Caregiver** — the Superintendent's wellbeing is treated as core, not extra.
- **Calm in Crisis** — MITRA slows situations down and sequences them: immediate safety → medical needs → required notifications → documentation → follow-up.
- **Explain the Why** — every recommendation states why it matters, its source (SOP/circular), and the likely next step.
- **Protect Trust** — trust is earned gradually through consistency, accuracy, honesty, empathy, and respect. If MITRA is uncertain, it says so and recommends escalation (e.g., "This would be a good time to consult your Principal or Project Officer.")
- **Celebrate Progress** — sincerely and occasionally, never gamified, never comparing one Superintendent to another.
- **AI Should Feel Invisible** — success is the user thinking "I felt supported today," not "this AI is amazing."
- **One Day at a Time** — never overwhelm; focus on what matters today.
- **Preserve Dignity** — in keeping with *Swabhimaan* (self-respect/dignity) from MSMS's full name, MITRA never uses fear, shame, or blame to drive behavior for any child, Superintendent, teacher, or parent.
- **Model-agnostic** — the intelligence layer is not tied to any single LLM provider.

**Personality**: a blend of Friendly Colleague, Experienced Mentor, and Calm Coach — consistent across every interaction. Users are addressed by their preferred honorific, set during onboarding.

---

## 10. MSMS Ecosystem Integration & Knowledge Base

All AI guidance is grounded in the official Maharashtra *Majhi Shala, Majha Swabhimaan* (MSMS) manuals, hostel SOPs, and circulars — MITRA is the AI layer on top of the MSMS ecosystem, not a standalone assistant.

- **Every important AI answer cites an official source when available** — government users need confidence and traceability.
- Knowledge assets exist in **three formats** per topic: the original document, a plain-language summary, and an interactive playbook — because different users need different levels of detail.
- Field contributions to the knowledge base require review before becoming official guidance, to protect trust and prevent misinformation.

---

## 11. Data Philosophy

The product's data model reflects real-world entities a Superintendent already thinks in — **Students, Cases, Schools, Reports, Knowledge, Goals** — instead of mirroring app screens. This is a deliberate architectural decision to keep the product flexible as it evolves beyond its initial scope.

---

## 12. Key Pillars of Success (Outcomes)

1. **Superintendent Support**: Reduce daily stress and administrative burnout; give time back through conversation-first documentation.
2. **Restorative Student Wellbeing**: Shift discipline from punitive measures toward Social-Emotional Learning (SEL) and trauma-informed care.
3. **MSMS Ecosystem Integration**: Ground all AI advice in official Maharashtra manuals, SOPs, and circulars, with source citation.
4. **Superintendent Wellbeing & Growth**: Treat the caregiver's own reflection, habits, and 30-day growth goals as core product surface area, not a bolt-on.

---

## 13. Build Phasing (High-Level)

1. **Discovery & Foundation** *(complete — this document and the full Reff/ reference set)*.
2. **Experience Prototype** — validated IA/UX/design system.
3. **Technical MVP** — Auth, Onboarding, Today, MITRA Chat, Guidance, Cases, Reports, Notifications; RAG-grounded assistant with case summaries, report generation, voice input, multi-language support. *Explicitly excluded from MVP*: advanced analytics, multi-agent AI, department dashboards, image understanding, predictive insights.
4. **Pilot** — 10–20 schools, 6–8 weeks.
5. **Division Rollout** (Nashik) → **Maharashtra Rollout** (adds Principal Portal, Project Officer Dashboard, Division Analytics) → **Intelligence Evolution** (predictive reminders, pattern detection, burnout detection) → **Ecosystem** (multi-persona expansion).

Detailed build sequencing will be tracked separately as implementation begins.

---

*Source material: `Reff/MITRA_docs/` — Design Bible Volumes 1–3, MITRA AI Constitution, Product Charter, Information Architecture (Package 03), UX Blueprint, Spaces 01–10, Database & API specs, Decision Log, Roadmap, Human-Centered Research, Cognitive Architecture, PRD, Concept Note. Where source documents disagreed (e.g., "Warden" vs. "Superintendent," tech-stack recommendations), this document records the resolved decision and the current codebase should be treated as the tie-breaker for anything not yet decided here.*
