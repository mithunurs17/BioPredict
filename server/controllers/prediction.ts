import { Request, Response } from "express";
import { 
  BloodBiomarkerFormSchema, 
  SalivaBiomarkerFormSchema, 
  UrineBiomarkerFormSchema, 
  CSFBiomarkerFormSchema 
} from "@/types";
import { db } from "@db";
import { biomarkerRecords } from "@shared/schema";
import {
  predictDiabetesFromBlood,
  predictCardiovascularDisease,
  predictOralCancer,
  predictKidneyDisease,
  predictDiabetesFromUrine,
  predictAlzheimers,
  predictBrainTumor
} from "../services/prediction-service";

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
    
    // Save prediction to database (optional - if user is authenticated)
    if (req.session?.userId) {
      await db.insert(biomarkerRecords).values({
        userId: req.session.userId,
        fluidType: "blood",
        biomarkers: validatedData,
        predictions
      });
    }
    
    return res.status(200).json(predictions);
  } catch (error) {
    console.error("Error in blood prediction:", error);
    return res.status(400).json({ message: "Invalid input data or prediction failed" });
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
    
    // Save prediction to database (optional - if user is authenticated)
    if (req.session?.userId) {
      await db.insert(biomarkerRecords).values({
        userId: req.session.userId,
        fluidType: "saliva",
        biomarkers: validatedData,
        predictions
      });
    }
    
    return res.status(200).json(predictions);
  } catch (error) {
    console.error("Error in saliva prediction:", error);
    return res.status(400).json({ message: "Invalid input data or prediction failed" });
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
    
    // Save prediction to database (optional - if user is authenticated)
    if (req.session?.userId) {
      await db.insert(biomarkerRecords).values({
        userId: req.session.userId,
        fluidType: "urine",
        biomarkers: validatedData,
        predictions
      });
    }
    
    return res.status(200).json(predictions);
  } catch (error) {
    console.error("Error in urine prediction:", error);
    return res.status(400).json({ message: "Invalid input data or prediction failed" });
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
    
    // Save prediction to database (optional - if user is authenticated)
    if (req.session?.userId) {
      await db.insert(biomarkerRecords).values({
        userId: req.session.userId,
        fluidType: "csf",
        biomarkers: validatedData,
        predictions
      });
    }
    
    return res.status(200).json(predictions);
  } catch (error) {
    console.error("Error in CSF prediction:", error);
    return res.status(400).json({ message: "Invalid input data or prediction failed" });
  }
}
