import { cn } from "@/lib/utils";

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
  className,
}: GaugeChartProps) {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(Math.max(0, value), 100);
  // Convert to radians for the arc
  const angle = (safeValue / 100) * 180;
  
  // Size configurations
  const sizeConfigs = {
    sm: {
      width: 120,
      height: 80,
      fontSize: 16,
      strokeWidth: 10,
    },
    md: {
      width: 150,
      height: 100,
      fontSize: 20,
      strokeWidth: 12,
    },
    lg: {
      width: 180,
      height: 120,
      fontSize: 24,
      strokeWidth: 14,
    },
  };
  
  const config = sizeConfigs[size];
  
  // Calculate coordinates for the arc
  const centerX = config.width / 2;
  const centerY = config.height;
  const radius = config.height - config.strokeWidth / 2;
  
  // Start at bottom left (180 degrees) and end at bottom right (0 degrees)
  const startAngle = Math.PI;
  const endAngle = startAngle - (angle * Math.PI) / 180;
  
  // Calculate start and end points
  const startX = centerX - radius * Math.cos(startAngle);
  const startY = centerY - radius * Math.sin(startAngle);
  const endX = centerX - radius * Math.cos(endAngle);
  const endY = centerY - radius * Math.sin(endAngle);
  
  // Determine if the arc is large or small (always small for us as we're doing less than 180 degrees)
  const largeArcFlag = angle > 180 ? 1 : 0;
  
  // Create the path for the arc
  const path = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  
  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ 
        width: config.width, 
        height: config.height 
      }}
    >
      {/* Background arc (empty) */}
      <svg 
        width={config.width} 
        height={config.height}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="absolute top-0 left-0"
      >
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 1 1 ${config.width - startX} ${startY}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          className="text-muted-foreground/20"
        />
      </svg>
      
      {/* Filled arc based on value */}
      <svg 
        width={config.width} 
        height={config.height}
        viewBox={`0 0 ${config.width} ${config.height}`}
        className="absolute top-0 left-0"
      >
        <defs>
          <linearGradient id={`gauge-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorStart} />
            <stop offset="100%" stopColor={colorEnd} />
          </linearGradient>
        </defs>
        <path
          d={path}
          fill="none"
          stroke={`url(#gauge-gradient-${size})`}
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Percentage text */}
      <div 
        className="relative font-bold text-foreground"
        style={{ fontSize: config.fontSize }}
      >
        {safeValue}%
      </div>
    </div>
  );
}