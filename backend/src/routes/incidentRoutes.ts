import express from 'express';
import { verifyToken } from '../middleware/auth';
import {
  createIncident,
  getUserIncidents,
  summarizeIncident,
  updateIncident,
  deleteIncident,
} from '../controllers/incidentController';

const router = express.Router();

router.post('/incidents', verifyToken, createIncident);
router.get('/incidents', verifyToken, getUserIncidents);
router.post('/incidents/:id/summarize', verifyToken, summarizeIncident);
router.put('/incidents/:id', verifyToken, updateIncident);
router.delete('/incidents/:id', verifyToken, deleteIncident);

export default router;
