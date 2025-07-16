import { Request, Response } from 'express';
import { Incident } from '../models';
import { generateSummary } from '../services/openaiService';
import { incidentSchema } from '../validators/incidentValidator';
import { logError } from '../utils/logger';

export const createIncident = async (req: Request, res: Response) => {
  const userId = (req as any).uid;

  const parsed = incidentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  try {
    const incident = await Incident.create({ ...parsed.data, userId });
    res.json(incident);
  } catch (err) {
    logError(err);
    res.status(500).json({ error: 'Failed to create incident' });
  }
};

export const getUserIncidents = async (req: Request, res: Response) => {
  const userId = (req as any).uid;

  try {
    const incidents = await Incident.findAll({ where: { userId } });
    res.json(incidents);
  } catch (err) {
    logError(err);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
};

export const summarizeIncident = async (req: Request, res: Response) => {
  const userId = (req as any).uid;
  const incidentId = req.params.id;

  try {
    const incident = await Incident.findByPk(incidentId);

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    if (incident.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const summary = await generateSummary(incident.description);
    await incident.update({ summary });
    res.json(incident);
  } catch (err) {
    logError(err);
    res.status(500).json({ error: 'Failed to summarize incident' });
  }
};

export const updateIncident = async (req: Request, res: Response) => {
  const userId = (req as any).uid;
  const { type, description } = req.body;

  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    if (incident.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await incident.update({ type, description });
    res.json(incident);
  } catch (err) {
    logError(err);
    res.status(500).json({ error: 'Failed to update incident' });
  }
};

export const deleteIncident = async (req: Request, res: Response) => {
  const userId = (req as any).uid;

  try {
    const incident = await Incident.findByPk(req.params.id);
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    if (incident.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    await incident.destroy();
    res.json({ success: true });
  } catch (err) {
    logError(err);
    res.status(500).json({ error: 'Failed to delete incident' });
  }
};
