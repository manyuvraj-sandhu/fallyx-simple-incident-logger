import { z } from 'zod';

export const incidentSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),
});
