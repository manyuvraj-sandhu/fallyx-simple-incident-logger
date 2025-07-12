import express from 'express';
import incidentRoutes from './routes/incidentRoutes';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
app.use(incidentRoutes); // test against all routes

export default app;
