import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database';
import incidentRoutes from './routes/incidentRoutes';

dotenv.config();

const app = express();

app.use(
  cors({ origin: 'http://localhost:3000', credentials: true })
);
app.use(express.json());
app.use('/', incidentRoutes);

// Ensure test DB is reset
if (process.env.NODE_ENV === 'test') {
  sequelize.sync({ force: true }).catch((err) => {
    console.error('Test DB sync failed:', err);
  });
}

export default app;
