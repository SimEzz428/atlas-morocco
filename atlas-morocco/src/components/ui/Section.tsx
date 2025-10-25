import React from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'muted' | 'brand' | 'gradient';
  className?: string;
}

export function Section({ 
  children, 
  size = 'md',
  background = 'default',
  className,
  ...props 
}: SectionProps) {
  const sizeClasses = {
    sm: 'py-8 sm:py-12',
    md: 'py-12 sm:py-16',
    lg: 'py-16 sm:py-20',
    xl: 'py-20 sm:py-24',
  };

  const backgroundClasses = {
    default: 'bg-white',
    muted: 'bg-slate-50',
    brand: 'bg-amber-50',
    gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
  };

  return (
    <section
      className={cn(
        'w-full',
        sizeClasses[size],
        backgroundClasses[background],
        className
      )}
      {...props}
    >
      <div className="container-pro">
        {children}
      </div>
    </section>
  );
}