import { prisma } from '@/lib/prisma';

export interface CheckpointPrompt {
  id: string;
  timeSlot: string; // '6:30 AM' | '8:00 AM' | '7:30 PM' | '9:30 PM'
  title: string;
  subtitle: string;
  aiGreeting: string;
  suggestedAction: string;
  category: 'WELLBEING' | 'HYDRATION' | 'ATTENDANCE' | 'REFLECTION';
  chatPrompt: string;
}

export async function getProactiveCheckpoints(userId?: string | null) {
  try {
    const hour = new Date().getHours();
    
    // Determine active checkpoint based on current time rhythm
    let currentSlot = '8:00 AM';
    if (hour >= 5 && hour < 8) currentSlot = '6:30 AM';
    else if (hour >= 8 && hour < 14) currentSlot = '8:00 AM';
    else if (hour >= 14 && hour < 20) currentSlot = '7:30 PM';
    else currentSlot = '9:30 PM';

    const CHECKPOINTS: CheckpointPrompt[] = [
      {
        id: 'morning-wake',
        timeSlot: '6:30 AM',
        title: 'Morning Energy & Hydration Check',
        subtitle: 'Good morning Superintendent Sir! Drink a warm glass of water before morning assembly.',
        aiGreeting: 'सुप्रभात Superintendent Sir! Did you get enough rest last night? How are you feeling this morning?',
        suggestedAction: '💧 Hydration Reminder: 1 Glass Water Taken',
        category: 'HYDRATION',
        chatPrompt: 'Good morning MITRA. I am starting my morning round.',
      },
      {
        id: 'assembly-count',
        timeSlot: '8:00 AM',
        title: 'Breakfast & Morning Assembly Care',
        subtitle: 'Check on student presence and inspect kitchen meal quality.',
        aiGreeting: 'Namaskar! Morning assembly is complete. How did meal inspection go? Is any child looking unwell?',
        suggestedAction: '🍱 Food Quality & Presence Check',
        category: 'ATTENDANCE',
        chatPrompt: 'MITRA, let us log morning assembly attendance and breakfast inspection.',
      },
      {
        id: 'evening-study',
        timeSlot: '7:30 PM',
        title: 'Evening Checkpoint & Hydration',
        subtitle: 'Evening study circle is active. How was your day overall?',
        aiGreeting: 'Good evening! You have worked hard today. Did you drink water during afternoon rounds?',
        suggestedAction: '🌊 Hydration & Rest Check',
        category: 'WELLBEING',
        chatPrompt: 'MITRA, I want to talk about how my day went in the hostel today.',
      },
      {
        id: 'night-reflection',
        timeSlot: '9:30 PM',
        title: 'Night Care & Quiet Self-Reflection',
        subtitle: 'Roll call complete. Take 2 minutes for your own emotional wellbeing.',
        aiGreeting: 'Good night Superintendent Sir. Before you sleep, who made you smile today? How is your energy?',
        suggestedAction: '🌙 2-Minute Reflection Journal',
        category: 'REFLECTION',
        chatPrompt: 'MITRA, let us do a quick evening reflection before sleeping.',
      },
    ];

    const active = CHECKPOINTS.find((c) => c.timeSlot === currentSlot) || CHECKPOINTS[1];

    return {
      success: true as const,
      currentSlot,
      activeCheckpoint: active,
      allCheckpoints: CHECKPOINTS,
    };
  } catch (error) {
    console.error('Error fetching proactive checkpoints:', error);
    return {
      success: false as const,
      error: 'Failed to fetch checkpoints',
    };
  }
}
