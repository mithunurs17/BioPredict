import { Link } from 'wouter';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-zinc-900/60 border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/home" className="text-xl font-bold text-white">
              BioPredict
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link href="/home" className="text-zinc-300 hover:text-white">
                Home
              </Link>
              <Link href="/dashboard" className="text-zinc-300 hover:text-white">
                Dashboard
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-zinc-300">Welcome, {user.name}</span>
                <Button
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-zinc-300 hover:text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 