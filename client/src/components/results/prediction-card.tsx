import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GaugeChart } from "./gauge-chart";

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
  // Define icon based on factor type
  const getFactorIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <i className="ri-check-line text-green-400 mr-2 mt-0.5"></i>;
      case "negative":
        return <i className="ri-error-warning-fill text-red-500 mr-2 mt-0.5"></i>;
      case "warning":
        return <i className="ri-alert-fill text-yellow-400 mr-2 mt-0.5"></i>;
      default:
        return <i className="ri-information-line text-blue-400 mr-2 mt-0.5"></i>;
    }
  };

  const fluidGradients = {
    blood: "from-[hsl(var(--blood-primary))] to-[hsl(var(--blood-secondary))]",
    saliva: "from-[hsl(var(--saliva-primary))] to-[hsl(var(--saliva-secondary))]",
    urine: "from-[hsl(var(--urine-primary))] to-[hsl(var(--urine-secondary))]",
    csf: "from-[hsl(var(--csf-primary))] to-[hsl(var(--csf-secondary))]"
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${fluidGradients[fluid]} px-4 py-3`}>
        <h3 className="font-poppins font-semibold">{title}</h3>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium mb-1">Risk Level</h4>
            <p className={`text-2xl font-bold text-[hsl(var(--${fluid}-primary))]`}>{riskLevel}</p>
          </div>
          
          <GaugeChart 
            value={riskValue} 
            colorStart={riskColorStart} 
            colorEnd={riskColorEnd}
          />
        </div>
        
        <h4 className="font-medium mb-2 text-sm">Key Factors:</h4>
        <ul className="text-sm space-y-1 mb-4">
          {factors.map((factor, index) => (
            <li key={index} className="flex items-start">
              {getFactorIcon(factor.type)}
              <span>{factor.text}</span>
            </li>
          ))}
        </ul>
        
        <div className="bg-background rounded-md p-3 text-sm">
          <h4 className="font-medium mb-1">Recommendations:</h4>
          <p className="opacity-80">{recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}
