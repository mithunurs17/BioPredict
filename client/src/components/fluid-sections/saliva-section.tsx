import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PredictionCard } from "@/components/results/prediction-card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SalivaBiomarkerFormSchema, type SalivaBiomarkerForm } from "@/types";

export function SalivaSection() {
  const [showResults, setShowResults] = useState(false);
  const [oralCancerRisk, setOralCancerRisk] = useState({ 
    level: "Very Low", 
    value: 11,
    factors: [
      { type: "positive" as const, text: "Normal IL-6 levels" },
      { type: "positive" as const, text: "Normal TNF-α levels" },
      { type: "positive" as const, text: "CYFRA 21-1 within normal range" }
    ]
  });

  const form = useForm<SalivaBiomarkerForm>({
    resolver: zodResolver(SalivaBiomarkerFormSchema),
    defaultValues: {
      il6: undefined,
      tnfAlpha: undefined,
      mmp9: undefined,
      salivaCortisol: undefined,
      cyfra21: undefined,
      cd44: undefined
    }
  });

  const salivaPrediction = useMutation({
    mutationFn: async (data: SalivaBiomarkerForm) => {
      const response = await apiRequest("POST", "/api/predict/saliva", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Update risk states with the prediction results
      if (data.oralCancer) {
        setOralCancerRisk({
          level: data.oralCancer.riskLevel,
          value: data.oralCancer.riskValue,
          factors: data.oralCancer.factors
        });
      }
      
      setShowResults(true);
    },
  });

  function onSubmit(data: SalivaBiomarkerForm) {
    salivaPrediction.mutate(data);
  }

  return (
    <div className="fluid-content" id="saliva-content">
      <div className="bg-card p-6 rounded-lg shadow-lg mb-6 border-t-4 border-[hsl(var(--saliva-primary))]">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <h3 className="font-poppins font-semibold text-xl mb-3 text-[hsl(var(--saliva-primary))]">Saliva Analysis</h3>
            <p className="text-sm opacity-80 mb-4">
              Saliva contains numerous biomarkers that can detect oral cancer and other health conditions. Input your salivary test results for analysis.
            </p>
            <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Saliva testing" className="rounded-md w-full h-auto" />
          </div>
          
          <div className="md:w-2/3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name="il6"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Interleukin-6 (IL-6) (pg/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="<5 pg/mL (normal range)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--saliva-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tnfAlpha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">TNF-α (pg/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="<15 pg/mL (normal range)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--saliva-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mmp9"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Matrix Metalloproteinase-9 (MMP-9)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Normal range values"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--saliva-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="salivaCortisol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Cortisol (nmol/L)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="5-25 nmol/L (morning normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--saliva-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cyfra21"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">CYFRA 21-1 (ng/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="<3.3 ng/mL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--saliva-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cd44"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">CD44 (ng/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="Normal range values"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--saliva-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="col-span-1 md:col-span-2 mt-2">
                  <Button 
                    type="submit" 
                    className="w-full py-3 rounded-md bg-gradient-to-r from-[hsl(var(--saliva-primary))] to-[hsl(var(--saliva-secondary))] font-medium hover:shadow-[0_0_10px_rgba(19,226,218,0.7)] transition-shadow"
                    disabled={salivaPrediction.isPending}
                  >
                    {salivaPrediction.isPending ? "Analyzing..." : "Analyze Saliva Biomarkers"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      {/* Saliva Results Section */}
      {showResults && (
        <Card className="bg-card rounded-lg shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-[hsl(var(--saliva-primary))] to-[hsl(var(--saliva-secondary))] px-4 py-3">
            <h3 className="font-poppins font-semibold">Oral Cancer Risk Assessment</h3>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="font-medium mb-1">Risk Level</h4>
                    <p className="text-2xl font-bold text-[hsl(var(--saliva-primary))]">{oralCancerRisk.level}</p>
                  </div>
                  
                  <div className="w-28 h-16">
                    <div className="gauge bg-gray-800 h-full">
                      <div className="gauge-fill bg-gradient-to-r from-green-400 to-[hsl(var(--saliva-primary))]" style={{transform: `rotate(${oralCancerRisk.value * 1.8}deg)`}}></div>
                      <div className="gauge-cover bg-card"></div>
                    </div>
                    <div className="text-center text-sm mt-1">{oralCancerRisk.value}%</div>
                  </div>
                </div>
                
                <h4 className="font-medium mb-2 text-sm">Key Factors:</h4>
                <ul className="text-sm space-y-1 mb-4">
                  {oralCancerRisk.factors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      {factor.type === "positive" ? (
                        <i className="ri-check-line text-green-400 mr-2 mt-0.5"></i>
                      ) : factor.type === "warning" ? (
                        <i className="ri-alert-fill text-yellow-400 mr-2 mt-0.5"></i>
                      ) : (
                        <i className="ri-error-warning-fill text-red-500 mr-2 mt-0.5"></i>
                      )}
                      <span>{factor.text}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="bg-background rounded-md p-3 text-sm">
                  <h4 className="font-medium mb-1">Recommendations:</h4>
                  <p className="opacity-80">Continue regular dental check-ups. Maintain good oral hygiene practices. No additional screening needed at this time.</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-[hsl(var(--saliva-primary))] mb-2">About Oral Cancer</h4>
                <p className="text-sm opacity-80 mb-3">
                  Oral cancer affects the mouth, lips, tongue, and throat. Early detection through salivary biomarkers can significantly improve treatment outcomes and survival rates.
                </p>
                <div className="text-sm bg-background rounded-md p-3">
                  <h5 className="font-medium mb-1">Key Biomarkers:</h5>
                  <ul className="list-disc list-inside space-y-1 opacity-80">
                    <li>Inflammatory Cytokines (IL-6, TNF-α)</li>
                    <li>Tumor-Associated Markers (CYFRA 21-1)</li>
                    <li>Cell Adhesion Molecules (CD44)</li>
                    <li>Matrix Metalloproteinases (MMP-9)</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
