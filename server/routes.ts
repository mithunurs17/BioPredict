import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { biomarkerRecords } from "@shared/schema";
import { predictBlood } from "./controllers/prediction";
import { predictSaliva } from "./controllers/prediction";
import { predictUrine } from "./controllers/prediction";
import { predictCSF } from "./controllers/prediction";
import { handleChatMessage } from "./controllers/chat";

export async function registerRoutes(app: Express): Promise<Server> {
  // Prediction API endpoints
  app.post('/api/predict/blood', predictBlood);
  app.post('/api/predict/saliva', predictSaliva);
  app.post('/api/predict/urine', predictUrine);
  app.post('/api/predict/csf', predictCSF);

  // AI Chatbot endpoint
  app.post('/api/chat', handleChatMessage);

  // Get historical predictions for a user (if authentication is implemented)
  app.get('/api/history', async (req, res) => {
    try {
      // Note: In a real app, you'd get the user ID from the authenticated session
      // For now, we'll return the most recent 10 records
      const records = await db.query.biomarkerRecords.findMany({
        orderBy: (biomarkerRecords, { desc }) => [desc(biomarkerRecords.createdAt)],
        limit: 10
      });
      
      return res.status(200).json(records);
    } catch (error) {
      console.error('Error fetching prediction history:', error);
      return res.status(500).json({ message: 'Failed to fetch prediction history' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
