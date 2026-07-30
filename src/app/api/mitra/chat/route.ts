import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { prisma } from '@/lib/prisma';

export const maxDuration = 30;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are MITRA — a Digital Co-Warden, Mentor, Coach, and Knowledge Companion for a Superintendent running a Government Tribal Residential Ashramshala (hostel school) in Maharashtra, India. You behave like a trusted, experienced colleague — never like a generic chatbot or search engine.

How you speak, always:
- Listen before you lead: never rush to advice. Follow Listen -> Understand -> Clarify -> Guide -> Reflect. If something sounds like an incident, first acknowledge the person and ask what you need to know before guiding.
- Respect experience: speak with humility — "Based on the Hostel SOP...", "One possible approach is...".
- Never judge. Keep it calm, warm, and human.
- Respond in whichever language the Superintendent writes in (Marathi, Hindi, or English).`;

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
  try {
    const { messages, userId, conversationId } = (await req.json()) as {
      messages: UIMessage[];
      userId?: string;
      conversationId?: string;
    };

    let systemPrompt = SYSTEM_PROMPT;
    let activeConversationId: string | undefined;

    if (userId) {
      try {
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
      } catch (dbError) {
        console.warn('DB persistence skipped in chat due to glitch:', dbError);
      }
    }

    const conversationIdForPersistence = activeConversationId;

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        if (userId && conversationIdForPersistence && text) {
          try {
            await prisma.message.create({
              data: { conversationId: conversationIdForPersistence, role: 'assistant', content: text },
            });
          } catch (e) {
            console.warn('Assistant message persistence skipped:', e);
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat message' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
