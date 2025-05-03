import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-pink))] flex items-center justify-center mr-3">
                <i className="ri-heart-pulse-line text-lg"></i>
              </div>
              <h3 className="font-poppins font-bold text-xl">BioPredict</h3>
            </div>
            <p className="text-sm opacity-70 mb-4">
              Leveraging machine learning and biomarker analysis for early disease detection and preventive healthcare.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <i className="ri-twitter-x-line text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <i className="ri-linkedin-fill text-sm"></i>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-muted transition-colors">
                <i className="ri-github-fill text-sm"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Research Papers</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Methodology</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Data Privacy</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">API Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Team</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Data Processing</a></li>
              <li><a href="#" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-[hsl(var(--border))] text-center text-sm opacity-70">
          <p>© {new Date().getFullYear()} BioPredict. All rights reserved. For research and educational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
