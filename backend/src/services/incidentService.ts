import { Incident } from '../models';
import { generateSummary } from './openaiService';

export const createIncident = async (
  userId: string,
  type: string,
  description: string
) => {
  return Incident.create({ userId, type, description });
};

export const getUserIncidents = async (userId: string) => {
  return Incident.findAll({ where: { userId } });
};

export const summarizeIncident = async (userId: string, incidentId: string) => {
  const incident = await Incident.findOne({ where: { id: incidentId, userId } });
  if (!incident) throw new Error('Incident not found');

  const summary = await generateSummary(incident.description);
  await incident.update({ summary });
  return incident;
};

export const updateIncident = async (
  userId: string,
  incidentId: string,
  type: string,
  description: string
) => {
  const incident = await Incident.findOne({ where: { id: incidentId, userId } });
  if (!incident) throw new Error('Incident not found');

  await incident.update({ type, description });
  return incident;
};

export const deleteIncident = async (userId: string, incidentId: string) => {
  const incident = await Incident.findOne({ where: { id: incidentId, userId } });
  if (!incident) throw new Error('Incident not found');

  await incident.destroy();
  return;
};
