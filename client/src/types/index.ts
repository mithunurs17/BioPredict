import { z } from "zod";

// Fluid Types
export type FluidType = "blood" | "saliva" | "urine" | "csf";

// Factor Types for Risk Assessment
export type FactorType = "positive" | "negative" | "warning";

// Blood Biomarker Form Schema
export const BloodBiomarkerFormSchema = z.object({
  BMI: z.number().min(10).max(50),
  Chol: z.number().min(1).max(10),
  TG: z.number().min(0.1).max(5),
  HDL: z.number().min(0.1).max(5),
  LDL: z.number().min(0.1).max(5),
  Cr: z.number().min(10).max(200),
  BUN: z.number().min(1).max(20)
});

export type BloodBiomarkerForm = z.infer<typeof BloodBiomarkerFormSchema>;

// Saliva Biomarker Form Schema
export const SalivaBiomarkerFormSchema = z.object({
  il6: z.number().optional(),
  tnfAlpha: z.number().optional(),
  mmp9: z.number().optional(),
  salivaCortisol: z.number().optional(),
  cyfra21: z.number().optional(),
  cd44: z.number().optional()
});

export type SalivaBiomarkerForm = z.infer<typeof SalivaBiomarkerFormSchema>;

// Urine Biomarker Form Schema
export const UrineBiomarkerFormSchema = z.object({
  urineGlucose: z.number().optional(),
  albumin: z.number().optional(),
  creatinine: z.number().optional(),
  acr: z.number().optional(),
  protein: z.number().optional(),
  specificGravity: z.number().optional(),
  ngal: z.number().optional(),
  kim1: z.number().optional()
});

export type UrineBiomarkerForm = z.infer<typeof UrineBiomarkerFormSchema>;

// CSF Biomarker Form Schema
export const CSFBiomarkerFormSchema = z.object({
  abeta42: z.number().optional(),
  totalTau: z.number().optional(),
  pTau: z.number().optional(),
  nfl: z.number().optional(),
  csfGlucose: z.number().optional(),
  csfProtein: z.number().optional(),
  csfLdh: z.number().optional(),
  cellCount: z.number().optional()
});

export type CSFBiomarkerForm = z.infer<typeof CSFBiomarkerFormSchema>;

// Prediction Response Types
export interface PredictionFactor {
  type: FactorType;
  text: string;
}

export interface DiseasePrediction {
  riskLevel: string;
  riskValue: number;
  factors: PredictionFactor[];
  recommendation: string;
}

export interface BloodPredictionResponse {
  riskLevel: 'Low' | 'Moderate' | 'High';
  riskValue: number;
  factors: string[];
  recommendation: string;
  potentialDiseases: string[];
  biomarkerIssues: string[];
}

export interface SalivaPredictionResponse {
  oralCancer?: DiseasePrediction;
}

export interface UrinePredictionResponse {
  kidney?: DiseasePrediction;
  diabetes?: DiseasePrediction;
}

export interface CSFPredictionResponse {
  alzheimer?: DiseasePrediction;
  brainTumor?: DiseasePrediction;
}
