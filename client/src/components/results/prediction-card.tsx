import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GaugeChart } from "./gauge-chart";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface FactorItem {
  type: "positive" | "negative" | "warning";
  text: string;
}

interface PredictionCardProps {
  title: string;
  riskLevel: string;
  riskValue: number;
  riskColorStart: string;
  riskColorEnd: string;
  factors: FactorItem[];
  recommendation: string;
  fluid: "blood" | "saliva" | "urine" | "csf";
}

export function PredictionCard({
  title,
  riskLevel,
  riskValue,
  riskColorStart,
  riskColorEnd,
  factors,
  recommendation,
  fluid
}: PredictionCardProps) {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Get icon for factor type
  const getFactorIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />;
      case "negative":
        return <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />;
      default:
        return null;
    }
  };
  
  // Get background color for risk level
  const getRiskBackgroundColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "moderate":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
      case "high":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "very high":
        return "bg-red-600/10 text-red-700 dark:text-red-400";
      default:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    }
  };
  
  // Handle downloading PDF report
  const handleDownloadPDF = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation (would be a backend call in real app)
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "Report Generated",
        description: "Your personalized health report has been downloaded.",
      });
      
      // Create a dummy PDF download for demo purposes
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`
        BioPredict Health Report
        
        Analysis Type: ${title}
        Risk Level: ${riskLevel} (${riskValue}%)
        
        Key Factors:
        ${factors.map(f => `- ${f.text}`).join('\n')}
        
        Personalized Recommendations:
        ${recommendation}
        
        This report is for informational purposes only and does not constitute medical advice.
        Please consult with a healthcare professional for proper diagnosis and treatment.
      `));
      element.setAttribute('download', `biopredict_${fluid}_analysis.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  return (
    <Card className="overflow-hidden border-2">
      <CardHeader className={`${getRiskBackgroundColor(riskLevel)} border-b`}>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6 items-center mb-6">
          <div className="flex-shrink-0">
            <GaugeChart
              value={riskValue}
              colorStart={riskColorStart}
              colorEnd={riskColorEnd}
              size="lg"
            />
          </div>
          <div className="flex flex-col justify-center text-center lg:text-left">
            <h3 className="text-2xl font-bold mb-2">{riskLevel} Risk</h3>
            <p className="text-muted-foreground">
              Your risk level is <span className="font-medium">{riskValue}%</span>, which is considered {" "}
              <span className="font-medium">{riskLevel.toLowerCase()}</span>.
            </p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Key Factors</h3>
            <ul className="space-y-3">
              {factors.map((factor, index) => (
                <li key={index} className="flex gap-3">
                  {getFactorIcon(factor.type)}
                  <span className="text-sm">{factor.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-2">Personalized Recommendation</h3>
            <p className="text-sm text-muted-foreground">{recommendation}</p>
          </div>
          
          <Button 
            onClick={handleDownloadPDF} 
            disabled={isGeneratingReport}
            className="w-full"
          >
            {isGeneratingReport ? "Generating Report..." : "Download Detailed Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}