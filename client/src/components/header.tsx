import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Dna } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/home">
            <span className="flex items-center space-x-2 cursor-pointer">
              <Dna className="h-6 w-6 text-primary" />
              <span className="font-poppins font-bold text-xl">BioPredict</span>
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex space-x-8">
            <li>
              <Link href="/home">
                <span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">Home</span>
              </Link>
            </li>
            <li>
              <Link href="/blood-analysis">
                <span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">Analysis</span>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">About</span>
              </Link>
            </li>
            <li>
              <Link href="/research">
                <span className="text-foreground/70 hover:text-foreground transition-colors cursor-pointer">Research</span>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/blood-analysis">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}