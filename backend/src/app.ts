import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './models';
import incidentRoutes from './routes/incidentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use('/', incidentRoutes);

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database sync failed:', err);
  });
