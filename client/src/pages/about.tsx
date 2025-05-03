import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TextToSpeech } from "@/components/text-to-speech";

export default function About() {
  // Content for text-to-speech
  const pageContent = `
    BioPredict is a state-of-the-art health prediction system that uses machine learning 
    to analyze biomarkers from different body fluids and predict the risk of lifestyle diseases. 
    Our system analyzes blood, saliva, urine, and cerebrospinal fluid to assess risks for various conditions.
    We use advanced machine learning algorithms including Random Forest, Support Vector Machines, 
    and Neural Networks to provide accurate risk assessments and personalized recommendations.
  `;

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-poppins font-bold text-3xl md:text-4xl">About BioPredict</h1>
            <TextToSpeech text={pageContent} />
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 mb-10">
            <p className="text-lg mb-6">
              BioPredict is a state-of-the-art health prediction system that uses machine learning 
              to analyze biomarkers from different body fluids and predict the risk of lifestyle diseases.
              Our system provides early detection and personalized health recommendations based on your 
              lab test results.
            </p>
            
            <h2 className="font-poppins font-semibold text-2xl mt-8 mb-4">Our Machine Learning Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <div className="bg-background p-5 rounded-lg">
                <h3 className="font-semibold text-xl mb-2 text-primary">Random Forest</h3>
                <p className="opacity-80">
                  Used for robust classification and regression. Particularly effective for 
                  blood biomarker analysis like diabetes and cardiovascular risk prediction 
                  due to its ability to handle various feature types and resistance to overfitting.
                </p>
              </div>
              
              <div className="bg-background p-5 rounded-lg">
                <h3 className="font-semibold text-xl mb-2 text-primary">Support Vector Machines</h3>
                <p className="opacity-80">
                  Applied for classification in high-dimensional spaces. Particularly useful 
                  for CSF biomarker analysis in Alzheimer's detection, where the margin between 
                  different risk categories needs to be maximized.
                </p>
              </div>
              
              <div className="bg-background p-5 rounded-lg">
                <h3 className="font-semibold text-xl mb-2 text-primary">Neural Networks</h3>
                <p className="opacity-80">
                  Implemented for complex pattern recognition. Used in oral cancer detection 
                  from saliva biomarkers, where relationships between biomarkers may be 
                  highly non-linear and require deep learning approaches.
                </p>
              </div>
            </div>
            
            <h2 className="font-poppins font-semibold text-2xl mt-8 mb-4">Diseases We Predict</h2>
            
            <h3 className="font-semibold text-xl mt-6 mb-3 text-[hsl(var(--blood-primary))]">Blood Biomarkers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-background p-5 rounded-lg">
                <h4 className="font-semibold mb-2">Diabetes Mellitus</h4>
                <p className="opacity-80 mb-3">
                  A chronic metabolic disorder characterized by elevated blood glucose levels. Early 
                  detection through biomarkers can significantly improve management outcomes and prevent complications.
                </p>
                <h5 className="font-medium text-sm mb-1">Key Biomarkers:</h5>
                <ul className="list-disc list-inside text-sm opacity-80">
                  <li>Fasting Glucose ({'>'}126 mg/dL indicates diabetes)</li>
                  <li>HbA1c (≥6.5% indicates diabetes)</li>
                  <li>Insulin Resistance Markers</li>
                  <li>Inflammatory Markers</li>
                </ul>
              </div>
              
              <div className="bg-background p-5 rounded-lg">
                <h4 className="font-semibold mb-2">Cardiovascular Disease</h4>
                <p className="opacity-80 mb-3">
                  Conditions affecting the heart and blood vessels. Early biomarker analysis 
                  can identify risk factors before clinical symptoms appear, enabling preventive interventions.
                </p>
                <h5 className="font-medium text-sm mb-1">Key Biomarkers:</h5>
                <ul className="list-disc list-inside text-sm opacity-80">
                  <li>Lipid Profile (LDL, HDL, Total Cholesterol)</li>
                  <li>Inflammatory Markers (CRP, IL-6)</li>
                  <li>Homocysteine Levels</li>
                  <li>Cardiac-Specific Enzymes</li>
                </ul>
              </div>
            </div>
            
            <h3 className="font-semibold text-xl mt-6 mb-3 text-[hsl(var(--saliva-primary))]">Saliva Biomarkers</h3>
            <div className="bg-background p-5 rounded-lg mb-10">
              <h4 className="font-semibold mb-2">Oral Cancer</h4>
              <p className="opacity-80 mb-3">
                Affects the mouth, lips, tongue, and throat. Early detection through salivary 
                biomarkers can significantly improve treatment outcomes and survival rates.
              </p>
              <h5 className="font-medium text-sm mb-1">Key Biomarkers:</h5>
              <ul className="list-disc list-inside text-sm opacity-80">
                <li>Inflammatory Cytokines (IL-6, TNF-α)</li>
                <li>Tumor-Associated Markers (CYFRA 21-1)</li>
                <li>Cell Adhesion Molecules (CD44)</li>
                <li>Matrix Metalloproteinases (MMP-9)</li>
              </ul>
            </div>
            
            <h3 className="font-semibold text-xl mt-6 mb-3 text-[hsl(var(--urine-primary))]">Urine Biomarkers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="bg-background p-5 rounded-lg">
                <h4 className="font-semibold mb-2">Kidney Disease</h4>
                <p className="opacity-80 mb-3">
                  Chronic kidney disease (CKD) involves gradual loss of kidney function. Early detection 
                  allows for interventions that can slow progression and prevent complications.
                </p>
                <h5 className="font-medium text-sm mb-1">Key Biomarkers:</h5>
                <ul className="list-disc list-inside text-sm opacity-80">
                  <li>Albumin</li>
                  <li>Albumin-to-Creatinine Ratio (ACR)</li>
                  <li>NGAL (Neutrophil gelatinase-associated lipocalin)</li>
                  <li>KIM-1 (Kidney injury molecule-1)</li>
                </ul>
              </div>
              
              <div className="bg-background p-5 rounded-lg">
                <h4 className="font-semibold mb-2">Diabetes (Urine)</h4>
                <p className="opacity-80 mb-3">
                  Urine analysis can detect glucose spillover, providing an additional screening 
                  tool for diabetes alongside blood biomarkers.
                </p>
                <h5 className="font-medium text-sm mb-1">Key Biomarkers:</h5>
                <ul className="list-disc list-inside text-sm opacity-80">
                  <li>Glucose (presence indicates hyperglycemia)</li>
                  <li>Protein (may indicate diabetic nephropathy)</li>
                  <li>Specific Gravity (measures urine concentration)</li>
                </ul>
              </div>
            </div>
            
            <h3 className="font-semibold text-xl mt-6 mb-3 text-[hsl(var(--csf-primary))]">CSF Biomarkers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background p-5 rounded-lg">
                <h4 className="font-semibold mb-2">Alzheimer's Disease</h4>
                <p className="opacity-80 mb-3">
                  A progressive neurodegenerative disorder characterized by the accumulation of amyloid-β 
                  peptides and tau proteins in the brain. CSF biomarkers can detect changes years before clinical symptoms appear.
                </p>
                <h5 className="font-medium text-sm mb-1">Key Biomarkers:</h5>
                <ul className="list-disc list-inside text-sm opacity-80">
                  <li>Amyloid β-42 (decreased levels indicate risk)</li>
                  <li>Total Tau (elevated levels indicate neuronal damage)</li>
                  <li>Phosphorylated Tau (marker of neurofibrillary tangles)</li>
                  <li>Neurofilament Light Chain (marker of neuronal damage)</li>
                </ul>
              </div>
              
              <div className="bg-background p-5 rounded-lg">
                <h4 className="font-semibold mb-2">Brain Tumors</h4>
                <p className="opacity-80 mb-3">
                  Brain tumors can alter the composition of CSF. Elevated protein, LDH, and cell counts 
                  often indicate the presence of tumors.
                </p>
                <h5 className="font-medium text-sm mb-1">Key Biomarkers:</h5>
                <ul className="list-disc list-inside text-sm opacity-80">
                  <li>CSF Glucose (often decreased in tumors)</li>
                  <li>CSF Protein (elevated in many CNS disorders)</li>
                  <li>LDH (marker of tissue breakdown)</li>
                  <li>Cell Count (elevated in infection and malignancy)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}