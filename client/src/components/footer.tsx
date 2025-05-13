import { Link } from "wouter";
import { Dna } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col justify-center md:justify-start">
          <div className="flex items-center gap-2 mb-4">
            <Dna className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">BioPredict</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Empowering personalized health insights through advanced biomarker analysis and machine learning.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Navigate</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/home">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    About
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/blood-analysis">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Analysis
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/research">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Research
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Body Fluids</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blood-analysis">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Blood Analysis
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/saliva-analysis">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Saliva Analysis
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/urine-analysis">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Urine Analysis
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/csf-analysis">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    CSF Analysis
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Terms of Service
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/data-usage">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Data Usage
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    Contact
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="container mt-8 pt-8 border-t border-muted-foreground/20">
        <p className="text-xs text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} BioPredict. All rights reserved. 
          <span className="block mt-1 md:inline md:ml-1">
            This is a demonstration application. Not for medical use.
          </span>
        </p>
      </div>
    </footer>
  );
}