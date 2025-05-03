import { ThemeToggle } from "./ui/theme-toggle";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="relative z-10">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-pink))] flex items-center justify-center mr-3">
              <i className="ri-heart-pulse-line text-xl"></i>
            </div>
            <div>
              <h1 className="font-poppins font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--neon-blue))] to-[hsl(var(--neon-pink))]">BioPredict</h1>
              <p className="text-xs opacity-70">Early Disease Detection System</p>
            </div>
          </div>
        </Link>
        
        <nav className="mt-4 md:mt-0">
          <ul className="flex items-center space-x-6">
            <li><Link href="/"><a className="hover:text-[hsl(var(--neon-blue))] transition-colors">Home</a></Link></li>
            <li><a href="#about" className="hover:text-[hsl(var(--neon-blue))] transition-colors">About</a></li>
            <li><a href="#research" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Research</a></li>
            <li><a href="#contact" className="hover:text-[hsl(var(--neon-blue))] transition-colors">Contact</a></li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
