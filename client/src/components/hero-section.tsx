import { Button } from "@/components/ui/button";
import { DNAAnimation } from "@/components/dna-animation";
import { TextToSpeech } from "@/components/text-to-speech";
import { motion } from "framer-motion";

export function HeroSection() {
  // Content for text-to-speech
  const heroText = `
    BioPredict uses machine learning to predict disease risk from biomarker analysis.
    Upload your lab reports or enter biomarker values for comprehensive health insights.
    We analyze blood, saliva, urine, and cerebrospinal fluid to predict risks for 
    cardiovascular disease, diabetes, kidney disease, oral cancer, Alzheimer's, and more.
  `;

  // Scroll to fluid section
  const scrollToFluidSection = () => {
    document.getElementById('fluid-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };
  
  return (
    <div className="relative overflow-hidden bg-background">
      {/* DNA animation background */}
      <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
        <DNAAnimation />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-20 md:py-32">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <div className="flex justify-between items-center mb-2">
              <h1 className="font-poppins text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Bio<span className="text-primary">Predict</span>
              </h1>
              <TextToSpeech text={heroText} />
            </div>
            
            <p className="text-xl text-muted-foreground mt-4 md:mt-6 mb-6 md:mb-8 max-w-lg">
              Predict health risks from biomarker analysis with advanced machine learning.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={scrollToFluidSection}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/about'}
              >
                Learn More
              </Button>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl font-bold text-primary">4</span>
                <span className="text-xs text-muted-foreground">Body Fluids</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl font-bold text-primary">6</span>
                <span className="text-xs text-muted-foreground">Disease Types</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl font-bold text-primary">98%</span>
                <span className="text-xs text-muted-foreground">Accuracy</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl font-bold text-primary">24/7</span>
                <span className="text-xs text-muted-foreground">AI Assistance</span>
              </div>
            </div>
          </motion.div>
          
          {/* Image/graphics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Main hexagon with pulsing effect */}
              <svg 
                width="500" 
                height="500" 
                viewBox="0 0 500 500" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="max-w-full h-auto"
              >
                {/* Pulsing background effect */}
                <g className="animate-pulse opacity-20">
                  <path 
                    d="M250 30L442.5 145V375L250 490L57.5 375V145L250 30Z" 
                    fill="url(#biomark-gradient)" 
                  />
                </g>
                
                {/* Hexagon outline */}
                <path 
                  d="M250 50L420 155V365L250 470L80 365V155L250 50Z" 
                  stroke="url(#biomark-gradient)" 
                  strokeWidth="2" 
                  fill="none"
                />
                
                {/* Inner hexagon pattern */}
                <path 
                  d="M250 100L360 165V295L250 360L140 295V165L250 100Z" 
                  stroke="url(#biomark-gradient)" 
                  strokeWidth="1" 
                  strokeDasharray="5 3" 
                  fill="none" 
                />
                
                {/* Connected circles representing biomarkers */}
                {/* Biomarker nodes */}
                <circle cx="250" cy="100" r="14" fill="#10131614" stroke="url(#blood-gradient)" strokeWidth="2" />
                <circle cx="360" cy="165" r="14" fill="#10131614" stroke="url(#saliva-gradient)" strokeWidth="2" />
                <circle cx="360" cy="295" r="14" fill="#10131614" stroke="url(#csf-gradient)" strokeWidth="2" />
                <circle cx="250" cy="360" r="14" fill="#10131614" stroke="url(#blood-gradient)" strokeWidth="2" />
                <circle cx="140" cy="295" r="14" fill="#10131614" stroke="url(#urine-gradient)" strokeWidth="2" />
                <circle cx="140" cy="165" r="14" fill="#10131614" stroke="url(#csf-gradient)" strokeWidth="2" />
                
                {/* Center node */}
                <circle cx="250" cy="230" r="36" fill="#10131614" stroke="url(#biomark-gradient)" strokeWidth="3" />
                <text x="250" y="235" fontFamily="Poppins" fontSize="14" fontWeight="bold" fill="#d0d0d0" textAnchor="middle">AI</text>
                
                {/* Connecting lines */}
                <line x1="250" y1="100" x2="250" y2="194" stroke="url(#biomark-gradient)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="360" y1="165" x2="286" y2="230" stroke="url(#biomark-gradient)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="360" y1="295" x2="286" y2="230" stroke="url(#biomark-gradient)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="250" y1="360" x2="250" y2="266" stroke="url(#biomark-gradient)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="140" y1="295" x2="214" y2="230" stroke="url(#biomark-gradient)" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="140" y1="165" x2="214" y2="230" stroke="url(#biomark-gradient)" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="biomark-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary)/0.2)" />
                  </linearGradient>
                  
                  <linearGradient id="blood-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--blood-primary))" />
                    <stop offset="100%" stopColor="hsl(var(--blood-secondary))" />
                  </linearGradient>
                  
                  <linearGradient id="saliva-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--saliva-primary))" />
                    <stop offset="100%" stopColor="hsl(var(--saliva-secondary))" />
                  </linearGradient>
                  
                  <linearGradient id="urine-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--urine-primary))" />
                    <stop offset="100%" stopColor="hsl(var(--urine-secondary))" />
                  </linearGradient>
                  
                  <linearGradient id="csf-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--csf-primary))" />
                    <stop offset="100%" stopColor="hsl(var(--csf-secondary))" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}