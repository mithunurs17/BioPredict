import { db } from "./index";
import * as schema from "@shared/schema";

async function seed() {
  try {
    // Seed disease reference data
    const diseasesData = [
      {
        name: "Diabetes Mellitus",
        fluidType: "blood",
        description: "Diabetes is a chronic metabolic disorder characterized by elevated blood glucose levels. Early detection through biomarkers can significantly improve management outcomes and prevent complications.",
        keyBiomarkers: [
          { name: "Fasting Glucose", normalRange: "70-99 mg/dL", description: ">126 mg/dL indicates diabetes" },
          { name: "HbA1c", normalRange: "4.0-5.6%", description: "≥6.5% indicates diabetes" },
          { name: "Insulin Resistance Markers", normalRange: "Varies", description: "Various indicators of insulin function" },
          { name: "Inflammatory Markers", normalRange: "Varies", description: "Indicators of systemic inflammation" }
        ]
      },
      {
        name: "Cardiovascular Disease",
        fluidType: "blood",
        description: "Cardiovascular disease encompasses conditions affecting the heart and blood vessels. Early biomarker analysis can identify risk factors before clinical symptoms appear.",
        keyBiomarkers: [
          { name: "Lipid Profile", normalRange: "LDL <100 mg/dL, HDL >40 mg/dL", description: "LDL, HDL, Total Cholesterol" },
          { name: "Inflammatory Markers", normalRange: "CRP <3.0 mg/L", description: "CRP, IL-6" },
          { name: "Homocysteine", normalRange: "5-15 μmol/L", description: "Amino acid linked to heart disease" },
          { name: "Cardiac-Specific Enzymes", normalRange: "Varies", description: "Specific enzymes released during cardiac damage" }
        ]
      },
      {
        name: "Oral Cancer",
        fluidType: "saliva",
        description: "Oral cancer affects the mouth, lips, tongue, and throat. Early detection through salivary biomarkers can significantly improve treatment outcomes and survival rates.",
        keyBiomarkers: [
          { name: "Inflammatory Cytokines", normalRange: "IL-6 <5 pg/mL, TNF-α <15 pg/mL", description: "IL-6, TNF-α" },
          { name: "Tumor-Associated Markers", normalRange: "CYFRA 21-1 <3.3 ng/mL", description: "CYFRA 21-1" },
          { name: "Cell Adhesion Molecules", normalRange: "Varies", description: "CD44" },
          { name: "Matrix Metalloproteinases", normalRange: "Varies", description: "MMP-9" }
        ]
      },
      {
        name: "Kidney Disease",
        fluidType: "urine",
        description: "Chronic kidney disease (CKD) is a gradual loss of kidney function. Early detection through urine biomarkers allows for interventions that can slow progression and prevent complications.",
        keyBiomarkers: [
          { name: "Albumin", normalRange: "<30 mg/L", description: "Protein indicating kidney damage when elevated" },
          { name: "Albumin-to-Creatinine Ratio (ACR)", normalRange: "<30 mg/g", description: "Ratio that normalizes albumin to creatinine" },
          { name: "NGAL", normalRange: "<131.7 ng/mL", description: "Neutrophil gelatinase-associated lipocalin" },
          { name: "KIM-1", normalRange: "Varies", description: "Kidney injury molecule-1" }
        ]
      },
      {
        name: "Diabetes (Urine)",
        fluidType: "urine",
        description: "Urine analysis can detect glucose spillover, providing an additional screening tool for diabetes alongside blood biomarkers. Presence of glucose in urine can indicate that blood glucose levels are elevated above the renal threshold.",
        keyBiomarkers: [
          { name: "Glucose", normalRange: "Negative", description: "Presence indicates hyperglycemia" },
          { name: "Protein", normalRange: "Negative to trace", description: "May indicate diabetic nephropathy" },
          { name: "Specific Gravity", normalRange: "1.005-1.030", description: "Measures urine concentration" }
        ]
      },
      {
        name: "Alzheimer's Disease",
        fluidType: "csf",
        description: "Alzheimer's disease is a progressive neurodegenerative disorder characterized by the accumulation of amyloid-β peptides and tau proteins in the brain. CSF biomarkers can detect these changes years before clinical symptoms appear.",
        keyBiomarkers: [
          { name: "Amyloid β-42", normalRange: "≥550 pg/mL", description: "Decreased levels indicate risk" },
          { name: "Total Tau", normalRange: "≤375 pg/mL", description: "Elevated levels indicate neuronal damage" },
          { name: "Phosphorylated Tau", normalRange: "≤52 pg/mL", description: "Marker of neurofibrillary tangles" },
          { name: "Neurofilament Light Chain", normalRange: "Age-dependent", description: "Marker of neuronal damage" }
        ]
      },
      {
        name: "Brain Tumors",
        fluidType: "csf",
        description: "Brain tumors can alter the composition of CSF. Elevated protein, LDH, and cell counts often indicate the presence of tumors. Early detection through CSF analysis can lead to earlier intervention and improved outcomes.",
        keyBiomarkers: [
          { name: "CSF Glucose", normalRange: "45-80 mg/dL", description: "Often decreased in tumors" },
          { name: "CSF Protein", normalRange: "15-45 mg/dL", description: "Elevated in many CNS disorders" },
          { name: "LDH", normalRange: "≤40 U/L", description: "Marker of tissue breakdown" },
          { name: "Cell Count", normalRange: "0-5 cells/µL", description: "Elevated in infection and malignancy" }
        ]
      }
    ];

    console.log("Seeding diseases data...");
    for (const disease of diseasesData) {
      // Check if disease already exists to avoid duplicates
      const existingDisease = await db.query.diseases.findFirst({
        where: (diseases, { eq }) => eq(diseases.name, disease.name)
      });

      if (!existingDisease) {
        await db.insert(schema.diseases).values(disease);
        console.log(`Inserted disease: ${disease.name}`);
      } else {
        console.log(`Disease ${disease.name} already exists, skipping.`);
      }
    }

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  }
}

seed();
