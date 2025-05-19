
import React from 'react';
import { Vote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  withText = true 
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Vote className={cn('text-primary', sizes[size])} />
      {withText && (
        <span className={cn('font-bold tracking-tight', textSizes[size])}>
          <span className="text-primary">Secure</span>
          <span className="text-foreground">Vote</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
