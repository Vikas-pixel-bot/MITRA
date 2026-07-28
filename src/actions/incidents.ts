'use server';

import { prisma } from '@/lib/prisma';

// Fetch the most recent unresolved incident
export async function getUnresolvedIncident() {
  try {
    const incident = await prisma.incident.findFirst({
      where: { status: 'UNRESOLVED' },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, incident };
  } catch (error) {
    console.error('Error fetching unresolved incident:', error);
    return { success: false, incident: null };
  }
}

// Log a new incident (and optionally save the AI's suggested action)
export async function logIncident(description: string, suggestedAction: string) {
  try {
    const incident = await prisma.incident.create({
      data: {
        description,
        suggestedAction,
        status: 'UNRESOLVED',
      },
    });
    return { success: true, incident };
  } catch (error) {
    console.error('Error logging incident:', error);
    return { success: false, incident: null };
  }
}

// Resolve an incident
export async function resolveIncident(id: string, resolutionNotes: string) {
  try {
    const incident = await prisma.incident.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolutionNotes,
      },
    });
    return { success: true, incident };
  } catch (error) {
    console.error('Error resolving incident:', error);
    return { success: false, incident: null };
  }
}

// Fetch all incidents (for a history view if needed)
export async function getAllIncidents() {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, incidents };
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return { success: false, incidents: [] };
  }
}
