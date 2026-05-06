import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: string;
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col", className)}>
      <div className="flex items-center gap-4 mb-4 text-[var(--accent-gold)]">
        <div className="p-3 bg-[var(--accent-gold)]/10 rounded-xl">
          {icon}
        </div>
        <h3 className="font-medium text-gray-600">{title}</h3>
      </div>
      
      <div className="mt-auto">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span className="ml-2 text-sm text-gray-500 font-medium">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
