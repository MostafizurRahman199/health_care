import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';

const app: Application = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend url
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Application Routes
app.use('/api/v1', router);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('Health-care API is running (TypeScript + Modular)...');
});

export default app;
