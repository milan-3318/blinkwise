import React from 'react';
import { Brain, User } from 'lucide-react';

export default function Navbar({ userData, onSignInClick }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <Brain size={24} />
          </div>
          <span className="text-xl font-bold text-navy tracking-tight">MindGuard AI</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-primary transition-colors">Features</a>
          <a href="#" className="hover:text-primary transition-colors">Methodology</a>
          <a href="#" className="hover:text-primary transition-colors">Safety</a>
        </div>

        <div className="flex items-center gap-4">
          {userData ? (
            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-200">
              <span className="text-xs font-bold text-navy">{userData.name}</span>
              <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                <User size={14} />
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={onSignInClick}
                className="hidden sm:block text-sm font-semibold text-navy hover:text-primary transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button 
                onClick={onSignInClick}
                className="p-2.5 bg-slate-100 rounded-full text-navy hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <User size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
