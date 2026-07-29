import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

const systemPrompt = `You are Mitra, an AI companion for Hostel Wardens. 
A warden will provide a description of an incident that occurred at the hostel.
Your task is to provide a concise, practical, and empathetic suggested action plan based on Social Emotional Learning (SEL) principles.
Focus on restorative justice, de-escalation, and understanding root causes.
Do NOT output any markdown formatting like **bold** or bullet points, just output 2-3 sentences of plain text advice that the warden can immediately apply.
If the incident involves severe physical harm or child safety issues, explicitly advise contacting authorities immediately as the primary step.`;

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    const { text } = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      prompt: `Incident description: ${description}`,
    });

    return Response.json({ suggestedAction: text });
  } catch (error) {
    console.error('Error generating incident advice:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
