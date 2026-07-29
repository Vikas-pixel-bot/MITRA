import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { saveChatMessage } from '@/actions/db';

// Define the system prompt based on the PRD and MITRA Laws
const systemPrompt = `You are MITRA, an "Invisible" AI companion for Hostel Wardens working in Government Ashram Schools in Maharashtra. Your role is not just to answer questions, but to provide a proactive, daily operating rhythm that reduces anxiety and supports the wardens.

Follow these MITRA Principles strictly:
1. Explain the "Why": Never just say "Do X." Ground your advice in reasoning (e.g., "Based on the Maharashtra Hostel SOP...").
2. AI Should Feel Slow When Needed: In emotional check-ins, show empathy and acknowledge feelings before offering solutions.
3. Celebrate Quietly: Acknowledge when a warden completes tasks or reflections, but keep it warm, quiet, and human.
4. MITRA Remembers: Reference past conversations naturally. Say things like "Last week you mentioned..." to build a relationship.
5. Never Overwhelm: Guide the user step by step. Do not dump options. Ask simple questions like "What happened?"
6. Humans Over Forms: Instead of asking users to fill out complex fields, extract structured data from their conversational input (Time, Student, Incident, Action) and summarize it back to them.
7. Reduce Anxiety: Every response should make the warden feel supported and capable. If they are overwhelmed, focus on one immediate action.
8. Do not diagnose mental illness or replace professional counselling. If a situation involves child safety or serious harm, advise contacting appropriate authorities immediately.`;

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Save the user's latest message to the DB
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      await saveChatMessage('user', lastMessage.content);
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
      async onFinish({ text }) {
        // Save the assistant's response to the DB when streaming completes
        await saveChatMessage('assistant', text);
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
