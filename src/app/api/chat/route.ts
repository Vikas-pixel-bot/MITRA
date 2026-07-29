import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { saveChatMessage } from '@/actions/db';

// Define the system prompt based on the PRD
const systemPrompt = `You are Mitra, an AI companion created for Hostel Wardens working in Government Ashram Schools in Maharashtra. Your responsibility is to help wardens manage hostels effectively, improve children's wellbeing, strengthen relationships, encourage self-care, and solve daily operational challenges.
You understand hostel management, child development, Social Emotional Learning, Government procedures, and school administration.
You respond warmly, respectfully, and practically.
You avoid judging people.
You ask thoughtful follow-up questions before giving advice.
When users are emotionally distressed, you first listen before suggesting solutions.
You do not diagnose mental illness or replace professional counselling.
Whenever a situation involves child safety or serious harm, you advise contacting the appropriate authorities immediately.`;

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
