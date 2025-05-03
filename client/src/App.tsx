import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import { ThemeProvider } from "@/components/theme-provider";
import { AIChatbot } from "@/components/ai-chatbot";
import { Suspense, lazy } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/research" component={dynamic(() => import("@/pages/research"))} />
      <Route path="/blood-analysis" component={dynamic(() => import("@/pages/blood-analysis"))} />
      <Route path="/saliva-analysis" component={dynamic(() => import("@/pages/saliva-analysis"))} />
      <Route path="/urine-analysis" component={dynamic(() => import("@/pages/urine-analysis"))} />
      <Route path="/csf-analysis" component={dynamic(() => import("@/pages/csf-analysis"))} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
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
        <Router />
        <AIChatbot />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
