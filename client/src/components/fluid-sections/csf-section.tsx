import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PredictionCard } from "@/components/results/prediction-card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CSFBiomarkerFormSchema, type CSFBiomarkerForm } from "@/types";

export function CSFSection() {
  const [showResults, setShowResults] = useState(false);
  const [alzheimerRisk, setAlzheimerRisk] = useState({ 
    level: "High", 
    value: 78,
    factors: [
      { type: "negative" as const, text: "Low Amyloid β-42 (420 pg/mL)" },
      { type: "negative" as const, text: "Elevated total Tau (580 pg/mL)" },
      { type: "negative" as const, text: "Elevated phosphorylated Tau (68 pg/mL)" }
    ]
  });
  const [brainTumorRisk, setBrainTumorRisk] = useState({ 
    level: "Minimal", 
    value: 9,
    factors: [
      { type: "positive" as const, text: "Normal CSF glucose levels" },
      { type: "positive" as const, text: "Normal CSF protein levels" },
      { type: "positive" as const, text: "Normal LDH levels" },
      { type: "positive" as const, text: "Normal cell count" }
    ]
  });

  const form = useForm<CSFBiomarkerForm>({
    resolver: zodResolver(CSFBiomarkerFormSchema),
    defaultValues: {
      abeta42: undefined,
      totalTau: undefined,
      pTau: undefined,
      nfl: undefined,
      csfGlucose: undefined,
      csfProtein: undefined,
      csfLdh: undefined,
      cellCount: undefined
    }
  });

  const csfPrediction = useMutation({
    mutationFn: async (data: CSFBiomarkerForm) => {
      const response = await apiRequest("POST", "/api/predict/csf", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Update risk states with the prediction results
      if (data.alzheimer) {
        setAlzheimerRisk({
          level: data.alzheimer.riskLevel,
          value: data.alzheimer.riskValue,
          factors: data.alzheimer.factors
        });
      }
      
      if (data.brainTumor) {
        setBrainTumorRisk({
          level: data.brainTumor.riskLevel,
          value: data.brainTumor.riskValue,
          factors: data.brainTumor.factors
        });
      }
      
      setShowResults(true);
    },
  });

  function onSubmit(data: CSFBiomarkerForm) {
    csfPrediction.mutate(data);
  }

  return (
    <div className="fluid-content" id="csf-content">
      <div className="bg-card p-6 rounded-lg shadow-lg mb-6 border-t-4 border-[hsl(var(--csf-primary))]">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <h3 className="font-poppins font-semibold text-xl mb-3 text-[hsl(var(--csf-primary))]">CSF Analysis</h3>
            <p className="text-sm opacity-80 mb-4">
              Cerebrospinal fluid (CSF) biomarkers provide valuable insights into neurological conditions including Alzheimer's disease and brain tumors.
            </p>
            <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Brain scan" className="rounded-md w-full h-auto" />
          </div>
          
          <div className="md:w-2/3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name="abeta42"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Amyloid β-42 (pg/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="1"
                          placeholder="≥550 pg/mL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--csf-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="totalTau"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Total Tau (pg/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="1"
                          placeholder="≤375 pg/mL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--csf-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="pTau"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Phosphorylated Tau (pg/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="1"
                          placeholder="≤52 pg/mL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--csf-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nfl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Neurofilament Light Chain (pg/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="1"
                          placeholder="Age-dependent reference"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--csf-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="csfGlucose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Glucose (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="1"
                          placeholder="45-80 mg/dL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--csf-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="csfProtein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Protein (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="1"
                          placeholder="15-45 mg/dL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--csf-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="csfLdh"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">LDH (U/L)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="1"
                          placeholder="≤40 U/L (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--csf-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cellCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Cell Count (cells/µL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="1"
                          placeholder="0-5 cells/µL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--csf-primary))]"
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
                    className="w-full py-3 rounded-md bg-gradient-to-r from-[hsl(var(--csf-primary))] to-[hsl(var(--csf-secondary))] font-medium hover:shadow-[0_0_10px_rgba(127,0,255,0.7)] transition-shadow"
                    disabled={csfPrediction.isPending}
                  >
                    {csfPrediction.isPending ? "Analyzing..." : "Analyze CSF Biomarkers"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      {/* CSF Results Section */}
      {showResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alzheimer's Risk */}
          <PredictionCard
            title="Alzheimer's Disease Risk Assessment"
            riskLevel={alzheimerRisk.level}
            riskValue={alzheimerRisk.value}
            riskColorStart="from-yellow-400"
            riskColorEnd="to-red-500"
            factors={alzheimerRisk.factors}
            recommendation="Consult with a neurologist immediately. Further cognitive testing is recommended, along with potential treatment options and lifestyle interventions."
            fluid="csf"
          />
          
          {/* Brain Tumor Risk */}
          <PredictionCard
            title="Brain Tumor Risk Assessment"
            riskLevel={brainTumorRisk.level}
            riskValue={brainTumorRisk.value}
            riskColorStart="from-green-400"
            riskColorEnd="to-green-500"
            factors={brainTumorRisk.factors}
            recommendation="No specific action required at this time based on CSF analysis. Continue with regular neurological check-ups as recommended by your physician."
            fluid="csf"
          />
        </div>
      )}
    </div>
  );
}
