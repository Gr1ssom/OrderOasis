import React, { useMemo } from 'react';
import { Order } from '../../types/apex';
import { formatCurrency } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

interface TopCustomersProps {
  orders: Order[];
}

interface CustomerSummary {
  id: number;
  name: string;
  revenue: number;
  orderCount: number;
}

const TopCustomers: React.FC<TopCustomersProps> = ({ orders }) => {
  const topCustomers = useMemo(() => {
    // Group orders by customer
    const customerMap = new Map<number, CustomerSummary>();
    
    // Only count non-cancelled orders
    const validOrders = orders.filter(order => !order.cancelled);
    
    validOrders.forEach(order => {
      const customerId = order.buyer_id;
      const total = parseFloat(order.total);
      
      if (customerMap.has(customerId)) {
        const existing = customerMap.get(customerId)!;
        customerMap.set(customerId, {
          ...existing,
          revenue: existing.revenue + total,
          orderCount: existing.orderCount + 1
        });
      } else {
        customerMap.set(customerId, {
          id: customerId,
          name: order.buyer.name,
          revenue: total,
          orderCount: 1
        });
      }
    });
    
    // Convert map to array and sort by revenue
    return Array.from(customerMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  if (topCustomers.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Top Customers</h2>
          <Users className="text-gray-400 dark:text-gray-500" size={20} />
        </div>
        <div className="flex justify-center items-center h-48">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No customer data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Top Customers</h2>
        <Users className="text-blue-500 dark:text-blue-400" size={20} />
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {topCustomers.map((customer) => (
          <li key={customer.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{customer.orderCount} orders</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(customer.revenue.toString())}</p>
                <Link to={`/customers/${customer.id}`} className="text-sm text-blue-500 dark:text-blue-400 hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <Link to="/customers" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium">
          View All Customers →
        </Link>
      </div>
    </div>
  );
};

export default TopCustomers;