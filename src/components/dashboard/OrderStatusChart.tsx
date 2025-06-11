import React, { useMemo } from 'react';
import { Order } from '../../types/apex';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OrderStatusChartProps {
  orders: Order[];
}

interface StatusCount {
  name: string;
  value: number;
  color: string;
}

const STATUS_COLORS = {
  'Submitted': '#3b82f6', // Blue
  'Complete': '#10b981', // Green
  'Cancelled': '#9ca3af', // Gray
  'Shipped': '#06b6d4', // Cyan
  'Processing': '#64748b', // Slate
  'Delivered': '#14b8a6', // Teal
  'Rejected': '#ef4444', // Red
  'Other': '#f59e0b', // Amber
};

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ orders }) => {
  const statusData = useMemo(() => {
    // Count orders by status
    const statusCounts = new Map<string, number>();
    
    orders.forEach(order => {
      const status = order.cancelled ? 'Cancelled' : order.order_status.name;
      
      if (statusCounts.has(status)) {
        statusCounts.set(status, statusCounts.get(status)! + 1);
      } else {
        statusCounts.set(status, 1);
      }
    });
    
    // Convert to array and format for chart
    return Array.from(statusCounts.entries()).map(([name, count]) => {
      const statusKey = Object.keys(STATUS_COLORS).find(
        key => name.toLowerCase().includes(key.toLowerCase())
      ) || 'Other';
      
      return {
        name,
        value: count,
        color: STATUS_COLORS[statusKey as keyof typeof STATUS_COLORS]
      };
    });
  }, [orders]);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded shadow-sm transition-colors duration-200">
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{payload[0].name}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Orders: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Percentage: <span className="font-semibold">
              {((payload[0].value / orders.length) * 100).toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    
    return null;
  };
  
  if (statusData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Order Status</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No status data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
      <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Order Status</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              isAnimationActive={true}
              className="text-xs text-gray-700 dark:text-gray-300"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrderStatusChart;