import React from 'react';
import { useOrders } from '../context/OrdersContext';
import { BarChart3, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

function Analytics() {
  const { orders } = useOrders();

  // Calculate monthly revenue data
  const monthlyData = orders.reduce((acc, order) => {
    const date = new Date(order.order_date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = {
        month: monthYear,
        revenue: 0,
        orders: 0,
        averageOrderValue: 0,
      };
    }
    
    acc[monthYear].revenue += parseFloat(order.total);
    acc[monthYear].orders += 1;
    acc[monthYear].averageOrderValue = acc[monthYear].revenue / acc[monthYear].orders;
    
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData).sort((a: any, b: any) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  });

  // Calculate product category data
  const categoryData = orders.reduce((acc, order) => {
    order.items.forEach(item => {
      const category = item.product_category.name;
      if (!acc[category]) {
        acc[category] = {
          category,
          revenue: 0,
          quantity: 0,
        };
      }
      acc[category].revenue += parseFloat(item.order_price) * item.order_quantity;
      acc[category].quantity += item.order_quantity;
    });
    return acc;
  }, {});

  const categoryChartData = Object.values(categoryData).sort((a: any, b: any) => 
    b.revenue - a.revenue
  );

  // Calculate key metrics
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalRevenue / totalOrders;
  const uniqueCustomers = new Set(orders.map(order => order.buyer_id)).size;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded shadow-sm transition-colors duration-200">
          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Revenue') ? formatCurrency(entry.value.toString()) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(totalRevenue.toString())}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalOrders}</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
              <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Order Value</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(averageOrderValue.toString())}</p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unique Customers</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{uniqueCustomers}</p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Revenue Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-30" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`} 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6' }}
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Category Performance</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="opacity-30" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toLocaleString()}`} 
                tick={{ fontSize: 12, fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="revenue" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                name="Revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;