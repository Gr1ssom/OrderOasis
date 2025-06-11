import React, { useMemo } from 'react';
import { Order } from '../../types/apex';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface RevenueChartProps {
  orders: Order[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ orders }) => {
  const chartData = useMemo(() => {
    // Group orders by month
    const ordersByDate = new Map<string, { date: string, revenue: number, orderCount: number }>();
    
    orders.forEach(order => {
      if (order.cancelled) return; // Skip cancelled orders
      
      const date = new Date(order.order_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      const revenue = parseFloat(order.total);
      
      if (ordersByDate.has(monthYear)) {
        const existing = ordersByDate.get(monthYear)!;
        ordersByDate.set(monthYear, {
          date: monthYear,
          revenue: existing.revenue + revenue,
          orderCount: existing.orderCount + 1
        });
      } else {
        ordersByDate.set(monthYear, {
          date: monthYear,
          revenue: revenue,
          orderCount: 1
        });
      }
    });
    
    // Convert map to array and sort by date
    return Array.from(ordersByDate.values())
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
  }, [orders]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded shadow-sm transition-colors duration-200">
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            Revenue: {formatCurrency(payload[0].value.toString())}
          </p>
          <p className="text-green-600 dark:text-green-400 text-sm">
            Orders: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Revenue Trends</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No revenue data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
      <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Revenue Trends</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              tickMargin={10}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => `$${value}`} 
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-30" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              activeDot={{ r: 8 }}
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="orderCount"
              name="Order Count"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorOrders)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;