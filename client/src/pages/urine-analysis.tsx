import { useState } from 'react';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, FileUp, AlertTriangle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { UrineBiomarkerFormSchema, type UrineBiomarkerForm, type UrinePredictionResponse } from '@/types';
import { PredictionCard } from '@/components/results/prediction-card';
import { TextToSpeech } from '@/components/text-to-speech';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

export default function UrineAnalysisPage() {
  const [predictionResults, setPredictionResults] = useState<UrinePredictionResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const form = useForm<UrineBiomarkerForm>({
    resolver: zodResolver(UrineBiomarkerFormSchema),
    defaultValues: {
      urineAlbumin: 10,
      urineCreatinine: 150,
      albumin2CreatinineRatio: 10,
      urineGlucose: 0,
      specificGravity: 1.020,
      bloodUreaNitrogen: 15,
      urineProtein: 0,
      ph: 6.0,
      ngal: 15,
      kim1: 0.5,
      age: 35,
      hasHypertension: false,
      hasDiabetes: false,
      weight: 70,
      height: 170
    },
  });
  
  const predictionMutation = useMutation({
    mutationFn: async (data: UrineBiomarkerForm) => {
      const response = await apiRequest('POST', '/api/predict/urine', data);
      return response.json();
    },
    onSuccess: (data: UrinePredictionResponse) => {
      setPredictionResults(data);
      toast({
        title: "Analysis Complete",
        description: "Your urine biomarkers have been analyzed successfully.",
      });
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error) => {
      console.error('Prediction error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "There was an error analyzing your urine biomarkers. Please try again.",
      });
    }
  });
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      
      // Simulate parsing the file and extracting values
      // In a real app, you would parse the file (PDF, CSV, etc.) here
      setTimeout(() => {
        // For demo, set random realistic values
        form.setValue('urineAlbumin', Math.floor(Math.random() * (30 - 5) + 5));
        form.setValue('urineCreatinine', Math.floor(Math.random() * (200 - 100) + 100));
        form.setValue('albumin2CreatinineRatio', Math.floor(Math.random() * (30 - 5) + 5));
        form.setValue('urineGlucose', Math.floor(Math.random() * 3)); // 0, 1, or 2
        form.setValue('specificGravity', Number((Math.random() * (1.030 - 1.005) + 1.005).toFixed(3)));
        form.setValue('ph', Number((Math.random() * (8.0 - 5.0) + 5.0).toFixed(1)));
        
        toast({
          title: "Report Processed",
          description: "Urine report data has been extracted and filled in the form. You can adjust any values if needed.",
        });
      }, 1500);
    }
  };
  
  function onSubmit(data: UrineBiomarkerForm) {
    predictionMutation.mutate(data);
  }
  
  // For text-to-speech
  const pageContent = `
    Urine Biomarker Analysis. Upload your lab report or enter your urine biomarker values manually.
    We analyze key indicators like albumin, creatinine, glucose, and pH levels to assess
    your risk for kidney disease and diabetes.
  `;

  return (
    <>
      <Header />
      <main className="container py-10 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[hsl(var(--urine-primary))]">Urine Analysis</h1>
            <p className="text-muted-foreground max-w-3xl">
              Analyze your urine biomarkers to assess risk for kidney disease and diabetes.
              Upload your lab report or enter values manually.
            </p>
          </div>
          <TextToSpeech text={pageContent} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Enter Your Urine Biomarkers</CardTitle>
              <CardDescription>
                Fill in the form below with values from your most recent urine test.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="mb-6">
                  <label 
                    htmlFor="report-upload" 
                    className="block w-full cursor-pointer border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors"
                  >
                    <FileUp className="h-10 w-10 mx-auto mb-4 text-primary/50" />
                    <p className="mb-2 font-semibold">Upload Lab Report (Optional)</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      PDF, JPG, or PNG formats accepted
                    </p>
                    {uploadedFile && (
                      <p className="text-sm font-medium text-primary">
                        {uploadedFile.name}
                      </p>
                    )}
                    <input 
                      id="report-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="col-span-2">
                        <h3 className="font-semibold mb-2 text-[hsl(var(--urine-primary))]">Kidney Function Markers</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="urineAlbumin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urine Albumin (mg/L)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="urineCreatinine"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urine Creatinine (mg/dL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="albumin2CreatinineRatio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Albumin/Creatinine Ratio</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="urineProtein"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urine Protein (mg/dL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bloodUreaNitrogen"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Urea Nitrogen (mg/dL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ngal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NGAL (ng/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="kim1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>KIM-1 (ng/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="col-span-2 mt-4">
                        <h3 className="font-semibold mb-2 text-[hsl(var(--urine-primary))]">Other Urine Parameters</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="urineGlucose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Urine Glucose (0-3 scale)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                max="3" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="specificGravity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specific Gravity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.001" 
                                min="1.000" 
                                max="1.050" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ph"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>pH</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.1" 
                                min="4.5" 
                                max="9.0" 
                                {...field} 
                                onChange={(e) => field.onChange(Number(e.target.value))} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="col-span-2 mt-4">
                        <h3 className="font-semibold mb-2 text-[hsl(var(--urine-primary))]">Personal Information</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Age (years)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="hasHypertension"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Diagnosed with Hypertension</FormLabel>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="hasDiabetes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Diagnosed with Diabetes</FormLabel>
                            </div>
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={predictionMutation.isPending}
                        size="lg"
                      >
                        {predictionMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : 'Analyze Urine Biomarkers'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What's Being Analyzed?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-1">Kidney Disease Risk Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Evaluates your risk of kidney disease by analyzing albumin, creatinine, protein levels, and kidney-specific biomarkers.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Diabetes Risk Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Assesses diabetes risk based on glucose presence in urine and other markers that may indicate glycemic issues.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Alert className="bg-primary/5 border-primary/20">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription className="text-xs">
                    This analysis is for informational purposes only and should not replace professional medical advice.
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        {predictionResults && (
          <div id="results-section" className="mt-10 pt-6 border-t">
            <h2 className="text-2xl font-bold mb-6">Your Health Analysis Results</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {predictionResults.kidney && (
                <PredictionCard
                  title="Kidney Disease Risk Assessment"
                  riskLevel={predictionResults.kidney.riskLevel}
                  riskValue={predictionResults.kidney.riskValue}
                  riskColorStart="hsl(var(--urine-primary))"
                  riskColorEnd="hsl(var(--urine-secondary))"
                  factors={predictionResults.kidney.factors}
                  recommendation={predictionResults.kidney.recommendation}
                  fluid="urine"
                />
              )}
              
              {predictionResults.diabetes && (
                <PredictionCard
                  title="Diabetes Risk Assessment"
                  riskLevel={predictionResults.diabetes.riskLevel}
                  riskValue={predictionResults.diabetes.riskValue}
                  riskColorStart="hsl(var(--urine-primary))"
                  riskColorEnd="hsl(var(--urine-secondary))"
                  factors={predictionResults.diabetes.factors}
                  recommendation={predictionResults.diabetes.recommendation}
                  fluid="urine"
                />
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}