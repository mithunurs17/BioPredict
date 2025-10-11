import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-zinc-900/60 border-t border-zinc-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BioPredict</h3>
            <p className="text-zinc-400">
              Advanced disease prediction using biomarker analysis
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/home" className="text-zinc-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-400 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-zinc-400 hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-zinc-400">
                Email: support@biopredict.com
              </li>
              <li className="text-zinc-400">
                Phone: +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-zinc-400">
          <p>&copy; {new Date().getFullYear()} BioPredict. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 