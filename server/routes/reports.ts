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
    
    await saveBiomarkerRecord(userId, reportType, aiSummary);

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

async function saveBiomarkerRecord(
  userId: string,
  reportType: string,
  aiSummary: any
): Promise<void> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    const biomarkers: any = {};
    if (aiSummary.extractedBiomarkers && Array.isArray(aiSummary.extractedBiomarkers)) {
      aiSummary.extractedBiomarkers.forEach((biomarker: any) => {
        if (biomarker.name && biomarker.value !== undefined && biomarker.value !== null) {
          biomarkers[biomarker.name] = {
            value: biomarker.value,
            unit: biomarker.unit || '',
            status: biomarker.status || 'unknown',
            normalRange: biomarker.normalRange || ''
          };
        }
      });
    }
    
    const predictions = {
      aiAnalysis: {
        summary: aiSummary.summary || '',
        overallRiskLevel: aiSummary.overallRiskLevel || 'unknown',
        detailedDescription: aiSummary.detailedDescription || '',
        riskAnalysis: aiSummary.riskAnalysis || {},
        keyFindings: aiSummary.keyFindings || [],
        recommendations: aiSummary.recommendations || [],
        lifestyleFactors: aiSummary.lifestyleFactors || [],
        followUpTests: aiSummary.followUpTests || []
      }
    };
    
    await prisma.biomarkerRecord.create({
      data: {
        userId: userId,
        fluidType: reportType,
        biomarkers: biomarkers,
        predictions: predictions
      }
    });
    
    console.log('Biomarker record saved from report upload');
  } catch (error) {
    console.error('Error saving biomarker record:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function processReportWithAI(fileContent: string, reportType: string, fileType: string): Promise<any> {
  if (!openai) {
    throw new Error('OpenAI not configured');
  }

  const prompt = `You are an expert medical AI assistant analyzing a ${reportType} biomarker lab report. 
Provide a comprehensive analysis including detailed risk assessment and health implications.

Report content: ${fileContent}

Please provide a detailed JSON response with the following structure:
{
  "summary": "A comprehensive 3-5 sentence summary of the overall health status based on the report findings, highlighting the most critical aspects",
  "extractedBiomarkers": [
    {
      "name": "Biomarker name",
      "value": "measured value",
      "unit": "unit of measurement",
      "status": "normal/borderline/high/low/critical",
      "normalRange": "normal reference range",
      "significance": "Brief explanation of what this biomarker indicates"
    }
  ],
  "overallRiskLevel": "low/moderate/high/critical",
  "detailedDescription": "A thorough 4-6 sentence analysis explaining what the biomarker results mean for the patient's health, including physiological implications and potential health impacts",
  "riskAnalysis": {
    "primaryConcerns": [
      "Specific health concern 1 with severity level",
      "Specific health concern 2 with severity level"
    ],
    "diseaseRisks": [
      {
        "disease": "Disease name",
        "riskLevel": "low/moderate/high/critical",
        "indicators": "Which biomarkers suggest this risk",
        "explanation": "Detailed explanation of why these biomarkers indicate this disease risk"
      }
    ],
    "immediateActions": [
      "Urgent action 1 if any critical values found",
      "Urgent action 2"
    ]
  },
  "keyFindings": [
    "Detailed finding 1 with clinical significance",
    "Detailed finding 2 with clinical significance",
    "Detailed finding 3 with clinical significance"
  ],
  "recommendations": [
    {
      "category": "lifestyle/medication/monitoring/consultation",
      "action": "Specific recommendation",
      "priority": "high/medium/low",
      "rationale": "Why this is recommended based on the biomarkers"
    }
  ],
  "lifestyleFactors": [
    "Lifestyle factor to address based on results (diet, exercise, sleep, stress, etc.)"
  ],
  "followUpTests": [
    "Suggested follow-up test 1 based on abnormal findings",
    "Suggested follow-up test 2"
  ]
}

Be extremely thorough and provide clinically relevant insights. Extract all biomarker values and provide detailed health risk analysis.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert medical AI assistant specializing in clinical laboratory analysis and disease risk assessment. Analyze lab reports thoroughly and provide detailed, actionable health insights with comprehensive risk analysis. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content || '{}';
    const parsedResponse = JSON.parse(response);
    
    return parsedResponse;
  } catch (error: any) {
    console.error('Error processing report with AI:', error);
    return {
      summary: "Unable to process report automatically. Please consult with your healthcare provider.",
      extractedBiomarkers: [],
      overallRiskLevel: "unknown",
      detailedDescription: "The AI system encountered an error while processing your report. This does not indicate a problem with your results.",
      riskAnalysis: {
        primaryConcerns: ["Manual review required by healthcare professional"],
        diseaseRisks: [],
        immediateActions: ["Please consult with your healthcare provider for proper interpretation"]
      },
      keyFindings: ["Automatic analysis unavailable - manual review needed"],
      recommendations: [],
      lifestyleFactors: [],
      followUpTests: []
    };
  }
}

export default router;
