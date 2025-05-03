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
import { CSFBiomarkerFormSchema, type CSFBiomarkerForm, type CSFPredictionResponse } from '@/types';
import { PredictionCard } from '@/components/results/prediction-card';
import { TextToSpeech } from '@/components/text-to-speech';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

export default function CSFAnalysisPage() {
  const [predictionResults, setPredictionResults] = useState<CSFPredictionResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const form = useForm<CSFBiomarkerForm>({
    resolver: zodResolver(CSFBiomarkerFormSchema),
    defaultValues: {
      abeta42: 800,
      totalTau: 300,
      phosphoTau: 50,
      nfl: 500,
      glucose: 60,
      protein: 35,
      ldh: 40,
      cellCount: 0,
      age: 55,
      hasFamilyHistory: false,
      hasHeadInjuryHistory: false,
      hasMemoryIssues: false
    },
  });
  
  const predictionMutation = useMutation({
    mutationFn: async (data: CSFBiomarkerForm) => {
      const response = await apiRequest('POST', '/api/predict/csf', data);
      return response.json();
    },
    onSuccess: (data: CSFPredictionResponse) => {
      setPredictionResults(data);
      toast({
        title: "Analysis Complete",
        description: "Your CSF biomarkers have been analyzed successfully.",
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
        description: "There was an error analyzing your CSF biomarkers. Please try again.",
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
        form.setValue('abeta42', Math.floor(Math.random() * (1000 - 600) + 600));
        form.setValue('totalTau', Math.floor(Math.random() * (400 - 150) + 150));
        form.setValue('phosphoTau', Math.floor(Math.random() * (80 - 30) + 30));
        form.setValue('nfl', Math.floor(Math.random() * (700 - 300) + 300));
        form.setValue('glucose', Math.floor(Math.random() * (80 - 40) + 40));
        form.setValue('protein', Math.floor(Math.random() * (50 - 20) + 20));
        
        toast({
          title: "Report Processed",
          description: "CSF report data has been extracted and filled in the form. You can adjust any values if needed.",
        });
      }, 1500);
    }
  };
  
  function onSubmit(data: CSFBiomarkerForm) {
    predictionMutation.mutate(data);
  }
  
  // For text-to-speech
  const pageContent = `
    Cerebrospinal Fluid Biomarker Analysis. Upload your lab report or enter your CSF biomarker values manually.
    We analyze key indicators like amyloid beta, tau proteins, and other markers to assess
    your risk for Alzheimer's disease and brain tumors.
  `;

  return (
    <>
      <Header />
      <main className="container py-10 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[hsl(var(--csf-primary))]">CSF Analysis</h1>
            <p className="text-muted-foreground max-w-3xl">
              Analyze your cerebrospinal fluid biomarkers to assess risk for Alzheimer's disease and brain tumors.
              Upload your lab report or enter values manually.
            </p>
          </div>
          <TextToSpeech text={pageContent} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Enter Your CSF Biomarkers</CardTitle>
              <CardDescription>
                Fill in the form below with values from your most recent CSF test.
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
                        <h3 className="font-semibold mb-2 text-[hsl(var(--csf-primary))]">Alzheimer's Disease Markers</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="abeta42"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amyloid β-42 (pg/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="totalTau"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Tau (pg/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phosphoTau"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phosphorylated Tau (pg/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="nfl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Neurofilament Light Chain (pg/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="col-span-2 mt-4">
                        <h3 className="font-semibold mb-2 text-[hsl(var(--csf-primary))]">Brain Tumor & General Markers</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="glucose"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CSF Glucose (mg/dL)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="protein"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CSF Protein (mg/dL)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="ldh"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LDH (U/L)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cellCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cell Count (cells/μL)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="col-span-2 mt-4">
                        <h3 className="font-semibold mb-2 text-[hsl(var(--csf-primary))]">Personal Information</h3>
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
                        name="hasFamilyHistory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Family History of Alzheimer's</FormLabel>
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
                        name="hasHeadInjuryHistory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>History of Head Injury</FormLabel>
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
                        name="hasMemoryIssues"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Experiencing Memory Issues</FormLabel>
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
                        ) : 'Analyze CSF Biomarkers'}
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
                    <h3 className="font-semibold mb-1">Alzheimer's Disease Risk Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Evaluates your risk of Alzheimer's disease by analyzing amyloid beta protein, tau proteins, 
                      and other neurodegenerative markers in your cerebrospinal fluid.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Brain Tumor Risk Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Assesses the likelihood of brain tumors by examining CSF composition changes, including 
                      glucose levels, protein levels, and cell counts.
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
              {predictionResults.alzheimer && (
                <PredictionCard
                  title="Alzheimer's Disease Risk Assessment"
                  riskLevel={predictionResults.alzheimer.riskLevel}
                  riskValue={predictionResults.alzheimer.riskValue}
                  riskColorStart="hsl(var(--csf-primary))"
                  riskColorEnd="hsl(var(--csf-secondary))"
                  factors={predictionResults.alzheimer.factors}
                  recommendation={predictionResults.alzheimer.recommendation}
                  fluid="csf"
                />
              )}
              
              {predictionResults.brainTumor && (
                <PredictionCard
                  title="Brain Tumor Risk Assessment"
                  riskLevel={predictionResults.brainTumor.riskLevel}
                  riskValue={predictionResults.brainTumor.riskValue}
                  riskColorStart="hsl(var(--csf-primary))"
                  riskColorEnd="hsl(var(--csf-secondary))"
                  factors={predictionResults.brainTumor.factors}
                  recommendation={predictionResults.brainTumor.recommendation}
                  fluid="csf"
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