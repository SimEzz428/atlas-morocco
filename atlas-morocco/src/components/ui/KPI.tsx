import React from 'react';
import { cn } from '@/lib/utils';

interface KPIProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'brand' | 'accent';
  className?: string;
}

export function KPI({ 
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default',
  className,
  ...props 
}: KPIProps) {
  const variantClasses = {
    default: 'bg-white border-slate-200',
    brand: 'bg-amber-50 border-amber-200',
    accent: 'bg-blue-50 border-blue-200',
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-slate-600',
  };

  return (
    <div
      className={cn(
        'card card-pad-sm border',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-500">{subtitle}</p>
          )}
          {trend && trendValue && (
            <p className={cn('text-sm font-medium mt-1', trendClasses[trend])}>
              {trend === 'up' && '↗'} {trend === 'down' && '↘'} {trendValue}
            </p>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
