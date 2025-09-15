// import DnaHeroBackground from "@/components/DnaHeroBackground";
import { useLocation } from "wouter";
import { useState } from "react";
import { EyeRippleAnimation } from "@/components/eye-ripple-animation";
import { motion, AnimatePresence } from "framer-motion";

export default function Landing() {
  const [, navigate] = useLocation();
  const [showMainContent, setShowMainContent] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnimationComplete = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowMainContent(true);
      setIsTransitioning(false);
    }, 1000); // Wait for fade out to complete
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!showMainContent ? (
          <motion.div
            key="eye-ripple-animation"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <EyeRippleAnimation onComplete={handleAnimationComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="relative w-full h-full"
          >
            {/* Animated DNA background image */}
            <div
              className="fixed inset-0 w-full h-full -z-10 animate-zoom-bg"
              style={{
                backgroundImage: 'url(/dna-bg-2.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.7) blur(1px)',
                transition: 'transform 10s linear',
              }}
            />
            <div className="relative z-10 text-center">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-6xl font-extrabold text-white mb-6 drop-shadow-lg"
              >
                Welcome to <span className="text-fuchsia-400 animate-pulse">BioPredict</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="text-xl text-white/80 mb-8 max-w-xl mx-auto"
              >
                Predict health risks from biomarker analysis with advanced machine learning.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="px-8 py-3 rounded-lg bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-lg font-semibold shadow-lg transition transform hover:scale-105 active:scale-95"
                onClick={() => navigate("/home")}
              >
                Enter Site
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}