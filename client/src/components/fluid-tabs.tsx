import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FluidType } from "@/types";

interface FluidTabsProps {
  activeFluid: FluidType;
  setActiveFluid: (fluid: FluidType) => void;
}

type FluidTab = {
  id: FluidType;
  name: string;
  icon: string;
  gradientFrom: string;
  gradientTo: string;
};

const fluidTabs: FluidTab[] = [
  {
    id: "blood",
    name: "Blood",
    icon: "ri-heart-pulse-fill",
    gradientFrom: "from-[hsl(var(--blood-primary))]",
    gradientTo: "to-[hsl(var(--blood-secondary))]"
  },
  {
    id: "saliva",
    name: "Saliva",
    icon: "ri-drop-fill",
    gradientFrom: "from-[hsl(var(--saliva-primary))]",
    gradientTo: "to-[hsl(var(--saliva-secondary))]"
  },
  {
    id: "urine",
    name: "Urine",
    icon: "ri-test-tube-fill",
    gradientFrom: "from-[hsl(var(--urine-primary))]",
    gradientTo: "to-[hsl(var(--urine-secondary))]"
  },
  {
    id: "csf",
    name: "CSF",
    icon: "ri-brain-fill",
    gradientFrom: "from-[hsl(var(--csf-primary))]",
    gradientTo: "to-[hsl(var(--csf-secondary))]"
  }
];

export function FluidTabs({ activeFluid, setActiveFluid }: FluidTabsProps) {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {fluidTabs.map((fluid) => (
          <Button
            key={fluid.id}
            variant="ghost"
            onClick={() => setActiveFluid(fluid.id)}
            className={cn(
              "relative p-4 rounded-md bg-card border-2 border-transparent text-center h-auto fluid-tab", 
              activeFluid === fluid.id ? "active" : "",
              `hover:border-[hsl(var(--${fluid.id}-primary))]`
            )}
            data-fluid={fluid.id}
          >
            <div className={cn(
              "w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center",
              `bg-gradient-to-r ${fluid.gradientFrom} ${fluid.gradientTo}`
            )}>
              <i className={cn(fluid.icon, "text-2xl")}></i>
            </div>
            <h3 className="font-poppins font-medium">{fluid.name}</h3>
            <div className={cn(
              "fluid-indicator absolute bottom-0 left-0 right-0 h-1",
              `bg-gradient-to-r ${fluid.gradientFrom} ${fluid.gradientTo}`
            )}></div>
          </Button>
        ))}
      </div>
    </div>
  );
}
