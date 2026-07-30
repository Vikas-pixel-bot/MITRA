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

export async function seedKnowledgeBase() {
  try {
    const count = await prisma.knowledge.count();
    if (count > 0) {
      return { success: true, seeded: false, count };
    }

    const SEED_DATA = [
      {
        title: 'Child Protection & Mandatory POCSO Protocol',
        category: 'LEGAL_POCSO',
        officialSource: 'Protection of Children from Sexual Offences (POCSO) Act & MSMS Guidelines Sec 19',
        summary: 'Immediate mandatory legal reporting workflow for any suspected child abuse or safety incident.',
        content: `### Mandatory Legal Guidance
1. **Immediate Safety First**: Ensure the student is in a safe, secure room with a female assistant/teacher (if girl student).
2. **Do Not Interrogate**: Listen to the child calmly without asking leading questions or expressing judgment.
3. **Mandatory Reporting**: Notify the Child Welfare Committee (CWC), local Police Station (Special Juvenile Police Unit), and Project Officer within 24 hours.
4. **Documentation**: Maintain strict confidentiality. Do not distribute or share any details on public or social channels.
5. **Medical Care**: Direct the student to the nearest Civil Hospital / PHC for official medical examination if required.`,
        tags: ['Safety', 'POCSO', 'Legal', 'Emergency'],
      },
      {
        title: 'Daily Hostel Dining & Food Quality Hygiene Inspection',
        category: 'SOP',
        officialSource: 'Maharashtra Tribal Development Department Ashramshala Food SOP Item 4.2',
        summary: 'Standard procedures for morning breakfast, lunch, and dinner inspection to ensure child nutrition & safety.',
        content: `### Daily Food Safety Checklist
1. **Raw Material Inspection**: Check quality of rice, pulses, oil, and fresh vegetables delivered before cooking.
2. **Cook Hygiene**: Ensure kitchen staff wear clean aprons, hairnets, and wash hands thoroughly.
3. **Sample Tasting**: The Superintendent or Assistant Superintendent must taste samples of cooked food 15 minutes before serving to students.
4. **Water Purity**: Test RO / drinking water filter output daily; report filter clog immediately.
5. **Log Entry**: Record meal quality, quantity served, and student feedback in the Daily Kitchen Register.`,
        tags: ['SOP', 'Food', 'Hygiene', 'Hostel Management'],
      },
      {
        title: 'Monsoon Seasonal Disease & Medical Emergency Workflow',
        category: 'CIRCULAR',
        officialSource: 'TRTI Health Circular 2025/MED-09 / Tribal Health Manual',
        summary: 'Preventative measures and rapid medical response protocol for Dengue, Malaria, and viral fever outbreaks.',
        content: `### Health & Disease Control Measures
1. **Daily Morning Temperature Check**: Screen students during morning assembly for fever, chills, or lethargy.
2. **Isolation Ward Setup**: Prepare a clean, ventilated room in the hostel for sick students.
3. **Immediate PHC Escalation**: If a student shows temperature > 100°F or persistent vomiting, transport to Primary Health Centre immediately. Do not self-administer prescription drugs.
4. **Water Stagnation Audit**: Inspect campus grounds every Tuesday to eliminate standing water and mosquito breeding spots.
5. **Parent Notification**: Notify parents calmly when a child is admitted to PHC for observation.`,
        tags: ['Health', 'Medical', 'Circular', 'Monsoon'],
      },
      {
        title: 'Restorative Care: Managing Severe Student Homesickness',
        category: 'PLAYBOOK',
        officialSource: 'MSMS Restorative Care Companion Guide — Section 2',
        summary: 'Empathetic steps to help newly enrolled tribal residential students adjust comfortably without punitive measures.',
        content: `### Step-by-Step Restorative Playbook
1. **Acknowledge Emotional Feeling**: Validate the child's feeling ("It is completely normal to miss home and your parents").
2. **Peer Buddy Pairing**: Pair the student with a compassionate senior student from the same village or taluka.
3. **Scheduled Home Call**: Allow a 5-minute phone conversation with parents in your presence during evening free time.
4. **Creative Engagement**: Involve the child in hostel evening sports, drawing, or cultural storytelling circle.
5. **Daily Monitoring**: Revisit the student for 3 days to celebrate small adjustments and build trust.`,
        tags: ['Restorative', 'Wellbeing', 'Homesickness', 'Student Care'],
      },
      {
        title: 'Ashramshala Campus Night Security & Roll Call SOP',
        category: 'SOP',
        officialSource: 'Maharashtra Tribal Residential Hostel Security Standard SOP 7.1',
        summary: 'Mandatory night roll-call procedure and boundary security check for residential student safety.',
        content: `### Night Operations Routine
1. **8:30 PM Mandatory Roll Call**: Conduct room-by-room headcount matching official hostel register.
2. **Gate Lock & Boundary Check**: Secure main hostel perimeter gates at 9:00 PM; verify campus lighting is active.
3. **Night Guard Duty Verification**: Confirm presence of night guard / female warden on duty at the entrance.
4. **Emergency Contact Display**: Ensure medical emergency numbers and PO contact details are displayed at the warden office.`,
        tags: ['Security', 'Safety', 'Night Routine', 'SOP'],
      },
    ];

    for (const item of SEED_DATA) {
      await prisma.knowledge.create({ data: item });
    }

    return { success: true, seeded: true, count: SEED_DATA.length };
  } catch (error) {
    console.error('Error seeding knowledge base:', error);
    return { success: false, error: 'Failed to seed knowledge base' };
  }
}
