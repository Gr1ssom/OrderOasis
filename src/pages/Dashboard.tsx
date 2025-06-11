import React, { useState, useMemo } from 'react';
import { useOrders } from '../context/OrdersContext';
import { DollarSign, ShoppingBag, Users, Package, Calendar } from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import OrdersTable from '../components/dashboard/OrdersTable';
import TopProductsChart from '../components/dashboard/TopProductsChart';
import RevenueChart from '../components/dashboard/RevenueChart';
import OrderStatusChart from '../components/dashboard/OrderStatusChart';
import TopCustomers from '../components/dashboard/TopCustomers';
import RecentlyUpdatedOrders from '../components/dashboard/RecentlyUpdatedOrders';
import { formatCurrency, formatDate } from '../utils/formatters';

type DateRange = '7d' | '14d' | '30d' | '90d' | '6m' | 'weekly';

const Dashboard: React.FC = () => {
  const { orders, loading, error, refreshOrders } = useOrders();
  const [dateRange, setDateRange] = useState<DateRange>('7d');

  const getDateRangeFilter = (range: DateRange): { start: Date, end: Date } => {
    const now = new Date();
    const end = new Date(now);
    let start = new Date(now);

    if (range === 'weekly') {
      // Get last Tuesday
      const day = now.getDay();
      const diff = (day < 2 ? 7 : 0) + day - 2;
      start.setDate(now.getDate() - diff - 7);
      end.setDate(now.getDate() - diff);
    } else {
      switch (range) {
        case '7d':
          start.setDate(now.getDate() - 7);
          break;
        case '14d':
          start.setDate(now.getDate() - 14);
          break;
        case '30d':
          start.setDate(now.getDate() - 30);
          break;
        case '90d':
          start.setDate(now.getDate() - 90);
          break;
        case '6m':
          start.setMonth(now.getMonth() - 6);
          break;
      }
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const filteredOrders = useMemo(() => {
    const { start, end } = getDateRangeFilter(dateRange);
    return orders.filter(order => {
      const orderDate = new Date(order.order_date);
      return orderDate >= start && orderDate <= end;
    });
  }, [orders, dateRange]);

  // Calculate metrics
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const activeOrders = filteredOrders.filter(order => !order.cancelled).length;
  const cancelledOrders = filteredOrders.filter(order => order.cancelled).length;
  const uniqueCustomers = new Set(filteredOrders.map(order => order.buyer_id)).size;

  // Calculate weekly sales (Tue-Mon)
  const weeklySales = useMemo(() => {
    const { start, end } = getDateRangeFilter('weekly');
    const weeklyOrders = orders.filter(order => {
      const orderDate = new Date(order.order_date);
      return orderDate >= start && orderDate <= end;
    });
    return weeklyOrders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  }, [orders]);

  // Count unique products
  const uniqueProductsSet = new Set<number>();
  filteredOrders.forEach(order => {
    order.items.forEach(item => {
      uniqueProductsSet.add(item.product_id);
    });
  });
  const uniqueProducts = uniqueProductsSet.size;

  const dateRangeOptions: { value: DateRange; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '14d', label: 'Last 14 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '6m', label: 'Last 6 Months' },
    { value: 'weekly', label: 'Weekly (Tue-Mon)' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded transition-colors duration-200">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  const { start: weekStart, end: weekEnd } = getDateRangeFilter('weekly');
  const weeklyDateRange = `${formatDate(weekStart.toISOString())} - ${formatDate(weekEnd.toISOString())}`;

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
      {/* Weekly Sales Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">Weekly Sales Total (Tue-Mon)</h2>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(weeklySales.toString())}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{weeklyDateRange}</div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {formatDate(getDateRangeFilter(dateRange).start.toISOString())} - {formatDate(getDateRangeFilter(dateRange).end.toISOString())}
            </span>
          </div>
          <div className="flex space-x-2">
            {dateRangeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setDateRange(option.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${dateRange === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue.toString())}
          description="Overall revenue from all orders"
          icon={DollarSign}
          className="dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200"
        />
        <MetricCard
          title="Total Orders"
          value={totalOrders}
          description={`${activeOrders} active, ${cancelledOrders} cancelled`}
          icon={ShoppingBag}
          className="dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200"
        />
        <MetricCard
          title="Customers"
          value={uniqueCustomers}
          description="Unique customers with orders"
          icon={Users}
          className="dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200"
        />
        <MetricCard
          title="Products"
          value={uniqueProducts}
          description="Unique products ordered"
          icon={Package}
          className="dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200"
        />
      </div>
      
      {/* Recently Updated Orders */}
      <RecentlyUpdatedOrders orders={orders} />
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart orders={filteredOrders} />
        <OrderStatusChart orders={filteredOrders} />
      </div>
      
      {/* Top Products and Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsChart orders={filteredOrders} />
        <TopCustomers orders={filteredOrders} />
      </div>
      
      {/* Recent Orders */}
      <OrdersTable 
        orders={filteredOrders}
        onRefresh={refreshOrders}
      />
    </div>
  );
};

export default Dashboard;