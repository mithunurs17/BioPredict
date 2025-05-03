/**
 * This file contains the machine learning model logic.
 * In a real application, these would be trained models using scikit-learn, TensorFlow, etc.
 * For this example, we're using simplified prediction logic based on biomarker thresholds.
 */

import { 
  BloodBiomarkerForm, 
  SalivaBiomarkerForm, 
  UrineBiomarkerForm, 
  CSFBiomarkerForm,
  DiseasePrediction 
} from "@/types";

// Blood analysis models
export function diabetesModel(data: BloodBiomarkerForm): number {
  // Calculate risk score based on known biomarkers
  let riskScore = 0;
  
  // Evaluate glucose (fasting)
  if (data.glucose) {
    if (data.glucose < 100) riskScore += 0;
    else if (data.glucose >= 100 && data.glucose < 126) riskScore += 30;
    else if (data.glucose >= 126) riskScore += 60;
  }
  
  // Evaluate HbA1c
  if (data.hba1c) {
    if (data.hba1c < 5.7) riskScore += 0;
    else if (data.hba1c >= 5.7 && data.hba1c < 6.5) riskScore += 30;
    else if (data.hba1c >= 6.5) riskScore += 60;
  }
  
  // Evaluate other factors if present
  if (data.triglycerides && data.triglycerides > 150) riskScore += 10;
  
  // Normalize to 0-100 scale
  return Math.min(Math.max(riskScore, 0), 100);
}

export function cardiovascularModel(data: BloodBiomarkerForm): number {
  // Calculate risk score based on known biomarkers
  let riskScore = 0;
  
  // Evaluate total cholesterol
  if (data.totalCholesterol) {
    if (data.totalCholesterol < 200) riskScore += 0;
    else if (data.totalCholesterol >= 200 && data.totalCholesterol < 240) riskScore += 20;
    else if (data.totalCholesterol >= 240) riskScore += 40;
  }
  
  // Evaluate LDL
  if (data.ldl) {
    if (data.ldl < 100) riskScore += 0;
    else if (data.ldl >= 100 && data.ldl < 130) riskScore += 15;
    else if (data.ldl >= 130 && data.ldl < 160) riskScore += 30;
    else if (data.ldl >= 160) riskScore += 45;
  }
  
  // Evaluate HDL (inverse relationship - higher is better)
  if (data.hdl) {
    if (data.hdl >= 60) riskScore += 0;
    else if (data.hdl >= 40 && data.hdl < 60) riskScore += 15;
    else if (data.hdl < 40) riskScore += 30;
  }
  
  // Evaluate CRP
  if (data.crp) {
    if (data.crp < 1) riskScore += 0;
    else if (data.crp >= 1 && data.crp < 3) riskScore += 15;
    else if (data.crp >= 3) riskScore += 30;
  }
  
  // Evaluate homocysteine
  if (data.homocysteine) {
    if (data.homocysteine <= 15) riskScore += 0;
    else if (data.homocysteine > 15) riskScore += 15;
  }
  
  // Normalize to 0-100 scale
  return Math.min(Math.max(riskScore, 0), 100);
}

// Saliva analysis models
export function oralCancerModel(data: SalivaBiomarkerForm): number {
  // Calculate risk score based on known biomarkers
  let riskScore = 0;
  
  // Evaluate IL-6
  if (data.il6) {
    if (data.il6 < 5) riskScore += 0;
    else if (data.il6 >= 5 && data.il6 < 10) riskScore += 20;
    else if (data.il6 >= 10) riskScore += 40;
  }
  
  // Evaluate TNF-alpha
  if (data.tnfAlpha) {
    if (data.tnfAlpha < 15) riskScore += 0;
    else if (data.tnfAlpha >= 15 && data.tnfAlpha < 30) riskScore += 20;
    else if (data.tnfAlpha >= 30) riskScore += 40;
  }
  
  // Evaluate CYFRA 21-1
  if (data.cyfra21) {
    if (data.cyfra21 < 3.3) riskScore += 0;
    else if (data.cyfra21 >= 3.3 && data.cyfra21 < 5) riskScore += 25;
    else if (data.cyfra21 >= 5) riskScore += 50;
  }
  
  // Evaluate MMP-9
  if (data.mmp9 && data.mmp9 > 600) riskScore += 20;
  
  // Evaluate CD44
  if (data.cd44 && data.cd44 > 200) riskScore += 20;
  
  // Normalize to 0-100 scale
  return Math.min(Math.max(riskScore, 0), 100);
}

// Urine analysis models
export function kidneyDiseaseModel(data: UrineBiomarkerForm): number {
  // Calculate risk score based on known biomarkers
  let riskScore = 0;
  
  // Evaluate albumin
  if (data.albumin) {
    if (data.albumin < 30) riskScore += 0;
    else if (data.albumin >= 30 && data.albumin < 300) riskScore += 30;
    else if (data.albumin >= 300) riskScore += 60;
  }
  
  // Evaluate albumin-to-creatinine ratio (ACR)
  if (data.acr) {
    if (data.acr < 30) riskScore += 0;
    else if (data.acr >= 30 && data.acr < 300) riskScore += 30;
    else if (data.acr >= 300) riskScore += 60;
  }
  
  // Evaluate protein
  if (data.protein) {
    if (data.protein < 150) riskScore += 0;
    else if (data.protein >= 150) riskScore += 30;
  }
  
  // Evaluate NGAL
  if (data.ngal) {
    if (data.ngal < 131.7) riskScore += 0;
    else if (data.ngal >= 131.7 && data.ngal < 200) riskScore += 20;
    else if (data.ngal >= 200) riskScore += 40;
  }
  
  // Evaluate KIM-1
  if (data.kim1 && data.kim1 > 1000) riskScore += 30;
  
  // Normalize to 0-100 scale
  return Math.min(Math.max(riskScore, 0), 100);
}

export function urinaryDiabetesModel(data: UrineBiomarkerForm): number {
  // Calculate risk score based on known biomarkers
  let riskScore = 0;
  
  // Evaluate glucose in urine
  if (data.urineGlucose) {
    if (data.urineGlucose <= 0) riskScore += 0;
    else if (data.urineGlucose > 0 && data.urineGlucose <= 50) riskScore += 30;
    else if (data.urineGlucose > 50) riskScore += 60;
  }
  
  // Evaluate protein (can indicate diabetic nephropathy)
  if (data.protein) {
    if (data.protein < 150) riskScore += 0;
    else if (data.protein >= 150) riskScore += 20;
  }
  
  // Evaluate specific gravity (concentrated urine can indicate diabetes)
  if (data.specificGravity) {
    if (data.specificGravity >= 1.005 && data.specificGravity <= 1.030) riskScore += 0;
    else if (data.specificGravity > 1.030) riskScore += 15;
  }
  
  // Normalize to 0-100 scale
  return Math.min(Math.max(riskScore, 0), 100);
}

// CSF analysis models
export function alzheimersModel(data: CSFBiomarkerForm): number {
  // Calculate risk score based on known biomarkers
  let riskScore = 0;
  
  // Evaluate Amyloid β-42 (lower values indicate risk)
  if (data.abeta42) {
    if (data.abeta42 >= 550) riskScore += 0;
    else if (data.abeta42 >= 450 && data.abeta42 < 550) riskScore += 30;
    else if (data.abeta42 < 450) riskScore += 60;
  }
  
  // Evaluate Total Tau (higher values indicate risk)
  if (data.totalTau) {
    if (data.totalTau <= 375) riskScore += 0;
    else if (data.totalTau > 375 && data.totalTau <= 500) riskScore += 30;
    else if (data.totalTau > 500) riskScore += 60;
  }
  
  // Evaluate Phosphorylated Tau (higher values indicate risk)
  if (data.pTau) {
    if (data.pTau <= 52) riskScore += 0;
    else if (data.pTau > 52 && data.pTau <= 65) riskScore += 30;
    else if (data.pTau > 65) riskScore += 60;
  }
  
  // Evaluate Neurofilament Light Chain
  if (data.nfl && data.nfl > 1000) riskScore += 20;
  
  // Normalize to 0-100 scale
  return Math.min(Math.max(riskScore, 0), 100);
}

export function brainTumorModel(data: CSFBiomarkerForm): number {
  // Calculate risk score based on known biomarkers
  let riskScore = 0;
  
  // Evaluate CSF glucose
  if (data.csfGlucose) {
    if (data.csfGlucose >= 45 && data.csfGlucose <= 80) riskScore += 0;
    else riskScore += 15;
  }
  
  // Evaluate CSF protein
  if (data.csfProtein) {
    if (data.csfProtein >= 15 && data.csfProtein <= 45) riskScore += 0;
    else if (data.csfProtein > 45 && data.csfProtein <= 75) riskScore += 20;
    else if (data.csfProtein > 75) riskScore += 40;
  }
  
  // Evaluate LDH
  if (data.csfLdh) {
    if (data.csfLdh <= 40) riskScore += 0;
    else if (data.csfLdh > 40 && data.csfLdh <= 70) riskScore += 20;
    else if (data.csfLdh > 70) riskScore += 40;
  }
  
  // Evaluate cell count
  if (data.cellCount) {
    if (data.cellCount <= 5) riskScore += 0;
    else if (data.cellCount > 5 && data.cellCount <= 20) riskScore += 25;
    else if (data.cellCount > 20) riskScore += 50;
  }
  
  // Normalize to 0-100 scale
  return Math.min(Math.max(riskScore, 0), 100);
}
