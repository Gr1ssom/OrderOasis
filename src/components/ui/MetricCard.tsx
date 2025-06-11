import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className = '' 
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all hover:shadow-md duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        {Icon && (
          <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400">
            <Icon size={18} />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        
        {trend && (
          <span className={`ml-2 text-sm font-medium ${
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.isPositive ? '+' : '−'}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      
      {description && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default MetricCard;