import { Request, Response } from 'express';
import { 
  BloodBiomarkerFormSchema, 
  SalivaBiomarkerFormSchema, 
  UrineBiomarkerFormSchema, 
  CSFBiomarkerFormSchema 
} from '@/types';
import { PythonShell } from 'python-shell';
import path from 'path';
import { prisma } from '../../db';
import { biomarkerRecords } from '@shared/schema';
import {
  predictDiabetesFromBlood,
  predictCardiovascularDisease,
  predictOralCancer,
  predictKidneyDisease,
  predictDiabetesFromUrine,
  predictAlzheimers,
  predictBrainTumor
} from "../services/prediction-service";
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Blood prediction controller
export async function predictBlood(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = BloodBiomarkerFormSchema.parse(req.body);
    
    // Make predictions using ML models
    const diabetesPrediction = await predictDiabetesFromBlood(validatedData);
    const cvdPrediction = await predictCardiovascularDisease(validatedData);
    
    // Create response object with predictions
    const predictions = {
      diabetes: diabetesPrediction,
      cardiovascular: cvdPrediction
    };
    
    // Save prediction to database if user is authenticated
    try {
      if (req.user?.id) {
        console.log('Saving blood prediction for user:', req.user.id); // Debug log
        const record = await prisma.biomarkerRecord.create({
          data: {
            userId: req.user.id,
            fluidType: "blood",
            biomarkers: validatedData,
            predictions
          }
        });
        console.log('Saved record:', record); // Debug log
      } else {
        console.log('No user ID found in request'); // Debug log
      }
    } catch (dbError) {
      console.error("Database save failed:", dbError);
      // Continue without database save, but log the error
    }
    
    return res.status(200).json(predictions);
  } catch (error) {
    console.error("Error in blood prediction:", error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message || "Invalid input data or prediction failed" });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred during blood prediction" });
    }
  }
}

// Saliva prediction controller
export async function predictSaliva(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = SalivaBiomarkerFormSchema.parse(req.body);
    
    // Make predictions using ML models
    const oralCancerPrediction = await predictOralCancer(validatedData);
    
    // Create response object with predictions
    const predictions = {
      oralCancer: oralCancerPrediction
    };
    
    // Save prediction to database if user is authenticated
    try {
      if (req.user?.id) {
        console.log('Saving saliva prediction for user:', req.user.id); // Debug log
        const record = await prisma.biomarkerRecord.create({
          data: {
            userId: req.user.id,
            fluidType: "saliva",
            biomarkers: validatedData,
            predictions
          }
        });
        console.log('Saved record:', record); // Debug log
      } else {
        console.log('No user ID found in request'); // Debug log
      }
    } catch (dbError) {
      console.error("Database save failed:", dbError);
      // Continue without database save, but log the error
    }
    
    return res.status(200).json(predictions);
  } catch (error) {
    console.error("Error in saliva prediction:", error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message || "Invalid input data or prediction failed" });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred during saliva prediction" });
    }
  }
}

// Urine prediction controller
export async function predictUrine(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = UrineBiomarkerFormSchema.parse(req.body);
    
    // Make predictions using ML models
    const kidneyPrediction = await predictKidneyDisease(validatedData);
    const diabetesPrediction = await predictDiabetesFromUrine(validatedData);
    
    // Create response object with predictions
    const predictions = {
      kidney: kidneyPrediction,
      diabetes: diabetesPrediction
    };
    
    // Save prediction to database if user is authenticated
    try {
      if (req.user?.id) {
        console.log('Saving urine prediction for user:', req.user.id); // Debug log
        const record = await prisma.biomarkerRecord.create({
          data: {
            userId: req.user.id,
            fluidType: "urine",
            biomarkers: validatedData,
            predictions
          }
        });
        console.log('Saved record:', record); // Debug log
      } else {
        console.log('No user ID found in request'); // Debug log
      }
    } catch (dbError) {
      console.error("Database save failed:", dbError);
      // Continue without database save, but log the error
    }
    
    return res.status(200).json(predictions);
  } catch (error) {
    console.error("Error in urine prediction:", error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message || "Invalid input data or prediction failed" });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred during urine prediction" });
    }
  }
}

// CSF prediction controller
export async function predictCSF(req: Request, res: Response) {
  try {
    // Validate request body
    const validatedData = CSFBiomarkerFormSchema.parse(req.body);
    
    // Make predictions using ML models
    const alzheimersPrediction = await predictAlzheimers(validatedData);
    const brainTumorPrediction = await predictBrainTumor(validatedData);
    
    // Create response object with predictions
    const predictions = {
      alzheimer: alzheimersPrediction,
      brainTumor: brainTumorPrediction
    };
    
    // Save prediction to database if user is authenticated
    try {
      if (req.user?.id) {
        console.log('Saving CSF prediction for user:', req.user.id); // Debug log
        const record = await prisma.biomarkerRecord.create({
          data: {
            userId: req.user.id,
            fluidType: "csf",
            biomarkers: validatedData,
            predictions
          }
        });
        console.log('Saved record:', record); // Debug log
      } else {
        console.log('No user ID found in request'); // Debug log
      }
    } catch (dbError) {
      console.error("Database save failed:", dbError);
      // Continue without database save, but log the error
    }
    
    return res.status(200).json(predictions);
  } catch (error) {
    console.error("Error in CSF prediction:", error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message || "Invalid input data or prediction failed" });
    } else {
      return res.status(500).json({ message: "An unexpected error occurred during CSF prediction" });
    }
  }
}

export const predictDisease = async (req: Request, res: Response) => {
  try {
    const { biomarkers, fluidType } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Run Python script for prediction
    const pythonScript = path.join(__dirname, '..', 'ml_training', 'predict_diabetes.py');
    const pythonProcess = spawn('python', [pythonScript]);

    let predictionResult = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      predictionResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.stdin.write(JSON.stringify(biomarkers));
    pythonProcess.stdin.end();

    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}: ${errorOutput}`));
        } else {
          resolve(null);
        }
      });
    });

    const predictions = JSON.parse(predictionResult);

    // Save prediction record
    const record = await prisma.biomarkerRecord.create({
      data: {
        userId,
        fluidType,
        biomarkers,
        predictions
      }
    });

    res.json({
      message: 'Prediction completed successfully',
      predictions,
      recordId: record.id
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ 
      message: 'Failed to process prediction',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPredictionHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      console.error('No user ID found in request');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Fetching records for user:', userId); // Debug log

    const records = await prisma.biomarkerRecord.findMany({
      where: { 
        userId: userId.toString() // Convert to string since we're using UUID
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        fluidType: true,
        biomarkers: true,
        predictions: true,
        createdAt: true
      }
    });

    console.log('Found records:', records); // Debug log

    if (!records || records.length === 0) {
      return res.json({ records: [] });
    }

    // Transform the records to ensure consistent data structure
    const transformedRecords = records.map(record => ({
      ...record,
      id: record.id.toString(),
      userId: record.userId.toString(),
      createdAt: record.createdAt.toISOString()
    }));

    res.json({ records: transformedRecords });
  } catch (error) {
    console.error('Get prediction history error:', error);
    res.status(500).json({ 
      message: 'Failed to get prediction history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
