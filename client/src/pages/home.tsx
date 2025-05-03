import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { ResearchSection } from "@/components/research-section";
import { FluidTabs } from "@/components/fluid-tabs";
import { BloodSection } from "@/components/fluid-sections/blood-section";
import { SalivaSection } from "@/components/fluid-sections/saliva-section";
import { UrineSection } from "@/components/fluid-sections/urine-section";
import { CSFSection } from "@/components/fluid-sections/csf-section";
import { FluidType } from "@/types";

export default function Home() {
  const [activeFluid, setActiveFluid] = useState<FluidType>("blood");

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        
        {/* Main Application */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-10">Select Body Fluid for Analysis</h2>
            
            {/* Fluid Selection Tabs */}
            <FluidTabs activeFluid={activeFluid} setActiveFluid={setActiveFluid} />
            
            {/* Fluid Content Container */}
            <div className="max-w-6xl mx-auto" id="fluidContentContainer">
              {/* Blood Section */}
              <div className={activeFluid === "blood" ? "fluid-content active" : "fluid-content"}>
                <BloodSection />
              </div>
              
              {/* Saliva Section */}
              <div className={activeFluid === "saliva" ? "fluid-content active" : "fluid-content"}>
                <SalivaSection />
              </div>
              
              {/* Urine Section */}
              <div className={activeFluid === "urine" ? "fluid-content active" : "fluid-content"}>
                <UrineSection />
              </div>
              
              {/* CSF Section */}
              <div className={activeFluid === "csf" ? "fluid-content active" : "fluid-content"}>
                <CSFSection />
              </div>
            </div>
          </div>
        </section>
        
        <ResearchSection />
      </main>
      <Footer />
    </>
  );
}
