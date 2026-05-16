import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 blur-[120px] rounded-full" />
      
      <div className="relative z-10 space-y-8">
        <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center mx-auto mb-10 border border-red-500/20">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-7xl font-black text-white tracking-tighter">404</h1>
          <h2 className="text-2xl font-bold text-gray-300">Target Resource Not Found</h2>
          <p className="text-gray-500 max-w-md mx-auto text-lg leading-relaxed">
            The page you're looking for has been moved, deleted, or never existed in this architecture.
          </p>
        </div>

        <div className="pt-8">
          <Link to="/">
            <Button size="lg" className="h-14 px-10 shadow-xl shadow-accent/20">
              <Home className="w-5 h-5" /> Return to Home Base
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-20 flex gap-4 grayscale opacity-30">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-75" />
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse delay-150" />
      </div>
    </div>
  );
};
