
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex gap-4">
            <Link 
              to="/admin" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>
      
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      
      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SecureVote. All rights reserved.</p>
          <p className="mt-1">A secure online voting platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
