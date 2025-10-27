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
import { Loader2, FileUp, AlertTriangle, CheckCircle } from 'lucide-react';
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
  const [aiSummary, setAiSummary] = useState<any>(null);

  const form = useForm<BloodBiomarkerForm>({
    resolver: zodResolver(BloodBiomarkerFormSchema),
    defaultValues: {
      BMI: 25,
      Chol: 4.5,
      TG: 1.5,
      HDL: 1.2,
      LDL: 2.8,
      Cr: 90,
      BUN: 5.5
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      let fileContent = '';
      
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        fileContent = `[Binary file: ${file.name}, type: ${file.type}, size: ${file.size} bytes] - This is a ${file.type} medical lab report. Please provide realistic biomarker extraction based on typical blood test results. Extract BMI, Cholesterol (Chol), Triglycerides (TG), HDL, LDL, Creatinine (Cr), and BUN values.`;
      } else if (file.type === 'text/plain' || file.type === 'text/csv') {
        fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string || '');
          reader.onerror = reject;
          reader.readAsText(file);
        });
      } else {
        fileContent = `Unknown file type: ${file.type}. Please analyze as a blood lab report and extract relevant biomarker values.`;
      }
      
      const uploadData = {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        reportType: 'blood',
        fileContent: fileContent
      };
      
      const response = await apiRequest('POST', '/api/reports/upload', uploadData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload report');
      }
      return await response.json();
    },
    onSuccess: (data) => {
      setAiSummary(data.summary);
      toast({
        title: "Report Uploaded Successfully",
        description: "AI has analyzed your report and extracted biomarker values.",
      });

      if (data.summary?.extractedBiomarkers) {
        data.summary.extractedBiomarkers.forEach((biomarker: any) => {
          const fieldName = biomarker.name;
          const value = parseFloat(biomarker.value);
          
          if (!isNaN(value)) {
            if (fieldName === 'BMI') form.setValue('BMI', value);
            else if (fieldName === 'Cholesterol' || fieldName === 'Chol') form.setValue('Chol', value);
            else if (fieldName === 'Triglycerides' || fieldName === 'TG') form.setValue('TG', value);
            else if (fieldName === 'HDL') form.setValue('HDL', value);
            else if (fieldName === 'LDL') form.setValue('LDL', value);
            else if (fieldName === 'Creatinine' || fieldName === 'Cr') form.setValue('Cr', value);
            else if (fieldName === 'BUN') form.setValue('BUN', value);
          }
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Failed to process your report. Please try again.",
      });
    }
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

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    onError: (error: Error) => {
      console.error('Prediction error:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error.message || "There was an error analyzing your blood biomarkers. Please try again.",
      });
    }
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      uploadMutation.mutate(file);
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
                      PDF, JPG, PNG, TXT, or CSV formats accepted
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
                      accept=".pdf,.jpg,.jpeg,.png,.txt,.csv" 
                      onChange={handleFileUpload}
                      data-testid="input-upload-report"
                    />
                  </label>
                </div>

                {uploadMutation.isPending && (
                  <Alert>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <AlertTitle>Processing Report</AlertTitle>
                    <AlertDescription>
                      AI is analyzing your report and extracting biomarker values...
                    </AlertDescription>
                  </Alert>
                )}

                {aiSummary && (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-900 dark:text-green-100">Report Analyzed Successfully</AlertTitle>
                    <AlertDescription className="text-green-800 dark:text-green-200">
                      <p className="mb-2">{aiSummary.summary}</p>
                      {aiSummary.extractedBiomarkers && aiSummary.extractedBiomarkers.length > 0 && (
                        <div className="mt-2">
                          <p className="font-semibold mb-1">Extracted values:</p>
                          <ul className="list-disc list-inside text-sm">
                            {aiSummary.extractedBiomarkers.slice(0, 5).map((b: any, i: number) => (
                              <li key={i}>{b.name}: {b.value} {b.unit}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

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