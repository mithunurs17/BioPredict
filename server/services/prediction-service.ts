/**
 * This service handles the business logic for making predictions
 * based on biomarker data from different body fluids.
 * It uses the ML models to calculate risk scores and generates appropriate
 * responses with risk levels, factors, and recommendations.
 */

import { 
  BloodBiomarkerForm, 
  SalivaBiomarkerForm, 
  UrineBiomarkerForm, 
  CSFBiomarkerForm,
  DiseasePrediction,
  PredictionFactor
} from "@/types";

import {
  diabetesModel,
  cardiovascularModel,
  oralCancerModel,
  kidneyDiseaseModel,
  urinaryDiabetesModel,
  alzheimersModel,
  brainTumorModel
} from "./ml-models";

// Helper function to determine risk level based on score
function getRiskLevel(score: number): string {
  if (score < 15) return "Minimal";
  if (score < 35) return "Low";
  if (score < 55) return "Moderate";
  if (score < 75) return "High";
  return "Very High";
}

// Helper function to get potential diseases based on risk level and type
function getPotentialDiseases(riskLevel: string, type: string): string[] {
  if (riskLevel === "Minimal" || riskLevel === "Very Low") {
    return [];
  }

  switch (type) {
    case "diabetes":
      return riskLevel === "High" || riskLevel === "Very High" 
        ? ["Type 2 Diabetes", "Metabolic Syndrome"]
        : ["Pre-diabetes"];
    case "cardiovascular":
      return riskLevel === "High" || riskLevel === "Very High"
        ? ["Coronary Artery Disease", "Hypertension", "Atherosclerosis"]
        : ["Early Cardiovascular Risk"];
    case "oralCancer":
      return riskLevel === "High" || riskLevel === "Very High"
        ? ["Oral Squamous Cell Carcinoma", "Oral Leukoplakia"]
        : ["Oral Precancerous Lesions"];
    case "kidney":
      return riskLevel === "High" || riskLevel === "Very High"
        ? ["Chronic Kidney Disease", "Kidney Failure"]
        : ["Early Kidney Dysfunction"];
    case "alzheimer":
      return riskLevel === "High" || riskLevel === "Very High"
        ? ["Alzheimer's Disease", "Dementia"]
        : ["Mild Cognitive Impairment"];
    case "brainTumor":
      return riskLevel === "High" || riskLevel === "Very High"
        ? ["Brain Tumor", "Intracranial Mass"]
        : ["Neurological Abnormalities"];
    default:
      return [];
  }
}

// Blood-based predictions
export async function predictDiabetesFromBlood(data: BloodBiomarkerForm): Promise<DiseasePrediction> {
  // Calculate risk score based on biomarkers
  let riskScore = 0;
  const factors: PredictionFactor[] = [];
  
  // BMI risk (0-25 points)
  if (data.BMI > 30) {
    riskScore += 25;
    factors.push({ type: "negative", text: `Severe obesity (BMI: ${data.BMI})` });
  } else if (data.BMI > 25) {
    riskScore += 20;
    factors.push({ type: "warning", text: `Overweight (BMI: ${data.BMI})` });
  } else if (data.BMI < 18.5) {
    riskScore += 15;
    factors.push({ type: "warning", text: `Underweight (BMI: ${data.BMI})` });
  } else {
    factors.push({ type: "positive", text: `Healthy BMI (${data.BMI})` });
  }
  
  // Cholesterol risk (0-20 points)
  if (data.Chol > 5.2) {
    riskScore += 20;
    factors.push({ type: "negative", text: `Very high cholesterol (${data.Chol} mmol/L)` });
  } else if (data.Chol > 4.0) {
    riskScore += 15;
    factors.push({ type: "warning", text: `High cholesterol (${data.Chol} mmol/L)` });
  } else {
    factors.push({ type: "positive", text: `Healthy cholesterol (${data.Chol} mmol/L)` });
  }
  
  // Triglycerides risk (0-20 points)
  if (data.TG > 2.0) {
    riskScore += 20;
    factors.push({ type: "negative", text: `Very high triglycerides (${data.TG} mmol/L)` });
  } else if (data.TG > 1.3) {
    riskScore += 15;
    factors.push({ type: "warning", text: `High triglycerides (${data.TG} mmol/L)` });
  } else {
    factors.push({ type: "positive", text: `Healthy triglycerides (${data.TG} mmol/L)` });
  }
  
  // HDL risk (0-20 points)
  if (data.HDL < 1.0) {
    riskScore += 20;
    factors.push({ type: "negative", text: `Very low HDL (${data.HDL} mmol/L)` });
  } else if (data.HDL < 1.3) {
    riskScore += 15;
    factors.push({ type: "warning", text: `Low HDL (${data.HDL} mmol/L)` });
  } else {
    factors.push({ type: "positive", text: `Healthy HDL (${data.HDL} mmol/L)` });
  }
  
  // LDL risk (0-20 points)
  if (data.LDL > 3.4) {
    riskScore += 20;
    factors.push({ type: "negative", text: `Very high LDL (${data.LDL} mmol/L)` });
  } else if (data.LDL > 2.0) {
    riskScore += 15;
    factors.push({ type: "warning", text: `High LDL (${data.LDL} mmol/L)` });
  } else {
    factors.push({ type: "positive", text: `Healthy LDL (${data.LDL} mmol/L)` });
  }
  
  // Kidney function risk (0-25 points)
  if (data.Cr > 106 || data.BUN > 7.1) {
    riskScore += 25;
    factors.push({ type: "negative", text: `Severe kidney impairment (Creatinine: ${data.Cr} μmol/L, BUN: ${data.BUN} mmol/L)` });
  } else if (data.Cr > 90 || data.BUN > 6.5) {
    riskScore += 20;
    factors.push({ type: "warning", text: `Moderate kidney impairment (Creatinine: ${data.Cr} μmol/L, BUN: ${data.BUN} mmol/L)` });
  } else {
    factors.push({ type: "positive", text: `Healthy kidney function (Creatinine: ${data.Cr} μmol/L, BUN: ${data.BUN} mmol/L)` });
  }
  
  // Add additional risk points for multiple unhealthy parameters
  const unhealthyCount = factors.filter(f => f.type === "negative" || f.type === "warning").length;
  if (unhealthyCount >= 3) {
    riskScore += 20;  // Additional risk for multiple unhealthy parameters
  }
  
  // Ensure risk score is between 0 and 100
  riskScore = Math.min(Math.max(riskScore, 0), 100);
  
  // Determine risk level
  const riskLevel = getRiskLevel(riskScore);
  
  // Generate recommendation based on risk level
  let recommendation = "";
  if (riskLevel === "Minimal") {
    recommendation = "Continue maintaining your healthy lifestyle with regular check-ups.";
  } else if (riskLevel === "Low") {
    recommendation = "Maintain current lifestyle and schedule regular health check-ups.";
  } else if (riskLevel === "Moderate") {
    recommendation = "Consider lifestyle modifications and consult healthcare provider for preventive measures.";
  } else if (riskLevel === "High") {
    recommendation = "Schedule an immediate consultation with your healthcare provider for comprehensive evaluation.";
  } else {
    recommendation = "Urgent medical attention required. Please consult your healthcare provider immediately.";
  }
  
  // Determine potential diseases
  const potentialDiseases = [];
  if (data.BMI >= 30) potentialDiseases.push("Obesity");
  if (data.Chol > 5.2 || data.LDL > 3.4) potentialDiseases.push("Hypercholesterolemia");
  if (data.TG > 1.7) potentialDiseases.push("Hypertriglyceridemia");
  if (data.Cr > 106 || data.BUN > 7.1) potentialDiseases.push("Kidney Function Impairment");
  
  return {
    riskLevel,
    riskValue: riskScore,
    factors,
    recommendation,
    potentialDiseases
  };
}

export async function predictCardiovascularDisease(data: BloodBiomarkerForm): Promise<DiseasePrediction> {
  // Calculate risk score based on cardiovascular biomarkers
  let riskScore = 0;
  const factors: PredictionFactor[] = [];
  
  // Cholesterol risk (0-25 points)
  if (data.Chol > 5.2) {
    riskScore += 25;
    factors.push({ type: "negative", text: `Very high total cholesterol (${data.Chol} mmol/L)` });
  } else if (data.Chol > 4.0) {
    riskScore += 20;
    factors.push({ type: "warning", text: `High total cholesterol (${data.Chol} mmol/L)` });
  } else {
    factors.push({ type: "positive", text: `Healthy total cholesterol (${data.Chol} mmol/L)` });
  }
  
  // LDL risk (0-25 points)
  if (data.LDL > 3.4) {
    riskScore += 25;
    factors.push({ type: "negative", text: `Very high LDL (${data.LDL} mmol/L)` });
  } else if (data.LDL > 2.0) {
    riskScore += 20;
    factors.push({ type: "warning", text: `High LDL (${data.LDL} mmol/L)` });
  } else {
    factors.push({ type: "positive", text: `Healthy LDL (${data.LDL} mmol/L)` });
  }
  
  // HDL risk (0-25 points)
  if (data.HDL < 1.0) {
    riskScore += 25;
    factors.push({ type: "negative", text: `Very low HDL (${data.HDL} mmol/L)` });
  } else if (data.HDL < 1.3) {
    riskScore += 20;
    factors.push({ type: "warning", text: `Low HDL (${data.HDL} mmol/L)` });
  } else {
    factors.push({ type: "positive", text: `Healthy HDL (${data.HDL} mmol/L)` });
  }
  
  // Triglycerides risk (0-25 points)
  if (data.TG > 2.0) {
    riskScore += 25;
    factors.push({ type: "negative", text: `Very high triglycerides (${data.TG} mmol/L)` });
  } else if (data.TG > 1.3) {
    riskScore += 20;
    factors.push({ type: "warning", text: `High triglycerides (${data.TG} mmol/L)` });
  } else {
    factors.push({ type: "positive", text: `Healthy triglycerides (${data.TG} mmol/L)` });
  }
  
  // Add additional risk points for multiple unhealthy parameters
  const unhealthyCount = factors.filter(f => f.type === "negative" || f.type === "warning").length;
  if (unhealthyCount >= 3) {
    riskScore += 20;  // Additional risk for multiple unhealthy parameters
  }
  
  // Ensure risk score is between 0 and 100
  riskScore = Math.min(Math.max(riskScore, 0), 100);
  
  // Determine risk level
  const riskLevel = getRiskLevel(riskScore);
  
  // Generate recommendation based on risk level
  let recommendation = "";
  if (riskLevel === "Minimal") {
    recommendation = "Continue maintaining your healthy lifestyle with regular check-ups.";
  } else if (riskLevel === "Low") {
    recommendation = "Maintain current lifestyle and schedule regular health check-ups.";
  } else if (riskLevel === "Moderate") {
    recommendation = "Consider lifestyle modifications and consult healthcare provider for preventive measures.";
  } else if (riskLevel === "High") {
    recommendation = "Schedule an immediate consultation with your healthcare provider for comprehensive evaluation.";
  } else {
    recommendation = "Urgent medical attention required. Please consult your healthcare provider immediately.";
  }
  
  // Determine potential diseases
  const potentialDiseases = [];
  if (data.Chol > 5.2 || data.LDL > 3.4) potentialDiseases.push("Hypercholesterolemia");
  if (data.TG > 1.7) potentialDiseases.push("Hypertriglyceridemia");
  if (data.HDL < 1.0) potentialDiseases.push("Low HDL Syndrome");
  
  return {
    riskLevel,
    riskValue: riskScore,
    factors,
    recommendation,
    potentialDiseases
  };
}

// Saliva-based predictions
export async function predictOralCancer(data: SalivaBiomarkerForm): Promise<DiseasePrediction> {
  const riskValue = oralCancerModel(data);
  const riskLevel = getRiskLevel(riskValue);
  
  // Determine key factors
  const factors: PredictionFactor[] = [];
  
  if (data.il6) {
    if (data.il6 >= 10) {
      factors.push({ type: "negative", text: `Significantly elevated IL-6 levels (${data.il6} pg/mL)` });
    } else if (data.il6 >= 5 && data.il6 < 10) {
      factors.push({ type: "warning", text: `Moderately elevated IL-6 levels (${data.il6} pg/mL)` });
    } else {
      factors.push({ type: "positive", text: `Normal IL-6 levels (${data.il6} pg/mL)` });
    }
  }
  
  if (data.tnfAlpha) {
    if (data.tnfAlpha >= 30) {
      factors.push({ type: "negative", text: `High TNF-α levels (${data.tnfAlpha} pg/mL)` });
    } else if (data.tnfAlpha >= 15 && data.tnfAlpha < 30) {
      factors.push({ type: "warning", text: `Elevated TNF-α levels (${data.tnfAlpha} pg/mL)` });
    } else {
      factors.push({ type: "positive", text: `Normal TNF-α levels (${data.tnfAlpha} pg/mL)` });
    }
  }
  
  if (data.cyfra21) {
    if (data.cyfra21 >= 5) {
      factors.push({ type: "negative", text: `High CYFRA 21-1 levels (${data.cyfra21} ng/mL)` });
    } else if (data.cyfra21 >= 3.3 && data.cyfra21 < 5) {
      factors.push({ type: "warning", text: `Elevated CYFRA 21-1 levels (${data.cyfra21} ng/mL)` });
    } else {
      factors.push({ type: "positive", text: `CYFRA 21-1 within normal range (${data.cyfra21} ng/mL)` });
    }
  }
  
  // Generate recommendation based on risk level
  let recommendation = "";
  
  if (riskValue < 25) {
    recommendation = "Continue regular dental check-ups. Maintain good oral hygiene practices. No additional screening needed at this time.";
  } else if (riskValue < 60) {
    recommendation = "Schedule a comprehensive oral examination with a dentist or oral surgeon. Consider more frequent dental check-ups and enhanced oral hygiene practices.";
  } else {
    recommendation = "Urgent referral to an oral oncologist is recommended. Further diagnostic testing including tissue biopsy may be required.";
  }
  
  return {
    riskLevel,
    riskValue,
    factors,
    recommendation,
    potentialDiseases: getPotentialDiseases(riskLevel, "oralCancer")
  };
}

// Urine-based predictions
export async function predictKidneyDisease(data: UrineBiomarkerForm): Promise<DiseasePrediction> {
  const riskValue = kidneyDiseaseModel(data);
  const riskLevel = getRiskLevel(riskValue);
  
  // Determine key factors
  const factors: PredictionFactor[] = [];
  
  if (data.albumin) {
    if (data.albumin >= 300) {
      factors.push({ type: "negative", text: `High albumin levels (${data.albumin} mg/L)` });
    } else if (data.albumin >= 30 && data.albumin < 300) {
      factors.push({ type: "warning", text: `Elevated albumin levels (${data.albumin} mg/L)` });
    } else {
      factors.push({ type: "positive", text: `Normal albumin levels (${data.albumin} mg/L)` });
    }
  }
  
  if (data.acr) {
    if (data.acr >= 300) {
      factors.push({ type: "negative", text: `Severely elevated ACR (${data.acr} mg/g)` });
    } else if (data.acr >= 30 && data.acr < 300) {
      factors.push({ type: "warning", text: `Moderately elevated ACR (${data.acr} mg/g)` });
    } else {
      factors.push({ type: "positive", text: `Normal ACR ratio (${data.acr} mg/g)` });
    }
  }
  
  if (data.ngal) {
    if (data.ngal >= 200) {
      factors.push({ type: "negative", text: `High NGAL levels (${data.ngal} ng/mL)` });
    } else if (data.ngal >= 131.7 && data.ngal < 200) {
      factors.push({ type: "warning", text: `Slightly elevated NGAL (${data.ngal} ng/mL)` });
    } else {
      factors.push({ type: "positive", text: `Normal NGAL levels (${data.ngal} ng/mL)` });
    }
  }
  
  // Generate recommendation based on risk level
  let recommendation = "";
  
  if (riskValue < 25) {
    recommendation = "Continue regular check-ups with your healthcare provider. Maintain proper hydration and a balanced diet low in sodium.";
  } else if (riskValue < 60) {
    recommendation = "Schedule a follow-up with a nephrologist within 3 months. Monitor blood pressure closely and consider dietary modifications.";
  } else {
    recommendation = "Urgent consultation with a nephrologist is recommended. Further diagnostic testing and possible intervention may be necessary.";
  }
  
  return {
    riskLevel,
    riskValue,
    factors,
    recommendation,
    potentialDiseases: getPotentialDiseases(riskLevel, "kidney")
  };
}

export async function predictDiabetesFromUrine(data: UrineBiomarkerForm): Promise<DiseasePrediction> {
  const riskValue = urinaryDiabetesModel(data);
  const riskLevel = getRiskLevel(riskValue);
  
  // Determine key factors
  const factors: PredictionFactor[] = [];
  
  if (data.urineGlucose !== undefined) {
    if (data.urineGlucose > 50) {
      factors.push({ type: "negative", text: `Significant glucose in urine (${data.urineGlucose} mg/dL)` });
    } else if (data.urineGlucose > 0 && data.urineGlucose <= 50) {
      factors.push({ type: "warning", text: `Trace glucose in urine (${data.urineGlucose} mg/dL)` });
    } else {
      factors.push({ type: "positive", text: `Negative urine glucose` });
    }
  }
  
  if (data.protein) {
    if (data.protein >= 150) {
      factors.push({ type: "warning", text: `Elevated protein levels (${data.protein} mg/dL)` });
    } else {
      factors.push({ type: "positive", text: `Normal protein levels (${data.protein} mg/dL)` });
    }
  }
  
  if (data.specificGravity) {
    if (data.specificGravity > 1.030) {
      factors.push({ type: "warning", text: `Concentrated urine (SG: ${data.specificGravity})` });
    } else if (data.specificGravity >= 1.005 && data.specificGravity <= 1.030) {
      factors.push({ type: "positive", text: `Specific gravity within normal range (${data.specificGravity})` });
    } else {
      factors.push({ type: "warning", text: `Dilute urine (SG: ${data.specificGravity})` });
    }
  }
  
  // Generate recommendation based on risk level
  let recommendation = "";
  
  if (riskValue < 25) {
    recommendation = "Maintain a healthy lifestyle with regular exercise and a balanced diet. Routine screening with your primary care physician is recommended.";
  } else if (riskValue < 60) {
    recommendation = "Follow up with your healthcare provider for blood glucose testing. Consider lifestyle modifications to improve glucose control.";
  } else {
    recommendation = "Urgent blood glucose testing is recommended. Consult with an endocrinologist for comprehensive diabetes evaluation and management.";
  }
  
  return {
    riskLevel,
    riskValue,
    factors,
    recommendation,
    potentialDiseases: getPotentialDiseases(riskLevel, "diabetes")
  };
}

// CSF-based predictions
export async function predictAlzheimers(data: CSFBiomarkerForm): Promise<DiseasePrediction> {
  const riskValue = alzheimersModel(data);
  const riskLevel = getRiskLevel(riskValue);
  
  // Determine key factors
  const factors: PredictionFactor[] = [];
  
  if (data.abeta42) {
    if (data.abeta42 < 450) {
      factors.push({ type: "negative", text: `Low Amyloid β-42 (${data.abeta42} pg/mL)` });
    } else if (data.abeta42 >= 450 && data.abeta42 < 550) {
      factors.push({ type: "warning", text: `Borderline Amyloid β-42 (${data.abeta42} pg/mL)` });
    } else {
      factors.push({ type: "positive", text: `Normal Amyloid β-42 levels (${data.abeta42} pg/mL)` });
    }
  }
  
  if (data.totalTau) {
    if (data.totalTau > 500) {
      factors.push({ type: "negative", text: `Elevated total Tau (${data.totalTau} pg/mL)` });
    } else if (data.totalTau > 375 && data.totalTau <= 500) {
      factors.push({ type: "warning", text: `Slightly elevated total Tau (${data.totalTau} pg/mL)` });
    } else {
      factors.push({ type: "positive", text: `Normal total Tau levels (${data.totalTau} pg/mL)` });
    }
  }
  
  if (data.pTau) {
    if (data.pTau > 65) {
      factors.push({ type: "negative", text: `Elevated phosphorylated Tau (${data.pTau} pg/mL)` });
    } else if (data.pTau > 52 && data.pTau <= 65) {
      factors.push({ type: "warning", text: `Slightly elevated phosphorylated Tau (${data.pTau} pg/mL)` });
    } else {
      factors.push({ type: "positive", text: `Normal phosphorylated Tau levels (${data.pTau} pg/mL)` });
    }
  }
  
  // Generate recommendation based on risk level
  let recommendation = "";
  
  if (riskValue < 25) {
    recommendation = "Continue regular cognitive health check-ups. Maintain brain health with cognitive activities, social engagement, and physical exercise.";
  } else if (riskValue < 60) {
    recommendation = "Follow up with a neurologist for comprehensive cognitive assessment. Consider lifestyle interventions known to support brain health.";
  } else {
    recommendation = "Consult with a neurologist immediately. Further cognitive testing is recommended, along with potential treatment options and lifestyle interventions.";
  }
  
  return {
    riskLevel,
    riskValue,
    factors,
    recommendation,
    potentialDiseases: getPotentialDiseases(riskLevel, "alzheimer")
  };
}

export async function predictBrainTumor(data: CSFBiomarkerForm): Promise<DiseasePrediction> {
  const riskValue = brainTumorModel(data);
  const riskLevel = getRiskLevel(riskValue);
  
  // Determine key factors
  const factors: PredictionFactor[] = [];
  
  if (data.csfGlucose) {
    if (data.csfGlucose >= 45 && data.csfGlucose <= 80) {
      factors.push({ type: "positive", text: `Normal CSF glucose levels (${data.csfGlucose} mg/dL)` });
    } else {
      factors.push({ type: "warning", text: `Abnormal CSF glucose levels (${data.csfGlucose} mg/dL)` });
    }
  }
  
  if (data.csfProtein) {
    if (data.csfProtein > 75) {
      factors.push({ type: "negative", text: `Highly elevated CSF protein (${data.csfProtein} mg/dL)` });
    } else if (data.csfProtein > 45 && data.csfProtein <= 75) {
      factors.push({ type: "warning", text: `Elevated CSF protein (${data.csfProtein} mg/dL)` });
    } else {
      factors.push({ type: "positive", text: `Normal CSF protein levels (${data.csfProtein} mg/dL)` });
    }
  }
  
  if (data.csfLdh) {
    if (data.csfLdh > 70) {
      factors.push({ type: "negative", text: `Highly elevated LDH levels (${data.csfLdh} U/L)` });
    } else if (data.csfLdh > 40 && data.csfLdh <= 70) {
      factors.push({ type: "warning", text: `Elevated LDH levels (${data.csfLdh} U/L)` });
    } else {
      factors.push({ type: "positive", text: `Normal LDH levels (${data.csfLdh} U/L)` });
    }
  }
  
  if (data.cellCount) {
    if (data.cellCount > 20) {
      factors.push({ type: "negative", text: `High cell count (${data.cellCount} cells/µL)` });
    } else if (data.cellCount > 5 && data.cellCount <= 20) {
      factors.push({ type: "warning", text: `Elevated cell count (${data.cellCount} cells/µL)` });
    } else {
      factors.push({ type: "positive", text: `Normal cell count (${data.cellCount} cells/µL)` });
    }
  }
  
  // Generate recommendation based on risk level
  let recommendation = "";
  
  if (riskValue < 25) {
    recommendation = "No specific action required at this time based on CSF analysis. Continue with regular neurological check-ups as recommended by your physician.";
  } else if (riskValue < 60) {
    recommendation = "Follow up with a neurologist for further evaluation. Additional imaging studies may be warranted.";
  } else {
    recommendation = "Urgent neurological consultation is required. Further diagnostic imaging such as MRI and potentially biopsy may be necessary.";
  }
  
  return {
    riskLevel,
    riskValue,
    factors,
    recommendation,
    potentialDiseases: getPotentialDiseases(riskLevel, "brainTumor")
  };
}
