import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface GaugeChartProps {
  value: number; // 0-100
  colorStart: string;
  colorEnd: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function GaugeChart({ 
  value, 
  colorStart, 
  colorEnd, 
  size = "md",
  className 
}: GaugeChartProps) {
  const [rotation, setRotation] = useState(0);
  
  // Calculate rotation based on value (0-100)
  useEffect(() => {
    // Convert the value (0-100) to degrees (0-180)
    const degrees = (value / 100) * 180;
    setRotation(degrees);
  }, [value]);

  const sizeClasses = {
    sm: "w-20 h-10",
    md: "w-28 h-16",
    lg: "w-36 h-20",
  };

  return (
    <div className={cn(sizeClasses[size], className)}>
      <div className="gauge bg-gray-800 h-full">
        <div 
          className={cn("gauge-fill", `bg-gradient-to-r ${colorStart} ${colorEnd}`)} 
          style={{ transform: `rotate(${rotation}deg)` }}
        ></div>
        <div className="gauge-cover bg-card"></div>
      </div>
      <div className="text-center text-sm mt-1">{value}%</div>
    </div>
  );
}
