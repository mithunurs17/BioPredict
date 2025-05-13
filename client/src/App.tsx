import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Landing from "@/pages/landing";
import { ThemeProvider } from "@/components/theme-provider";
import { AIChatbot } from "@/components/ai-chatbot";
import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { MeteorBackground } from "@/components/meteor-background";

function Router() {
  const [location] = useLocation();

  const pageTransitions = {
    landing: {
      variants: {
        initial: { 
          opacity: 0, 
          y: '10%', 
          scale: 0.9,
          rotate: -2,
          filter: 'blur(15px)'
        },
        in: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotate: 0,
          filter: 'blur(0px)'
        },
        out: { 
          opacity: 0, 
          y: '-10%', 
          scale: 1.1,
          rotate: 2,
          filter: 'blur(15px)'
        }
      },
      transition: {
        type: 'tween',
        ease: 'easeOut',
        duration: 0.6
      }
    },
    home: {
      variants: {
        initial: { 
          opacity: 0, 
          x: '-4%', 
          scale: 0.96,
          filter: 'brightness(0.9)'
        },
        in: { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          filter: 'brightness(1)'
        },
        out: { 
          opacity: 0, 
          x: '4%', 
          scale: 1.04,
          filter: 'brightness(0.9)'
        }
      },
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.4
      }
    },
    about: {
      variants: {
        initial: { 
          opacity: 0, 
          scale: 0.92,
          rotate: 1,
          filter: 'blur(4px)'
        },
        in: { 
          opacity: 1, 
          scale: 1,
          rotate: 0,
          filter: 'blur(0px)'
        },
        out: { 
          opacity: 0, 
          scale: 1.08,
          rotate: -1,
          filter: 'blur(4px)'
        }
      },
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.4
      }
    },
    research: {
      variants: {
        initial: { 
          opacity: 0, 
          x: '5%', 
          scale: 0.93,
          filter: 'saturate(0)'
        },
        in: { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          filter: 'saturate(1)'
        },
        out: { 
          opacity: 0, 
          x: '-5%', 
          scale: 1.07,
          filter: 'saturate(0)'
        }
      },
      transition: {
        type: 'tween',
        ease: 'circOut',
        duration: 1.1
      }
    },
    analysis: {
      variants: {
        initial: { 
          opacity: 0, 
          y: '6%', 
          scale: 0.88,
          filter: 'contrast(0.5)'
        },
        in: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          filter: 'contrast(1)'
        },
        out: { 
          opacity: 0, 
          y: '-6%', 
          scale: 1.12,
          filter: 'contrast(0.5)'
        }
      },
      transition: {
        type: 'spring',
        stiffness: 25,
        damping: 20,
        duration: 1.3
      }
    }
  };

  const ResearchPage = dynamic(() => import("@/pages/research"));
  const BloodAnalysisPage = dynamic(() => import("@/pages/blood-analysis"));
  const SalivaAnalysisPage = dynamic(() => import("@/pages/saliva-analysis"));
  const UrineAnalysisPage = dynamic(() => import("@/pages/urine-analysis"));
  const CSFAnalysisPage = dynamic(() => import("@/pages/csf-analysis"));

  const PrivacyPolicyPage = dynamic(() => import("@/pages/privacy-policy"));
  const TermsOfServicePage = dynamic(() => import("@/pages/terms-of-service"));
  const DataUsagePage = dynamic(() => import("@/pages/data-usage"));
  const ContactPage = dynamic(() => import("@/pages/contact"));

  return (
    <AnimatePresence mode='wait'>
      <Switch location={location} key={location}>
        <Route path="/" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.landing.variants}
            transition={pageTransitions.landing.transition}
          >
            <Landing />
          </motion.div>
        )} />
        <Route path="/home" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.home.variants}
            transition={pageTransitions.home.transition}
          >
            <Home />
          </motion.div>
        )} />
        <Route path="/about" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.about.variants}
            transition={pageTransitions.about.transition}
          >
            <About />
          </motion.div>
        )} />
        <Route path="/research" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.research.variants}
            transition={pageTransitions.research.transition}
          >
            <ResearchPage />
          </motion.div>
        )} />
        <Route path="/blood-analysis" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.analysis.variants}
            transition={pageTransitions.analysis.transition}
          >
            <BloodAnalysisPage />
          </motion.div>
        )} />
        <Route path="/saliva-analysis" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.analysis.variants}
            transition={pageTransitions.analysis.transition}
          >
            <SalivaAnalysisPage />
          </motion.div>
        )} />
        <Route path="/urine-analysis" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.analysis.variants}
            transition={pageTransitions.analysis.transition}
          >
            <UrineAnalysisPage />
          </motion.div>
        )} />
        <Route path="/csf-analysis" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.analysis.variants}
            transition={pageTransitions.analysis.transition}
          >
            <CSFAnalysisPage />
          </motion.div>
        )} />
        <Route path="/privacy-policy" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.about.variants}
            transition={pageTransitions.about.transition}
          >
            <PrivacyPolicyPage />
          </motion.div>
        )} />
        <Route path="/terms-of-service" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.about.variants}
            transition={pageTransitions.about.transition}
          >
            <TermsOfServicePage />
          </motion.div>
        )} />
        <Route path="/data-usage" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.about.variants}
            transition={pageTransitions.about.transition}
          >
            <DataUsagePage />
          </motion.div>
        )} />
        <Route path="/contact" component={() => (
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageTransitions.about.variants}
            transition={pageTransitions.about.transition}
          >
            <ContactPage />
          </motion.div>
        )} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

// Dynamic import helper
function dynamic(importFn: () => Promise<any>) {
  const LazyComponent = lazy(importFn);
  return (props: any) => (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <MeteorBackground />
        <Router />
        <AIChatbot />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
