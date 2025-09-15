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
import { apiRequest } from '@/lib/api';
import { BloodBiomarkerFormSchema, type BloodBiomarkerForm, type BloodPredictionResponse } from '@/types';
import { PredictionCard } from '@/components/results/prediction-card';
import { TextToSpeech } from '@/components/text-to-speech';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

export default function BloodAnalysisPage() {
  const [predictionResults, setPredictionResults] = useState<BloodPredictionResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const form = useForm<BloodBiomarkerForm>({
    resolver: zodResolver(BloodBiomarkerFormSchema),
    defaultValues: {
      BMI: 32,
      Chol: 5.5,
      TG: 2.2,
      HDL: 0.9,
      LDL: 3.6,
      Cr: 110,
      BUN: 7.5,
      weight: 90,
      height: 170
    },
  });

  const predictionMutation = useMutation({
    mutationFn: async (data: BloodBiomarkerForm) => {
      console.log('Sending prediction request with data:', JSON.stringify(data, null, 2));
      try {
        const response = await apiRequest('POST', '/api/predictions/blood', data);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Failed to analyze blood biomarkers');
        }
        const result = await response.json();
        console.log('Received prediction response:', JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    onSuccess: (data: BloodPredictionResponse) => {
      console.log('Prediction successful:', JSON.stringify(data, null, 2));
      setPredictionResults(data);
      toast({
        title: "Analysis Complete",
        description: "Your blood biomarkers have been analyzed successfully.",
      });

      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error: Error) => {
      console.error('Prediction error:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "There was an error analyzing your blood biomarkers. Please try again.",
      });
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);

      // Simulate parsing the file and extracting values
      // In a real app, you would parse the file (PDF, CSV, etc.) here
      setTimeout(() => {
        // Set high-risk values
        form.setValue('BMI', 32);
        form.setValue('Chol', 5.5);
        form.setValue('TG', 2.2);
        form.setValue('HDL', 0.9);
        form.setValue('LDL', 3.6);
        form.setValue('Cr', 110);
        form.setValue('BUN', 7.5);

        toast({
          title: "Report Processed",
          description: "Blood report data has been extracted and filled in the form. You can adjust any values if needed.",
        });
      }, 1500);
    }
  };

  function onSubmit(data: BloodBiomarkerForm) {
    console.log('Form submitted with data:', JSON.stringify(data, null, 2));
    predictionMutation.mutate(data);
  }

  // For text-to-speech
  const pageContent = `
    Blood Biomarker Analysis. Upload your lab report or enter your blood biomarker values manually.
    We analyze key indicators like glucose, HbA1c, cholesterol levels, and blood pressure to assess
    your risk for diabetes and cardiovascular diseases.
  `;

  return (
    <>
      <Header />
      <main className="container py-10 px-4 md:px-6 transition-all duration-500 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[hsl(var(--blood-primary))]">Blood Analysis</h1>
            <p className="text-muted-foreground max-w-3xl">
              Analyze your blood biomarkers to assess risk for diabetes and cardiovascular disease.
              Upload your lab report or enter values manually.
            </p>
          </div>
          <TextToSpeech text={pageContent} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Enter Your Blood Biomarkers</CardTitle>
              <CardDescription>
                Fill in the form below with values from your most recent blood test.
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
                      <FormField
                        control={form.control}
                        name="BMI"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center justify-between">
                              BMI
                              <span className="text-xs text-muted-foreground">
                                Normal range: 18.5-24.9
                              </span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type="number" 
                                  step="0.1" 
                                  {...field} 
                                  onChange={(e) => {
                                    const value = Number(e.target.value);
                                    field.onChange(value);
                                    // Add visual feedback based on value
                                    const input = e.target as HTMLInputElement;
                                    if (value >= 18.5 && value <= 24.9) {
                                      input.className = input.className + ' border-green-500';
                                    } else if (value < 18.5) {
                                      input.className = input.className + ' border-yellow-500';
                                    } else {
                                      input.className = input.className + ' border-red-500';
                                    }
                                  }}
                                  placeholder="Enter BMI value"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="Chol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cholesterol (mmol/L)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="TG"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Triglycerides (mmol/L)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="HDL"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>HDL (mmol/L)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="LDL"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LDL (mmol/L)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="Cr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Creatinine (μmol/L)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="BUN"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Blood Urea Nitrogen (mmol/L)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
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
                        ) : 'Analyze Blood Biomarkers'}
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
                    <h3 className="font-semibold mb-1">Diabetes Risk Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Evaluates your risk of diabetes based on glucose levels, insulin resistance markers, and other factors.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Cardiovascular Risk Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Assesses heart disease risk by analyzing cholesterol profiles, blood pressure, and inflammatory markers.
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
              {predictionResults.diabetes && (
                <PredictionCard
                  title="Diabetes Risk Assessment"
                  riskLevel={predictionResults.diabetes.riskLevel}
                  riskValue={predictionResults.diabetes.riskValue}
                  riskColorStart="hsl(var(--blood-primary))"
                  riskColorEnd="hsl(var(--blood-secondary))"
                  factors={predictionResults.diabetes.factors}
                  recommendation={predictionResults.diabetes.recommendation}
                  fluid="blood"
                  potentialDiseases={predictionResults.diabetes.potentialDiseases}
                />
              )}
              
              {predictionResults.cardiovascular && (
                <PredictionCard
                  title="Cardiovascular Risk Assessment"
                  riskLevel={predictionResults.cardiovascular.riskLevel}
                  riskValue={predictionResults.cardiovascular.riskValue}
                  riskColorStart="hsl(var(--blood-primary))"
                  riskColorEnd="hsl(var(--blood-secondary))"
                  factors={predictionResults.cardiovascular.factors}
                  recommendation={predictionResults.cardiovascular.recommendation}
                  fluid="blood"
                  potentialDiseases={predictionResults.cardiovascular.potentialDiseases}
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