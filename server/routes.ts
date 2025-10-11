import type { Express } from "express";
import { createServer, type Server } from "http";
import { prisma } from "../db";
import { handleChatMessage } from "./controllers/chat";
import { register, login, getCurrentUser } from "./controllers/auth";
import { authenticateToken } from "./middleware/auth";
import { Router } from 'express';
import authRoutes from './routes/auth';
import predictionRoutes from './routes/prediction';
import aiRoutes from './routes/ai';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/predictions', authenticateToken, predictionRoutes);

// AI Chatbot routes
router.use('/ai', aiRoutes);

export async function registerRoutes(app: Express): Promise<Server> {
  // Mount all routes under /api
  app.use('/api', router);

  // Add a 404 handler specifically for /api routes that weren't matched
  app.use('/api/*', (req, res) => {
    console.warn(`404 API Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: `API endpoint not found: ${req.originalUrl}` });
  });

  const httpServer = createServer(app);
  return httpServer;
}
