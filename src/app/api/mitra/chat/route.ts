import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { prisma } from '@/lib/prisma';
import { retrieveRelevantKnowledge } from '@/actions/knowledge';

export const maxDuration = 30;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY,
});

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are MITRA — a Digital Co-Superintendent, Mentor, Coach, and Knowledge Companion for a Superintendent running a Government Tribal Residential Ashramshala (hostel school) in Maharashtra, India. You behave like a trusted, experienced colleague — never like a generic chatbot or search engine.

How you speak, always:
- Listen before you lead: never rush to advice. Follow Listen -> Understand -> Clarify -> Guide -> Reflect. If something sounds like an incident, first acknowledge the person and ask what you need to know before guiding.
- Respect experience: speak with humility — "Based on the Hostel SOP...", "One possible approach is..." — never "You should...".
- Never judge. Keep it calm, warm, and human. Instead of pointing out something was missed, say things like "Looks like today was busy. If you have a moment, let's take care of it now."
- Explain the why: don't just say what to do — say why it matters and, when relevant, what the likely next step is. Understanding builds confidence.
- Protect trust: if you are not fully certain about something (a specific circular, a legal detail, a policy specific), say so plainly and recommend they confirm with their Principal or Project Officer, rather than guessing or inventing a citation.
- Preserve dignity: never use fear, shame, or blame to drive behaviour, for the Superintendent, a student, a teacher, or a parent. Build confidence through encouragement, clarity, and respect.
- Care for the caregiver: the Superintendent's own wellbeing matters as much as the students'. Notice signs of stress or overload and gently check in.
- Respond in whichever language the Superintendent writes in (Marathi, Hindi, or English).
- Superintendents think in situations, not chat threads. When a conversation describes one real, specific situation worth tracking (an incident, a health concern, a discipline matter), use the createCase tool to log it — quietly, without announcing "I'm creating a case," then continue the conversation naturally.

Safety-critical escalation — this overrides everything above and must never be softened:
- Suspected abuse or a POCSO (child protection) concern: stop routine coaching immediately. Calmly but clearly tell them to follow the mandatory legal reporting workflow (Child Welfare Committee, police Special Juvenile Police Unit, Project Officer) and escalate right now. Do not treat it as a routine conversation.
- Suicide risk or self-harm — whether about a student or about the Superintendent themselves: prioritize immediate safety above everything else. Clearly and calmly urge escalation to emergency services and school leadership now. Do not minimize it, and do not end the conversation there — stay present.
- Snake bite, fire, missing student, or any other acute medical/physical emergency: give calm, sequenced, step-by-step guidance — immediate safety first, then medical needs, then required notifications, then documentation. Slow the situation down; never add to panic.
- General Superintendent distress that is not a safety emergency: listen, validate, and gently encourage healthy coping and rest — but if at any point self-harm risk is expressed, treat it as the suicide-risk case above.`;

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

            const knowledgeResult = await retrieveRelevantKnowledge(content);
            if (knowledgeResult.success && knowledgeResult.items.length > 0) {
              systemPrompt += `\n\nRelevant official guidance found for this conversation — use it to ground your answer and cite the source when you rely on it. If none of it actually applies, say so honestly rather than forcing a citation:\n${knowledgeResult.items
                .map(
                  (item, i) =>
                    `[${i + 1}] ${item.title}${item.officialSource ? ` (Source: ${item.officialSource})` : ''}\n${item.content}`
                )
                .join('\n\n')}`;
            }
          }
        }
      } catch (dbError) {
        console.warn('DB persistence skipped in chat due to glitch:', dbError);
      }
    }

    const conversationIdForPersistence = activeConversationId;

    try {
      const result = streamText({
        model: google('gemini-2.0-flash'),
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
    } catch (llmError) {
      console.error('Gemini API Error, falling back to Groq:', llmError);
      
      try {
        const fallbackResult = streamText({
          model: groq('llama-3.3-70b-versatile'),
          system: systemPrompt,
          messages: await convertToModelMessages(messages),
        });

        return fallbackResult.toUIMessageStreamResponse();
      } catch (groqError) {
        console.error('Groq API Error, returning local SOP fallback stream:', groqError);

        // Fallback local response stream ensuring 100% response delivery
        const lastMsg = messages[messages.length - 1];
        const userQuery = extractText(lastMsg).toLowerCase();
        
        let localReply = "Namaskar Superintendent Sir. I am review your request right now. For urgent medical concerns like injuries, snake bites, or fever, please ensure the student is safely moved to the sick room or nearest PHC immediately while I connect to full SOP guidance.";

        if (userQuery.includes('fall') || userQuery.includes('stair') || userQuery.includes('hurt') || userQuery.includes('injury')) {
          localReply = "Namaskar Sir. For a student injury or fall from stairs:\n1. Keep the student calm and motionless if head/spine injury is suspected.\n2. Apply immediate first-aid / ice pack for swelling.\n3. Contact the nearest Primary Health Centre (PHC) doctor or call 108 ambulance if severe pain persists.\n4. Log this incident in the Student Health Register and inform parents.";
        } else if (userQuery.includes('snake') || userQuery.includes('bite')) {
          localReply = "EMERGENCY PROTOCOL — SNAKE BITE:\n1. Keep the student completely calm and immobilize the bitten limb.\n2. Do NOT cut, suck, or tie tight tourniquets.\n3. Transport immediately to the nearest PHC / District Hospital for Anti-Snake Venom (ASV).\n4. Call 108 Ambulance immediately.";
        } else if (userQuery.includes('fung') || userQuery.includes('skin') || userQuery.includes('fever')) {
          localReply = "Namaskar Sir. For student skin infections or illness:\n1. Isolate personal towel and bedding to prevent spread among hostellers.\n2. Apply prescribed antifungal/soothing ointment.\n3. Have the visiting PHC doctor inspect the student during weekly health check-up.";
        }

        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(localReply)}\n`));
            controller.close();
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'x-vercel-ai-ui-stream': 'true',
          },
        });
      }
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat message' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
