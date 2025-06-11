import React from 'react';

type StatusType = 'submitted' | 'processing' | 'shipped' | 'delivered' | 'complete' | 'cancelled' | 'rejected' | 'paid' | 'unpaid' | 'partial';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type, className = '' }) => {
  const getStatusColor = (statusType: string = ''): string => {
    const lowerStatus = statusType.toLowerCase();
    
    // Default coloring based on status text if type not provided
    if (!type) {
      if (lowerStatus.includes('submit')) return 'bg-blue-100 text-blue-800 border border-blue-200';
      if (lowerStatus.includes('process')) return 'bg-slate-100 text-slate-800 border border-slate-200';
      if (lowerStatus.includes('ship')) return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
      if (lowerStatus.includes('deliver')) return 'bg-teal-100 text-teal-800 border border-teal-200';
      if (lowerStatus.includes('complet')) return 'bg-green-100 text-green-800 border border-green-200';
      if (lowerStatus.includes('cancel')) return 'bg-gray-100 text-gray-800 border border-gray-200';
      if (lowerStatus.includes('reject')) return 'bg-red-100 text-red-800 border border-red-200';
      if (lowerStatus.includes('paid')) return 'bg-green-100 text-green-800 border border-green-200';
      if (lowerStatus.includes('unpaid')) return 'bg-amber-100 text-amber-800 border border-amber-200';
      if (lowerStatus.includes('partial')) return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
    
    // Use type if provided
    switch (type) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'processing':
        return 'bg-slate-100 text-slate-800 border border-slate-200';
      case 'shipped':
        return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
      case 'delivered':
        return 'bg-teal-100 text-teal-800 border border-teal-200';
      case 'complete':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'unpaid':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;