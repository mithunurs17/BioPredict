import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PredictionCard } from "@/components/results/prediction-card";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BloodBiomarkerFormSchema, type BloodBiomarkerForm } from "@/types";

export function BloodSection() {
  const [showResults, setShowResults] = useState(false);
  const [diabetesRisk, setDiabetesRisk] = useState({ 
    level: "Moderate", 
    value: 42,
    factors: [
      { type: "warning" as const, text: "Elevated fasting glucose (115 mg/dL)" },
      { type: "warning" as const, text: "HbA1c slightly above normal range (5.9%)" },
      { type: "positive" as const, text: "Normal triglyceride levels" }
    ]
  });
  const [cvdRisk, setCvdRisk] = useState({ 
    level: "Low", 
    value: 24,
    factors: [
      { type: "positive" as const, text: "Healthy HDL levels (52 mg/dL)" },
      { type: "positive" as const, text: "Normal CRP levels (1.2 mg/L)" },
      { type: "warning" as const, text: "Slightly elevated total cholesterol (215 mg/dL)" }
    ]
  });

  const form = useForm<BloodBiomarkerForm>({
    resolver: zodResolver(BloodBiomarkerFormSchema),
    defaultValues: {
      glucose: undefined,
      hba1c: undefined,
      totalCholesterol: undefined,
      ldl: undefined,
      hdl: undefined,
      triglycerides: undefined,
      crp: undefined,
      homocysteine: undefined
    }
  });

  const bloodPrediction = useMutation({
    mutationFn: async (data: BloodBiomarkerForm) => {
      const response = await apiRequest("POST", "/api/predict/blood", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Update risk states with the prediction results
      if (data.diabetes) {
        setDiabetesRisk({
          level: data.diabetes.riskLevel,
          value: data.diabetes.riskValue,
          factors: data.diabetes.factors
        });
      }
      
      if (data.cardiovascular) {
        setCvdRisk({
          level: data.cardiovascular.riskLevel,
          value: data.cardiovascular.riskValue,
          factors: data.cardiovascular.factors
        });
      }
      
      setShowResults(true);
    },
  });

  function onSubmit(data: BloodBiomarkerForm) {
    bloodPrediction.mutate(data);
  }

  return (
    <div className="fluid-content" id="blood-content">
      <div className="bg-card p-6 rounded-lg shadow-lg mb-6 border-t-4 border-[hsl(var(--blood-primary))]">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <h3 className="font-poppins font-semibold text-xl mb-3 text-[hsl(var(--blood-primary))]">Blood Analysis</h3>
            <p className="text-sm opacity-80 mb-4">
              Blood biomarkers provide critical insights into metabolic health, cardiovascular risk, and diabetes prediction. Input your blood test results for analysis.
            </p>
            <img src="https://images.unsplash.com/photo-1615461066159-e3b34e68a22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Blood testing" className="rounded-md w-full h-auto" />
          </div>
          
          <div className="md:w-2/3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField
                  control={form.control}
                  name="glucose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Glucose (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="70-99 mg/dL (normal range)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--blood-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hba1c"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">HbA1c (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="4.0-5.6% (normal range)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--blood-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="totalCholesterol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Total Cholesterol (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="125-200 mg/dL (normal range)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--blood-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ldl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">LDL Cholesterol (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="<100 mg/dL (optimal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--blood-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="hdl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">HDL Cholesterol (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder=">40 mg/dL (desirable)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--blood-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="triglycerides"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Triglycerides (mg/dL)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="<150 mg/dL (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--blood-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="crp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">C-Reactive Protein (mg/L)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="<3.0 mg/L (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--blood-primary))]"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="homocysteine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-xs font-medium opacity-80 mb-1">Homocysteine (μmol/L)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.1"
                          placeholder="5-15 μmol/L (normal)"
                          className="w-full bg-background rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--blood-primary))]"
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
                    className="w-full py-3 rounded-md bg-gradient-to-r from-[hsl(var(--blood-primary))] to-[hsl(var(--blood-secondary))] font-medium hover:shadow-[0_0_10px_rgba(255,65,108,0.7)] transition-shadow"
                    disabled={bloodPrediction.isPending}
                  >
                    {bloodPrediction.isPending ? "Analyzing..." : "Analyze Blood Biomarkers"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
      
      {/* Blood Results Section */}
      {showResults && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Diabetes Risk */}
            <PredictionCard
              title="Diabetes Risk Assessment"
              riskLevel={diabetesRisk.level}
              riskValue={diabetesRisk.value}
              riskColorStart="from-green-400"
              riskColorEnd="to-[hsl(var(--blood-primary))]"
              factors={diabetesRisk.factors}
              recommendation="Consider lifestyle modifications including diet changes and increased physical activity. Follow-up testing recommended in 3 months."
              fluid="blood"
            />
            
            {/* Cardiovascular Risk */}
            <PredictionCard
              title="Cardiovascular Risk Assessment"
              riskLevel={cvdRisk.level}
              riskValue={cvdRisk.value}
              riskColorStart="from-green-400"
              riskColorEnd="to-yellow-400"
              factors={cvdRisk.factors}
              recommendation="Maintain current healthy habits. Consider dietary adjustments to address slightly elevated cholesterol. Routine follow-up in 6 months."
              fluid="blood"
            />
          </div>
          
          {/* Blood Disease Information */}
          <div className="mt-6 bg-card rounded-lg shadow-lg p-5 border-l-4 border-[hsl(var(--blood-primary))]">
            <h3 className="font-poppins font-semibold text-xl mb-4">About Targeted Diseases</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-[hsl(var(--blood-primary))] mb-2">Diabetes Mellitus</h4>
                <p className="text-sm opacity-80 mb-3">
                  Diabetes is a chronic metabolic disorder characterized by elevated blood glucose levels. Early detection through biomarkers can significantly improve management outcomes and prevent complications.
                </p>
                <div className="text-sm bg-background rounded-md p-3">
                  <h5 className="font-medium mb-1">Key Biomarkers:</h5>
                  <ul className="list-disc list-inside space-y-1 opacity-80">
                    <li>Fasting Glucose ({'>'}126 mg/dL indicates diabetes)</li>
                    <li>HbA1c (≥6.5% indicates diabetes)</li>
                    <li>Insulin Resistance Markers</li>
                    <li>Inflammatory Markers</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-[hsl(var(--blood-primary))] mb-2">Cardiovascular Disease</h4>
                <p className="text-sm opacity-80 mb-3">
                  Cardiovascular disease encompasses conditions affecting the heart and blood vessels. Early biomarker analysis can identify risk factors before clinical symptoms appear.
                </p>
                <div className="text-sm bg-background rounded-md p-3">
                  <h5 className="font-medium mb-1">Key Biomarkers:</h5>
                  <ul className="list-disc list-inside space-y-1 opacity-80">
                    <li>Lipid Profile (LDL, HDL, Total Cholesterol)</li>
                    <li>Inflammatory Markers (CRP, IL-6)</li>
                    <li>Homocysteine Levels</li>
                    <li>Cardiac-Specific Enzymes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
