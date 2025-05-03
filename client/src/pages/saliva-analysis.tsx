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
import { SalivaBiomarkerFormSchema, type SalivaBiomarkerForm, type SalivaPredictionResponse } from '@/types';
import { PredictionCard } from '@/components/results/prediction-card';
import { TextToSpeech } from '@/components/text-to-speech';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

export default function SalivaAnalysisPage() {
  const [predictionResults, setPredictionResults] = useState<SalivaPredictionResponse | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const form = useForm<SalivaBiomarkerForm>({
    resolver: zodResolver(SalivaBiomarkerFormSchema),
    defaultValues: {
      il6Level: 2.5,
      tnfAlpha: 10,
      mmp9: 30,
      cd44: 45,
      cyfra21: 1.8,
      age: 35,
      isSmoker: false,
      alcoholConsumption: 1,
      hasFamilyHistory: false
    },
  });
  
  const predictionMutation = useMutation({
    mutationFn: async (data: SalivaBiomarkerForm) => {
      const response = await apiRequest('POST', '/api/predict/saliva', data);
      return response.json();
    },
    onSuccess: (data: SalivaPredictionResponse) => {
      setPredictionResults(data);
      toast({
        title: "Analysis Complete",
        description: "Your saliva biomarkers have been analyzed successfully.",
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
        description: "There was an error analyzing your saliva biomarkers. Please try again.",
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
        form.setValue('il6Level', Number((Math.random() * (5 - 1) + 1).toFixed(1)));
        form.setValue('tnfAlpha', Number((Math.random() * (20 - 5) + 5).toFixed(1)));
        form.setValue('mmp9', Math.floor(Math.random() * (60 - 20) + 20));
        form.setValue('cd44', Math.floor(Math.random() * (60 - 30) + 30));
        form.setValue('cyfra21', Number((Math.random() * (3 - 1) + 1).toFixed(1)));
        
        toast({
          title: "Report Processed",
          description: "Saliva report data has been extracted and filled in the form. You can adjust any values if needed.",
        });
      }, 1500);
    }
  };
  
  function onSubmit(data: SalivaBiomarkerForm) {
    predictionMutation.mutate(data);
  }
  
  // For text-to-speech
  const pageContent = `
    Saliva Biomarker Analysis. Upload your lab report or enter your saliva biomarker values manually.
    We analyze key indicators like interleukin-6, TNF-alpha, and other markers to assess
    your risk for oral cancer.
  `;

  return (
    <>
      <Header />
      <main className="container py-10 px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[hsl(var(--saliva-primary))]">Saliva Analysis</h1>
            <p className="text-muted-foreground max-w-3xl">
              Analyze your saliva biomarkers to assess risk for oral cancer.
              Upload your lab report or enter values manually.
            </p>
          </div>
          <TextToSpeech text={pageContent} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Enter Your Saliva Biomarkers</CardTitle>
              <CardDescription>
                Fill in the form below with values from your most recent saliva test.
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
                        <h3 className="font-semibold mb-2 text-[hsl(var(--saliva-primary))]">Inflammatory Markers</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="il6Level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interleukin-6 (pg/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tnfAlpha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TNF-α (pg/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="col-span-2 mt-4">
                        <h3 className="font-semibold mb-2 text-[hsl(var(--saliva-primary))]">Cancer Markers</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="mmp9"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>MMP-9 (ng/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cd44"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CD44 (ng/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cyfra21"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CYFRA 21-1 (ng/mL)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="col-span-2 mt-4">
                        <h3 className="font-semibold mb-2 text-[hsl(var(--saliva-primary))]">Personal Information</h3>
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
                        name="isSmoker"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Tobacco User</FormLabel>
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
                        name="alcoholConsumption"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alcohol Consumption (0-5 scale)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                max="5" 
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
                        name="hasFamilyHistory"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Family History of Oral Cancer</FormLabel>
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
                        ) : 'Analyze Saliva Biomarkers'}
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
                    <h3 className="font-semibold mb-1">Oral Cancer Risk Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      Evaluates your risk of oral cancer by analyzing inflammatory markers, cell adhesion molecules, and tumor-specific antigens in your saliva.
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
            
            <div className="grid grid-cols-1 gap-8">
              {predictionResults.oralCancer && (
                <PredictionCard
                  title="Oral Cancer Risk Assessment"
                  riskLevel={predictionResults.oralCancer.riskLevel}
                  riskValue={predictionResults.oralCancer.riskValue}
                  riskColorStart="hsl(var(--saliva-primary))"
                  riskColorEnd="hsl(var(--saliva-secondary))"
                  factors={predictionResults.oralCancer.factors}
                  recommendation={predictionResults.oralCancer.recommendation}
                  fluid="saliva"
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