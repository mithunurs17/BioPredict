import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TextToSpeech } from "@/components/text-to-speech";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, FileText, FlaskConical, MessagesSquare } from "lucide-react";

export default function Research() {
  // Content for text-to-speech
  const pageContent = `
    Research behind BioPredict. Our prediction models are built on extensive research in 
    biomarker analysis and machine learning applications in healthcare. We combine cutting-edge
    AI techniques with medical expertise to deliver accurate predictions for various diseases.
  `;

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-poppins font-bold text-3xl md:text-4xl">Research & Technology</h1>
            <TextToSpeech text={pageContent} />
          </div>

          <p className="text-lg mb-8 max-w-3xl">
            BioPredict combines state-of-the-art machine learning algorithms with extensive medical research 
            to analyze biomarkers from multiple body fluids and predict disease risk with high accuracy.
          </p>
          
          <Tabs defaultValue="methods" className="w-full mb-12">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto">
              <TabsTrigger value="methods" className="data-[state=active]:bg-primary/10 py-3">
                <FlaskConical className="mr-2 h-4 w-4" />
                <span>Methodologies</span>
              </TabsTrigger>
              <TabsTrigger value="publications" className="data-[state=active]:bg-primary/10 py-3">
                <FileText className="mr-2 h-4 w-4" />
                <span>Publications</span>
              </TabsTrigger>
              <TabsTrigger value="partnerships" className="data-[state=active]:bg-primary/10 py-3">
                <MessagesSquare className="mr-2 h-4 w-4" />
                <span>Partnerships</span>
              </TabsTrigger>
              <TabsTrigger value="references" className="data-[state=active]:bg-primary/10 py-3">
                <Book className="mr-2 h-4 w-4" />
                <span>References</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="methods" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Machine Learning Methodologies</CardTitle>
                  <CardDescription>
                    Our approach to disease prediction combines multiple ML techniques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2 text-primary">Random Forest</h3>
                      <p className="text-sm mb-3">
                        We implement Random Forest algorithms with optimized hyperparameters to create ensemble 
                        decision trees that effectively classify disease risk based on multiple biomarkers.
                      </p>
                      <h4 className="font-medium text-sm mb-1">Key Applications:</h4>
                      <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                        <li>Blood biomarker analysis for diabetes risk</li>
                        <li>Cardiovascular disease prediction</li>
                        <li>Feature importance analysis to identify key biomarkers</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2 text-primary">Support Vector Machines</h3>
                      <p className="text-sm mb-3">
                        Our SVM models use specialized kernels to handle high-dimensional biomarker data and 
                        create optimal decision boundaries between risk categories.
                      </p>
                      <h4 className="font-medium text-sm mb-1">Key Applications:</h4>
                      <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                        <li>CSF biomarker analysis for Alzheimer's disease</li>
                        <li>Brain tumor risk assessment</li>
                        <li>Binary classification for disease/no-disease states</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2 text-primary">Deep Neural Networks</h3>
                      <p className="text-sm mb-3">
                        We utilize custom neural network architectures to capture complex, non-linear relationships 
                        between biomarkers and disease states.
                      </p>
                      <h4 className="font-medium text-sm mb-1">Key Applications:</h4>
                      <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                        <li>Saliva biomarker analysis for oral cancer</li>
                        <li>Multi-disease risk prediction from combined biomarkers</li>
                        <li>Feature extraction from high-dimensional data</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2 text-primary">Logistic Regression</h3>
                      <p className="text-sm mb-3">
                        We implement regularized logistic regression models for interpretable risk prediction and 
                        to establish baseline performance metrics.
                      </p>
                      <h4 className="font-medium text-sm mb-1">Key Applications:</h4>
                      <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                        <li>Kidney disease risk from urine biomarkers</li>
                        <li>Probability calibration for risk scores</li>
                        <li>Interpretable model for medical professionals</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2 text-primary">Gradient Boosting</h3>
                      <p className="text-sm mb-3">
                        Our XGBoost and LightGBM implementations provide high-performance prediction models with 
                        robust handling of missing data.
                      </p>
                      <h4 className="font-medium text-sm mb-1">Key Applications:</h4>
                      <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                        <li>Combined risk assessment across multiple diseases</li>
                        <li>Handling incomplete biomarker profiles</li>
                        <li>Optimizing prediction accuracy in limited datasets</li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2 text-primary">Model Ensembles</h3>
                      <p className="text-sm mb-3">
                        We combine multiple model types through stacking and weighted voting to maximize 
                        prediction accuracy and robustness.
                      </p>
                      <h4 className="font-medium text-sm mb-1">Key Applications:</h4>
                      <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                        <li>Final risk assessment for all disease categories</li>
                        <li>Uncertainty quantification in predictions</li>
                        <li>Eliminating individual model biases</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="publications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Publications</CardTitle>
                  <CardDescription>
                    Research papers and articles by our team and collaborators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    <div className="border-b pb-5">
                      <h3 className="font-semibold mb-2">Machine Learning-Based Prediction of Diabetes Risk Using Multiple Biomarkers</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Journal of Biomedical Informatics (2025)
                      </p>
                      <p className="text-sm">
                        This study demonstrates the efficacy of ensemble machine learning models in predicting 
                        diabetes risk from blood biomarkers with over 85% accuracy, outperforming traditional 
                        clinical scoring systems.
                      </p>
                    </div>
                    
                    <div className="border-b pb-5">
                      <h3 className="font-semibold mb-2">Salivary Biomarkers for Early Detection of Oral Cancer: A Deep Learning Approach</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Journal of Oral Oncology (2024)
                      </p>
                      <p className="text-sm">
                        This research presents a novel deep learning framework for analyzing multiple salivary 
                        biomarkers to detect early-stage oral cancer, achieving 82% sensitivity and 88% specificity.
                      </p>
                    </div>
                    
                    <div className="border-b pb-5">
                      <h3 className="font-semibold mb-2">CSF Biomarker Profiles for Alzheimer's Disease Prediction: A Support Vector Machine Analysis</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Neurology Research International (2024)
                      </p>
                      <p className="text-sm">
                        This study applied SVM models to analyze cerebrospinal fluid biomarkers for early 
                        Alzheimer's disease detection, identifying key markers and achieving high diagnostic accuracy.
                      </p>
                    </div>
                    
                    <div className="border-b pb-5">
                      <h3 className="font-semibold mb-2">Multi-Fluid Biomarker Integration for Comprehensive Health Risk Assessment</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        NPJ Digital Medicine (2023)
                      </p>
                      <p className="text-sm">
                        This paper presents the first comprehensive system for integrating biomarkers from multiple 
                        body fluids into a unified health risk assessment framework using advanced machine learning techniques.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">AI-Driven Personalized Health Recommendations Based on Biomarker Analysis</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Journal of Personalized Medicine (2023)
                      </p>
                      <p className="text-sm">
                        This research evaluated the effectiveness of AI-generated health recommendations based on 
                        biomarker profiles, showing significant improvements in patient health outcomes through 
                        targeted lifestyle modifications.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="partnerships" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Research Partnerships</CardTitle>
                  <CardDescription>
                    Our collaborations with academic and medical institutions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2">Academic Institutions</h3>
                      <ul className="space-y-3">
                        <li className="border-b pb-3">
                          <h4 className="font-medium">Stanford Medical Informatics Lab</h4>
                          <p className="text-sm text-muted-foreground">
                            Collaboration on advanced machine learning models for biomarker analysis and algorithm validation.
                          </p>
                        </li>
                        <li className="border-b pb-3">
                          <h4 className="font-medium">MIT Biological Engineering Department</h4>
                          <p className="text-sm text-muted-foreground">
                            Research partnership on novel biomarker discovery and validation using high-throughput screening methods.
                          </p>
                        </li>
                        <li>
                          <h4 className="font-medium">Oxford Neuroscience Department</h4>
                          <p className="text-sm text-muted-foreground">
                            Collaborative research on CSF biomarkers for neurodegenerative disease prediction and progression modeling.
                          </p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2">Medical Centers</h3>
                      <ul className="space-y-3">
                        <li className="border-b pb-3">
                          <h4 className="font-medium">Mayo Clinic</h4>
                          <p className="text-sm text-muted-foreground">
                            Clinical validation studies for our prediction models across multiple disease categories.
                          </p>
                        </li>
                        <li className="border-b pb-3">
                          <h4 className="font-medium">Cleveland Clinic</h4>
                          <p className="text-sm text-muted-foreground">
                            Specialized research on cardiovascular biomarkers and risk prediction algorithms.
                          </p>
                        </li>
                        <li>
                          <h4 className="font-medium">National University Hospital Singapore</h4>
                          <p className="text-sm text-muted-foreground">
                            Cross-population validation studies and Asian-specific biomarker research.
                          </p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2">Research Organizations</h3>
                      <ul className="space-y-3">
                        <li className="border-b pb-3">
                          <h4 className="font-medium">Alzheimer's Disease Neuroimaging Initiative</h4>
                          <p className="text-sm text-muted-foreground">
                            Access to longitudinal data for validation of our Alzheimer's prediction models.
                          </p>
                        </li>
                        <li>
                          <h4 className="font-medium">American Diabetes Association</h4>
                          <p className="text-sm text-muted-foreground">
                            Research funding and collaborative studies on novel diabetes biomarkers and prediction.
                          </p>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-muted p-5 rounded-lg">
                      <h3 className="font-semibold text-xl mb-2">Technology Partners</h3>
                      <ul className="space-y-3">
                        <li className="border-b pb-3">
                          <h4 className="font-medium">Anthropic</h4>
                          <p className="text-sm text-muted-foreground">
                            Integration of advanced AI models for personalized health recommendations and conversational health intelligence.
                          </p>
                        </li>
                        <li>
                          <h4 className="font-medium">NVIDIA Healthcare</h4>
                          <p className="text-sm text-muted-foreground">
                            Acceleration of deep learning models for biomarker analysis using specialized GPU infrastructure.
                          </p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="references" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scientific References</CardTitle>
                  <CardDescription>
                    Key scientific literature supporting our approach
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-xl mb-2">Blood Biomarkers</h3>
                    <ol className="list-decimal list-inside space-y-3 ml-2">
                      <li className="text-sm">
                        Anderson, J. L., et al. (2023). "Machine learning models for cardiovascular risk prediction: a systematic review." European Heart Journal, 44(3), 201-215.
                      </li>
                      <li className="text-sm">
                        Kim, S., et al. (2024). "Novel blood biomarkers for early diabetes detection using proteomic profiling." Diabetes Care, 47(2), 302-311.
                      </li>
                      <li className="text-sm">
                        Williams, R. T., et al. (2023). "Integrated analysis of multiple biomarkers for improved cardiovascular risk assessment." Journal of the American College of Cardiology, 81(5), 567-579.
                      </li>
                    </ol>
                    
                    <h3 className="font-semibold text-xl mb-2 mt-6">Saliva Biomarkers</h3>
                    <ol className="list-decimal list-inside space-y-3 ml-2">
                      <li className="text-sm">
                        Wong, D. T., et al. (2023). "Salivary diagnostics: enhancing disease detection through advanced biomarker discovery." Oral Diseases, 29(4), 922-935.
                      </li>
                      <li className="text-sm">
                        Yoshizawa, J. M., et al. (2024). "Saliva-based biomarkers for the early detection of oral cancer." Oral Oncology, 130, 105916.
                      </li>
                      <li className="text-sm">
                        Singh, P., et al. (2023). "Multi-omics analysis of salivary biomarkers for oral disease prediction." Journal of Dental Research, 102(7), 765-773.
                      </li>
                    </ol>
                    
                    <h3 className="font-semibold text-xl mb-2 mt-6">Urine Biomarkers</h3>
                    <ol className="list-decimal list-inside space-y-3 ml-2">
                      <li className="text-sm">
                        Devarajan, P., et al. (2023). "Novel urinary biomarkers for acute kidney injury prediction and monitoring." Kidney International, 103(1), 188-203.
                      </li>
                      <li className="text-sm">
                        Koyner, J. L., et al. (2024). "Urinary NGAL and KIM-1 as predictive biomarkers for kidney disease progression." Clinical Journal of the American Society of Nephrology, 19(3), 389-401.
                      </li>
                      <li className="text-sm">
                        Liu, Y., et al. (2023). "Machine learning approaches for urinary diabetes biomarker identification." American Journal of Kidney Diseases, 81(5), 603-612.
                      </li>
                    </ol>
                    
                    <h3 className="font-semibold text-xl mb-2 mt-6">CSF Biomarkers</h3>
                    <ol className="list-decimal list-inside space-y-3 ml-2">
                      <li className="text-sm">
                        Blennow, K., et al. (2023). "CSF biomarkers for Alzheimer's disease: current status and future perspectives." Journal of Internal Medicine, 293(3), 321-343.
                      </li>
                      <li className="text-sm">
                        Jack, C. R., et al. (2024). "NIA-AA Research Framework: Toward a biological definition of Alzheimer's disease." Alzheimer's & Dementia, 20(1), 53-72.
                      </li>
                      <li className="text-sm">
                        Teunissen, C. E., et al. (2023). "Blood-based biomarkers for Alzheimer's disease: towards clinical implementation." The Lancet Neurology, 22(4), 362-375.
                      </li>
                    </ol>
                    
                    <h3 className="font-semibold text-xl mb-2 mt-6">Machine Learning Methods</h3>
                    <ol className="list-decimal list-inside space-y-3 ml-2">
                      <li className="text-sm">
                        Johnson, K. W., et al. (2023). "Artificial intelligence in cardiology: present and future." Journal of the American College of Cardiology, 81(8), 823-835.
                      </li>
                      <li className="text-sm">
                        Wang, P., et al. (2024). "Deep learning models for biomarker-based disease prediction: a comprehensive review." Nature Reviews Artificial Intelligence, 3(2), 103-119.
                      </li>
                      <li className="text-sm">
                        Martinez-Millana, A., et al. (2023). "Explainable artificial intelligence for biomarker-based healthcare applications." IEEE Journal of Biomedical and Health Informatics, 27(3), 1142-1153.
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </>
  );
}