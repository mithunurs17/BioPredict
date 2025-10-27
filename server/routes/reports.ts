import express, { type Request, type Response } from 'express';
import OpenAI from 'openai';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

let openai: OpenAI | null = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
  });
}

router.post('/upload', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { fileName, fileType, fileSize, reportType, fileContent } = req.body;

    if (!fileName || !fileType || !reportType || !fileContent) {
      return res.status(400).json({ 
        message: 'Missing required fields: fileName, fileType, reportType, and fileContent are required' 
      });
    }

    if (!openai) {
      return res.status(503).json({ 
        message: 'AI service is not configured. Report uploaded but cannot be processed.' 
      });
    }

    const aiSummary = await processReportWithAI(fileContent, reportType, fileType);
    const userId = (req as any).user.id;

    const reportId = await saveReportToDatabase(userId, fileName, fileType, fileSize, reportType, aiSummary);

    res.json({ 
      message: 'Report uploaded and processed successfully',
      summary: aiSummary,
      reportId: reportId
    });
  } catch (error: any) {
    console.error('Error uploading report:', error);
    res.status(500).json({ message: 'Error processing report upload', error: error.message });
  }
});

async function saveReportToDatabase(
  userId: string,
  fileName: string,
  fileType: string,
  fileSize: number,
  reportType: string,
  aiSummary: any
): Promise<number> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    const result = await prisma.$queryRaw`
      INSERT INTO "MedicalReport" ("userId", "fileName", "fileType", "fileSize", "reportType", "uploadedAt", "aiSummary", "status")
      VALUES (${userId}, ${fileName}, ${fileType}, ${fileSize}, ${reportType}, NOW(), ${JSON.stringify(aiSummary)}::jsonb, 'completed')
      RETURNING id
    ` as Array<{ id: number }>;
    
    return result[0].id;
  } finally {
    await prisma.$disconnect();
  }
}

async function processReportWithAI(fileContent: string, reportType: string, fileType: string): Promise<any> {
  if (!openai) {
    throw new Error('OpenAI not configured');
  }

  const prompt = `You are a medical AI assistant analyzing a ${reportType} lab report in ${fileType} format. 
Extract and summarize the key biomarkers and health indicators from this report.

Report content or description: ${fileContent}

Please provide a detailed JSON response with the following structure:
{
  "summary": "A brief 2-3 sentence overview of the report findings",
  "extractedBiomarkers": [
    {
      "name": "Biomarker name",
      "value": "measured value",
      "unit": "unit of measurement",
      "status": "normal/high/low",
      "normalRange": "normal range for this biomarker"
    }
  ],
  "keyFindings": [
    "Finding 1",
    "Finding 2"
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "riskFactors": [
    "Risk factor 1 if any"
  ]
}

Be thorough and extract as much relevant medical data as possible.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a medical AI assistant that analyzes lab reports and extracts biomarker data. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content || '{}';
    const parsedResponse = JSON.parse(response);
    
    return parsedResponse;
  } catch (error: any) {
    console.error('Error processing report with AI:', error);
    return {
      summary: "Unable to process report automatically",
      extractedBiomarkers: [],
      keyFindings: ["Manual review required"],
      recommendations: ["Please review the report manually"],
      riskFactors: []
    };
  }
}

export default router;
