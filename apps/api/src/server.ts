import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/error.js';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import userRoutes from './routes/users.js';
import uploadRoutes from './routes/upload.js';
import reportRoutes from './routes/reports.js';
import categoryRoutes from './routes/categories.js';

export function createServer() {
  const app = express();

  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());
  app.use(morgan('tiny'));

  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  }));

  app.get('/health', (_, res) => res.json({ ok: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/listings', listingRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/categories', categoryRoutes);

  app.use(errorHandler);

  return app;
}
