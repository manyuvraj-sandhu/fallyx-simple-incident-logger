import express from 'express';
import { Incident } from '../models/incident';
import { verifyToken } from '../middleware/auth';
import { generateSummary } from '../services/openaiService';

const router = express.Router();

// Create a new incident
router.post('/incidents', verifyToken, async (req, res) => {
  const { type, description } = req.body;
  const userId = (req as any).uid;

  try {
    const incident = await Incident.create({ type, description, userId });
    res.json(incident);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// Get all incidents for authenticated user
router.get('/incidents', verifyToken, async (req, res) => {
  const userId = (req as any).uid;

  try {
    const incidents = await Incident.findAll({ where: { userId } });
    res.json(incidents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// Summarize an incident
router.post('/incidents/:id/summarize', verifyToken, async (req, res) => {
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
});

export default router;
