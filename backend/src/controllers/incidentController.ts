import { Request, Response } from 'express';
import { Incident } from '../models';
import { generateSummary } from '../services/openaiService';

export const createIncident = async (req: Request, res: Response) => {
  const { type, description } = req.body;
  const userId = (req as any).uid;

  try {
    const incident = await Incident.create({ type, description, userId });
    res.json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create incident' });
  }
};

export const getUserIncidents = async (req: Request, res: Response) => {
  const userId = (req as any).uid;

  try {
    const incidents = await Incident.findAll({ where: { userId } });
    res.json(incidents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
};

export const summarizeIncident = async (req: Request, res: Response) => {
  const userId = (req as any).uid;
  const incidentId = req.params.id;

  try {
    const incident = await Incident.findOne({ where: { id: incidentId, userId } });
    if (!incident) return res.status(404).send('Incident not found');

    const summary = await generateSummary(incident.get('description') as string);
    await incident.update({ summary });
    res.json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to summarize incident' });
  }
};

export const updateIncident = async (req: Request, res: Response) => {
  const userId = (req as any).uid;
  const { type, description } = req.body;

  try {
    const incident = await Incident.findOne({ where: { id: req.params.id, userId } });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    await incident.update({ type, description });
    res.json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update incident' });
  }
};

export const deleteIncident = async (req: Request, res: Response) => {
  const userId = (req as any).uid;

  try {
    const incident = await Incident.findOne({ where: { id: req.params.id, userId } });
    if (!incident) return res.status(404).json({ error: 'Incident not found' });

    await incident.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete incident' });
  }
};
