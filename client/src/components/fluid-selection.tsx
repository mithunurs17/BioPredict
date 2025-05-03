import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { DropletIcon, Droplets, TestTube, Brain } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function FluidSelection() {
  const [hoveredFluid, setHoveredFluid] = useState<string | null>(null);
  
  const fluids = [
    {
      id: "blood",
      name: "Blood",
      icon: DropletIcon,
      description: "Analyze blood biomarkers to assess risk for diabetes and cardiovascular disease.",
      colorClass: "bg-gradient-to-br from-[hsl(var(--blood-primary))] to-[hsl(var(--blood-secondary))]",
      route: "/blood-analysis"
    },
    {
      id: "saliva",
      name: "Saliva",
      icon: Droplets,
      description: "Analyze saliva biomarkers to assess risk for oral cancer.",
      colorClass: "bg-gradient-to-br from-[hsl(var(--saliva-primary))] to-[hsl(var(--saliva-secondary))]",
      route: "/saliva-analysis"
    },
    {
      id: "urine",
      name: "Urine",
      icon: TestTube,
      description: "Analyze urine biomarkers to assess risk for kidney disease and diabetes.",
      colorClass: "bg-gradient-to-br from-[hsl(var(--urine-primary))] to-[hsl(var(--urine-secondary))]",
      route: "/urine-analysis"
    },
    {
      id: "csf",
      name: "CSF",
      icon: Brain,
      description: "Analyze cerebrospinal fluid biomarkers to assess risk for Alzheimer's and brain tumors.",
      colorClass: "bg-gradient-to-br from-[hsl(var(--csf-primary))] to-[hsl(var(--csf-secondary))]",
      route: "/csf-analysis"
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: { 
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div id="fluid-section" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">Select Body Fluid for Analysis</h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {fluids.map((fluid) => {
            const Icon = fluid.icon;
            return (
              <motion.div
                key={fluid.id}
                variants={itemVariants}
                whileHover="hover"
                onMouseEnter={() => setHoveredFluid(fluid.id)}
                onMouseLeave={() => setHoveredFluid(null)}
              >
                <Link href={fluid.route}>
                  <Card className={`cursor-pointer h-full transition-all duration-300 ${
                    hoveredFluid === fluid.id 
                      ? "shadow-lg border-primary" 
                      : "shadow border-transparent"
                  }`}>
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${fluid.colorClass}`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-bold text-xl mb-2">{fluid.name}</h3>
                      <p className="text-muted-foreground text-sm flex-grow">
                        {fluid.description}
                      </p>
                      <div className={`mt-4 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        hoveredFluid === fluid.id 
                          ? `${fluid.colorClass} text-white` 
                          : "bg-muted text-foreground"
                      }`}>
                        Start Analysis
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}