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
  if (score < 10) return "Minimal";
  if (score < 25) return "Very Low";
  if (score < 40) return "Low";
  if (score < 60) return "Moderate";
  if (score < 75) return "High";
  return "Very High";
}

// Blood-based predictions
export async function predictDiabetesFromBlood(data: BloodBiomarkerForm): Promise<DiseasePrediction> {
  const riskValue = diabetesModel(data);
  const riskLevel = getRiskLevel(riskValue);
  
  // Determine key factors
  const factors: PredictionFactor[] = [];
  
  if (data.glucose) {
    if (data.glucose >= 126) {
      factors.push({ type: "negative", text: `Elevated fasting glucose (${data.glucose} mg/dL)` });
    } else if (data.glucose >= 100 && data.glucose < 126) {
      factors.push({ type: "warning", text: `Elevated fasting glucose (${data.glucose} mg/dL)` });
    } else {
      factors.push({ type: "positive", text: `Normal fasting glucose (${data.glucose} mg/dL)` });
    }
  }
  
  if (data.hba1c) {
    if (data.hba1c >= 6.5) {
      factors.push({ type: "negative", text: `HbA1c above diabetic threshold (${data.hba1c}%)` });
    } else if (data.hba1c >= 5.7 && data.hba1c < 6.5) {
      factors.push({ type: "warning", text: `HbA1c slightly above normal range (${data.hba1c}%)` });
    } else {
      factors.push({ type: "positive", text: `Normal HbA1c levels (${data.hba1c}%)` });
    }
  }
  
  if (data.triglycerides) {
    if (data.triglycerides > 150) {
      factors.push({ type: "warning", text: `Elevated triglyceride levels (${data.triglycerides} mg/dL)` });
    } else {
      factors.push({ type: "positive", text: `Normal triglyceride levels (${data.triglycerides} mg/dL)` });
    }
  }
  
  // Generate recommendation based on risk level
  let recommendation = "";
  
  if (riskValue < 25) {
    recommendation = "Continue maintaining a healthy lifestyle with regular exercise and balanced diet. Routine screening is sufficient.";
  } else if (riskValue < 60) {
    recommendation = "Consider lifestyle modifications including diet changes and increased physical activity. Follow-up testing recommended in 3-6 months.";
  } else {
    recommendation = "Consult with a healthcare provider promptly. Further diagnostic testing is recommended along with immediate lifestyle interventions.";
  }
  
  return {
    riskLevel,
    riskValue,
    factors,
    recommendation
  };
}

export async function predictCardiovascularDisease(data: BloodBiomarkerForm): Promise<DiseasePrediction> {
  const riskValue = cardiovascularModel(data);
  const riskLevel = getRiskLevel(riskValue);
  
  // Determine key factors
  const factors: PredictionFactor[] = [];
  
  if (data.totalCholesterol) {
    if (data.totalCholesterol >= 240) {
      factors.push({ type: "negative", text: `High total cholesterol (${data.totalCholesterol} mg/dL)` });
    } else if (data.totalCholesterol >= 200 && data.totalCholesterol < 240) {
      factors.push({ type: "warning", text: `Slightly elevated total cholesterol (${data.totalCholesterol} mg/dL)` });
    } else {
      factors.push({ type: "positive", text: `Healthy total cholesterol (${data.totalCholesterol} mg/dL)` });
    }
  }
  
  if (data.ldl) {
    if (data.ldl >= 160) {
      factors.push({ type: "negative", text: `High LDL cholesterol (${data.ldl} mg/dL)` });
    } else if (data.ldl >= 130 && data.ldl < 160) {
      factors.push({ type: "warning", text: `Borderline high LDL levels (${data.ldl} mg/dL)` });
    } else {
      factors.push({ type: "positive", text: `Optimal LDL levels (${data.ldl} mg/dL)` });
    }
  }
  
  if (data.hdl) {
    if (data.hdl < 40) {
      factors.push({ type: "negative", text: `Low HDL cholesterol (${data.hdl} mg/dL)` });
    } else if (data.hdl >= 40 && data.hdl < 60) {
      factors.push({ type: "warning", text: `Moderate HDL levels (${data.hdl} mg/dL)` });
    } else {
      factors.push({ type: "positive", text: `Healthy HDL levels (${data.hdl} mg/dL)` });
    }
  }
  
  if (data.crp) {
    if (data.crp >= 3) {
      factors.push({ type: "negative", text: `High CRP levels (${data.crp} mg/L)` });
    } else if (data.crp >= 1 && data.crp < 3) {
      factors.push({ type: "warning", text: `Moderate CRP levels (${data.crp} mg/L)` });
    } else {
      factors.push({ type: "positive", text: `Normal CRP levels (${data.crp} mg/L)` });
    }
  }
  
  // Generate recommendation based on risk level
  let recommendation = "";
  
  if (riskValue < 25) {
    recommendation = "Maintain current healthy habits. Regular cardiovascular check-ups every 1-2 years are sufficient.";
  } else if (riskValue < 60) {
    recommendation = "Consider dietary adjustments to address cholesterol levels. Increase physical activity and reduce saturated fat intake. Follow-up in 6 months.";
  } else {
    recommendation = "Consult with a cardiologist soon. Consider medication options alongside significant lifestyle modifications to reduce cardiovascular risk.";
  }
  
  return {
    riskLevel,
    riskValue,
    factors,
    recommendation
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
    recommendation
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
    recommendation
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
    recommendation
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
    recommendation
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
    recommendation
  };
}
