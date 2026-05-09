import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './middlewares/globalErrorHandler';
import ApiError from './errors/ApiError';

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

// Handle 404 - Route Not Found
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Global Error Handler (must be the LAST middleware)
app.use(globalErrorHandler);

export default app;

