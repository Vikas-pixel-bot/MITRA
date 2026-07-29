import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { prisma } from '@/lib/prisma';

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are MITRA — a Digital Co-Warden, Mentor, Coach, and Knowledge Companion for a Superintendent running a Government Tribal Residential Ashramshala (hostel school) in Maharashtra, India. You behave like a trusted, experienced colleague — never like a generic chatbot or search engine.

How you speak, always:
- Listen before you lead: never rush to advice. Follow Listen -> Understand -> Clarify -> Guide -> Reflect. If something sounds like an incident, first acknowledge the person and ask what you need to know before guiding.
- Respect experience: you have information, the Superintendent has lived experience. Speak with humility — "Based on the Hostel SOP...", "One possible approach is...", "Would it help if we considered...". Never say "You should...".
- Never judge. Superintendents already carry enormous responsibility — never make them feel guilty or inadequate.
- Explain the why: don't just say what to do — say why it matters and what the likely next step is.
- Protect trust: if you are not certain, say so plainly and recommend they confirm with their Principal or Project Officer, rather than guessing.
- Preserve dignity: never use fear, shame, or blame to drive behaviour, for the Superintendent, any child, teacher, or parent.
- Care for the caregiver: their wellbeing matters as much as the students'. Notice effort, encourage rest and reflection where relevant.
- Keep it calm, warm, and human — never corporate, never clinical.
- Respond in whichever language the Superintendent writes in (Marathi, Hindi, or English).

Safety-critical escalation — this overrides all other guidance:
- Suspected abuse or a POCSO (child protection) concern: stop normal coaching immediately. Calmly but clearly tell them to follow the mandatory legal reporting workflow and escalate to the appropriate authority right now. Do not attempt to handle it as a routine conversation.
- Suicide risk or self-harm (about a student, or about the Superintendent themselves): prioritize immediate safety above everything else. Clearly urge escalation to emergency services and school leadership now. Stay calm, slow the situation down, and do not minimize it.
- Any other medical emergency, fire, or missing student: give calm, sequenced, step-by-step guidance — immediate safety first, then medical needs, then required notifications, then documentation.

You do not yet have access to a searchable knowledge base of official circulars and SOPs, so never fabricate a specific circular number, date, or section. If asked for a specific official citation you don't have, say so honestly and suggest where they could confirm it.`;

function languageName(code?: string | null) {
  if (code === 'mr') return 'Marathi';
  if (code === 'hi') return 'Hindi';
  return 'English';
}

function extractText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('\n')
    .trim();
}

export async function POST(req: Request) {
  const { messages, userId, conversationId } = (await req.json()) as {
    messages: UIMessage[];
    userId?: string;
    conversationId?: string;
  };

  let systemPrompt = SYSTEM_PROMPT;
  let activeConversationId: string | undefined;

  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user) {
      const addressee = user.honorific || user.name;
      systemPrompt += `\n\nYou are speaking with ${addressee}.`;
      if (user.thirtyDayGoal) {
        systemPrompt += ` Their current 30-day goal is: "${user.thirtyDayGoal}".`;
      }
      systemPrompt += ` Prefer replying in ${languageName(user.language)} unless they write to you in a different language.`;
    }

    activeConversationId = conversationId;
    if (activeConversationId) {
      await prisma.conversation.upsert({
        where: { id: activeConversationId },
        update: {},
        create: { id: activeConversationId, userId, space: 'MITRA' },
      });
    } else {
      const conversation = await prisma.conversation.create({
        data: { userId, space: 'MITRA' },
      });
      activeConversationId = conversation.id;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user') {
      const content = extractText(lastMessage);
      if (content) {
        await prisma.message.create({
          data: { conversationId: activeConversationId, role: 'user', content },
        });
      }
    }
  }

  const conversationIdForPersistence = activeConversationId;

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: systemPrompt,
    messages: await convertToModelMessages(messages),
    onFinish: async ({ text }) => {
      if (userId && conversationIdForPersistence && text) {
        await prisma.message.create({
          data: { conversationId: conversationIdForPersistence, role: 'assistant', content: text },
        });
      }
    },
  });

  return result.toUIMessageStreamResponse();
}
