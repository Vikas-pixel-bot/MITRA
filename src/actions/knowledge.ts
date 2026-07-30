'use server';

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface KnowledgeFilterOptions {
  category?: string;
  query?: string;
}

export async function getKnowledgeItems(options: KnowledgeFilterOptions = {}) {
  try {
    const { category, query } = options;

    const where: Prisma.KnowledgeWhereInput = {};

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (query && query.trim()) {
      const q = query.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { summary: { contains: q, mode: 'insensitive' } },
        { content: { contains: q, mode: 'insensitive' } },
        { officialSource: { contains: q, mode: 'insensitive' } },
        { tags: { hasSome: [q] } },
      ];
    }

    const items = await prisma.knowledge.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true as const,
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        officialSource: item.officialSource,
        summary: item.summary,
        content: item.content,
        tags: item.tags,
        updatedAt: item.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching knowledge items:', error);
    return { success: false as const, error: 'Failed to fetch knowledge items' };
  }
}

const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'and', 'or', 'but', 'to', 'of', 'in', 'on',
  'for', 'with', 'my', 'me', 'i', 'we', 'you', 'what', 'how', 'do', 'does', 'did', 'should',
  'can', 'could', 'would', 'about', 'this', 'that', 'it', 'has', 'have', 'had', 'today',
]);

/**
 * Lightweight lexical retrieval over the Knowledge base for grounding chat
 * replies — no embeddings/pgvector infra, deliberately simple given the
 * current handful of seeded items. Extracts meaningful terms from a free-text
 * message, fetches candidates matching any term, then ranks by term overlap.
 */
export async function retrieveRelevantKnowledge(userMessage: string, limit = 3) {
  try {
    const terms = Array.from(
      new Set(
        userMessage
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter((word) => word.length > 3 && !STOPWORDS.has(word))
      )
    );

    if (terms.length === 0) return { success: true as const, items: [] };

    const candidates = await prisma.knowledge.findMany({
      where: {
        OR: terms.flatMap((term) => [
          { title: { contains: term, mode: 'insensitive' as const } },
          { summary: { contains: term, mode: 'insensitive' as const } },
          { content: { contains: term, mode: 'insensitive' as const } },
          { tags: { hasSome: [term] } },
        ]),
      },
      take: 20,
    });

    const scored = candidates
      .map((item) => {
        const haystack = `${item.title} ${item.summary} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
        const score = terms.reduce((count, term) => count + (haystack.includes(term) ? 1 : 0), 0);
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return {
      success: true as const,
      items: scored.map(({ item }) => ({
        title: item.title,
        officialSource: item.officialSource,
        summary: item.summary,
        content: item.content,
      })),
    };
  } catch (error) {
    console.error('Error retrieving knowledge for grounding:', error);
    return { success: true as const, items: [] };
  }
}

export async function seedKnowledgeBase() {
  try {
    // If knowledge items exist, skip re-seeding
    const count = await prisma.knowledge.count();
    if (count >= 10) {
      return { success: true, seeded: false, count };
    }

    // Clear old sample knowledge to ensure the complete 10 Core Service Modules are present
    await prisma.knowledge.deleteMany({});

    const TEN_CORE_MODULES = [
      {
        title: 'Module 1: Daily Conversations & Non-Judgmental Space',
        category: 'MODULE_1',
        officialSource: 'MITRA System Blueprint — Core Module 01',
        summary: 'A completely non-judgmental space for wardens to explore conflicts, daily events, or queries using Listen -> Understand -> Clarify -> Guide.',
        content: `### Core Framework & Playbook
- **Listen Before Advice**: Acknowledge warden emotional state before jumping into standard rules.
- **CASEL SEL Alignment**: Encourage self-awareness and active reflection.
- **Code-Mixed Guidance**: Natural Marathi-English empathetic conversation.`,
        tags: ['Module 1', 'Daily Conversations', 'SEL', 'Empathetic Support'],
      },
      {
        title: 'Module 2: Hostel Operations & Management Assistant',
        category: 'MODULE_2',
        officialSource: 'Maharashtra Tribal Hostel Operations Standard SOP 4.2',
        summary: 'Practical, real-time guidance on daily routines, dining hygiene, facility cleanliness, and parental communication.',
        content: `### Operations Checklist
1. **Raw Material Audit**: Verify rice, pulses, and milk freshness before cooking.
2. **Sample Tasting**: Sample meals 15 minutes before serving to students.
3. **Cleanliness Rounds**: Inspect dining hall, RO water purifiers, and sanitation units daily.`,
        tags: ['Module 2', 'Operations', 'Food Hygiene', 'Hostel Management'],
      },
      {
        title: 'Module 3: CASEL SEL Coaching & Emotional Growth',
        category: 'MODULE_3',
        officialSource: 'CASEL Social-Emotional Learning Framework & MSMS Companion',
        summary: 'Promotes core CASEL competencies (Self-Awareness, Relationship Skills, Responsible Decision-Making) for wardens & children.',
        content: `### Restorative Practices
- **Active Listening**: Encourage children to express feelings without fear of punishment.
- **Breathing Exercises**: 2-minute grounding routines during stressful assembly or evening study.
- **Peer Mediation**: Pair students in conflict to build mutual understanding.`,
        tags: ['Module 3', 'SEL Coaching', 'CASEL', 'Emotional Support'],
      },
      {
        title: 'Module 4: Student Wellbeing & Restorative Care',
        category: 'MODULE_4',
        officialSource: 'MSMS Restorative Student Care Protocol',
        summary: 'Deals proactively with homesickness, absenteeism, peer aggression, and hygiene without defaulting to punitive action.',
        content: `### Restorative Care Protocol
1. **Homesickness**: Pair newly enrolled students with a compassionate senior buddy.
2. **Absenteeism**: Conduct friendly check-ins; avoid shaming or harsh punishment.
3. **Hygiene & Care**: Provide gentle guidance on personal hygiene and health routines.`,
        tags: ['Module 4', 'Student Care', 'Homesickness', 'Restorative'],
      },
      {
        title: 'Module 5: Critical Incident SOPs & Emergency Escalation',
        category: 'MODULE_5',
        officialSource: 'Maharashtra Tribal Safety Manual & Emergency Protocol',
        summary: 'Step-by-step guidance for extreme scenarios (Snake bite, Fire, Missing child, POCSO, Medical emergency) with exact authority contacts.',
        content: `### Critical Incident Emergency Checklist
1. **Snake Bite**: Keep victim still, do not apply tourniquet, transport immediately to PHC/Civil Hospital.
2. **POCSO / Safety Concern**: Mandatory legal reporting to CWC, SJPU Police, and PO within 24 hours. Confidentiality is legally required.
3. **Missing Child**: Immediately notify campus security, local police station, and Project Officer.`,
        tags: ['Module 5', 'Critical SOPs', 'Emergency', 'POCSO', 'Snake Bite'],
      },
      {
        title: 'Module 6: Knowledge Companion & Official Citation Library',
        category: 'MODULE_6',
        officialSource: 'TRTI & Tribal Development Department Circular Library',
        summary: 'Instant, citation-backed access to Government circulars, child protection guidelines, MSMS handbooks, and nutrition files.',
        content: `### Knowledge & Source Citation
- **Source Grounding**: All advice is backed by official Maharashtra Government circulars.
- **Format Tiers**: Available in original legal text, plain summary, and interactive playbooks.`,
        tags: ['Module 6', 'Knowledge', 'Government Circulars', 'SOPs'],
      },
      {
        title: 'Module 7: Daily Digital Register & Automated Log Conversion',
        category: 'MODULE_7',
        officialSource: 'MITRA Automated Registry Engine — Module 07',
        summary: 'No complex form entry. Wardens simply chat naturally ("2 kids have fever..."), and MITRA structures the official log entry automatically.',
        content: `### Automated Logging Workflow
1. **Natural Chat Input**: Speak or type informal daily updates.
2. **AI Structure**: MITRA extracts attendance, health flags, and meal quality.
3. **Register Persistence**: Persisted directly into official District & School log ledgers.`,
        tags: ['Module 7', 'Registry Logs', 'Digital Register', 'Automated Logs'],
      },
      {
        title: 'Module 8: Reflection Journal & Mindful Practice',
        category: 'MODULE_8',
        officialSource: 'Warden Wellbeing & Reflection Framework',
        summary: 'Prompts weekly deep thoughts ("Who made you smile today?", "Which child needs more attention tomorrow?") to build mindful practice.',
        content: `### Reflection Routine
- **Daily 2-Minute Check**: Quick evening mood log and reflection entry.
- **Mindful Growth**: Tracks emotional resilience over 30-day goal cycles.`,
        tags: ['Module 8', 'Self-Mindfulness', 'Reflection Journal', 'Wellbeing'],
      },
      {
        title: 'Module 9: Habit Builder & Micro-Challenges',
        category: 'MODULE_9',
        officialSource: 'MITRA Behavioral Growth Loop',
        summary: 'Tracks vital warden habits (hydration, sleeping on time, observing student progress) with supportive weekly micro-challenges.',
        content: `### Growth & Habit Loops
1. **Hydration & Rest**: Daily reminders for warden health.
2. **Student Audit**: Observe positive behavioral changes in 1 child daily.
3. **Weekly Progress**: Celebrate small, steady accomplishments.`,
        tags: ['Module 9', 'Habit Loops', 'Warden Habits', 'Growth'],
      },
      {
        title: 'Module 10: Warden Self-Care & Burnout Mitigation',
        category: 'MODULE_10',
        officialSource: 'Caregiver Mental Health & Burnout Prevention SOP',
        summary: 'Ensures wardens check on their own mental status, mitigating isolation-induced anxiety with grounding routines and late-night venting support.',
        content: `### Caregiver Self-Care Routine
1. **Emotional Venting**: Safe, non-judgmental space to express daily stress.
2. **Stress Index Monitoring**: Self-reported mood index keeps track of burnout risk.
3. **Grounding Exercises**: Quick 3-step breathing routine before sleep.`,
        tags: ['Module 10', 'Wellbeing', 'Self-Care', 'Burnout Prevention'],
      },
    ];

    for (const item of TEN_CORE_MODULES) {
      await prisma.knowledge.create({ data: item });
    }

    return { success: true, seeded: true, count: TEN_CORE_MODULES.length };
  } catch (error) {
    console.error('Error seeding knowledge base:', error);
    return { success: false, error: 'Failed to seed knowledge base' };
  }
}
