import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PredictionCard } from "@/components/results/prediction-card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { UrineBiomarkerFormSchema, type UrineBiomarkerForm } from "@/types";

export function UrineSection() {
  const [showResults, setShowResults] = useState(false);
  const [kidneyRisk, setKidneyRisk] = useState({ 
    level: "Low", 
    value: 20,
    factors: [
      { type: "positive" as const, text: "Normal albumin levels" },
      { type: "positive" as const, text: "Normal ACR ratio" },
      { type: "warning" as const, text: "Slightly elevated NGAL (150 ng/mL)" }
    ]
  });
  const [diabetesRisk, setDiabetesRisk] = useState({ 
    level: "Minimal", 
    value: 7,
    factors: [
      { type: "positive" as const, text: "Negative urine glucose" },
      { type: "positive" as const, text: "Normal protein levels" },
      { type: "positive" as const, text: "Specific gravity within normal range" }
    ]
  });

  const form = useForm<UrineBiomarkerForm>({
    resolver: zodResolver(UrineBiomarkerFormSchema),
    defaultValues: {
      urineGlucose: undefined,
      albumin: undefined,
      creatinine: undefined,
      acr: undefined,
      protein: undefined,
      specificGravity: undefined,
      ngal: undefined,
      kim1: undefined,
    }
  });

  const urinePrediction = useMutation({
    mutationFn: async (data: UrineBiomarkerForm) => {
      const response = await apiRequest("POST", "/api/predict/urine", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Update risk states with the prediction results
      if (data.kidney) {
        setKidneyRisk({
          level: data.kidney.riskLevel,
          value: data.kidney.riskValue,
          factors: data.kidney.factors
        });
      }
      
      if (data.diabetes) {
        setDiabetesRisk({
          level: data.diabetes.riskLevel,
          value: data.diabetes.riskValue,
          factors: data.diabetes.factors
        });
      }
      
      setShowResults(true);
    },
  });

  function onSubmit(data: UrineBiomarkerForm) {
    urinePrediction.mutate(data);
  }

  return (
    <div className="fluid-content" id="urine-content">
      <div className="bg-card p-6 rounded-lg shadow-lg mb-6 border-t-4 border-[hsl(var(--urine-primary))]">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <h3 className="font-poppins font-semibold text-xl mb-3 text-[hsl(var(--urine-primary))]">Urine Analysis</h3>
            <p className="text-sm opacity-80 mb-4">
              Urine biomarkers can reveal early signs of kidney disease and diabetes. Input your urinalysis results for a comprehensive assessment.
            </p>
            <img src="https://images.unsplash.com/photo-1589187771409-43812274634e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Urine testing" className="rounded-md w-full h-auto" />
          </div>
          
          <div className="md:w-2/3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name="urineGlucose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Glucose (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Negative (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--urine-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="albumin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Albumin (mg/L)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="<30 mg/L (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--urine-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="creatinine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Creatinine (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          placeholder="20-275 mg/dL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--urine-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="acr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Albumin-to-Creatinine Ratio</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="<30 mg/g (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--urine-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Protein (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Negative to trace (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--urine-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="specificGravity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Specific Gravity</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.001"
                          placeholder="1.005-1.030 (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--urine-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ngal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">NGAL (ng/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="<131.7 ng/mL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--urine-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="kim1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">KIM-1 (pg/mL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="Normal range values"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--urine-primary))]"
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
                    className="w-full py-3 rounded-md bg-gradient-to-r from-[hsl(var(--urine-primary))] to-[hsl(var(--urine-secondary))] font-medium hover:shadow-[0_0_10px_rgba(255,209,102,0.7)] transition-shadow"
                    disabled={urinePrediction.isPending}
                  >
                    {urinePrediction.isPending ? "Analyzing..." : "Analyze Urine Biomarkers"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      {/* Urine Results Section */}
      {showResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kidney Disease Risk */}
          <PredictionCard
            title="Kidney Disease Risk Assessment"
            riskLevel={kidneyRisk.level}
            riskValue={kidneyRisk.value}
            riskColorStart="from-green-400"
            riskColorEnd="to-[hsl(var(--urine-primary))]"
            factors={kidneyRisk.factors}
            recommendation="Continue regular check-ups with your healthcare provider. Maintain proper hydration and a balanced diet low in sodium."
            fluid="urine"
          />
          
          {/* Diabetes Risk from Urine */}
          <PredictionCard
            title="Diabetes Risk Assessment (Urine)"
            riskLevel={diabetesRisk.level}
            riskValue={diabetesRisk.value}
            riskColorStart="from-green-400"
            riskColorEnd="to-green-500"
            factors={diabetesRisk.factors}
            recommendation="Maintain a healthy lifestyle with regular exercise and a balanced diet. Routine screening with your primary care physician is recommended."
            fluid="urine"
          />
        </div>
      )}
    </div>
  );
}
