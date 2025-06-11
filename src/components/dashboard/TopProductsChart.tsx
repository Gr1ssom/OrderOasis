import React, { useMemo } from 'react';
import { Order } from '../../types/apex';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface TopProductsChartProps {
  orders: Order[];
}

interface ProductSummary {
  name: string;
  revenue: number;
  quantity: number;
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({ orders }) => {
  const topProducts = useMemo(() => {
    const productMap = new Map<string, ProductSummary>();
    
    // Only count non-cancelled orders
    const validOrders = orders.filter(order => !order.cancelled);
    
    validOrders.forEach(order => {
      order.items.forEach(item => {
        // Truncate product name to 20 characters + ellipsis if needed
        const productName = item.product_name.length > 20 
          ? item.product_name.substring(0, 20) + '...' 
          : item.product_name;
          
        const orderPrice = parseFloat(item.order_price);
        const totalRevenue = orderPrice * item.order_quantity;
        
        if (productMap.has(productName)) {
          const existing = productMap.get(productName)!;
          productMap.set(productName, {
            name: productName,
            revenue: existing.revenue + totalRevenue,
            quantity: existing.quantity + item.order_quantity
          });
        } else {
          productMap.set(productName, {
            name: productName,
            revenue: totalRevenue,
            quantity: item.order_quantity
          });
        }
      });
    });
    
    // Convert map to array and sort by revenue
    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
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
            Quantity: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (topProducts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Top Products</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No product data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
      <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">Top Products by Revenue</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topProducts}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} className="opacity-30" />
            <XAxis 
              type="number" 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={150}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} />
            <Bar 
              name="Revenue ($)" 
              dataKey="revenue" 
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
            />
            <Bar 
              name="Quantity" 
              dataKey="quantity" 
              fill="#10b981" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart;