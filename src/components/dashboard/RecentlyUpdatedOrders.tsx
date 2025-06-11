import React, { useMemo } from 'react';
import { Order } from '../../types/apex';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import StatusBadge from '../ui/StatusBadge';
import { Clock, TrendingUp, Edit3 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RecentlyUpdatedOrdersProps {
  orders: Order[];
}

interface UpdatedOrder extends Order {
  updateType: 'status' | 'items' | 'general';
  timeSinceUpdate: string;
}

const RecentlyUpdatedOrders: React.FC<RecentlyUpdatedOrdersProps> = ({ orders }) => {
  const getTimeSinceUpdate = (updatedAt: Date, now: Date): string => {
    const diffMs = now.getTime() - updatedAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const recentlyUpdatedOrders = useMemo(() => {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Filter orders updated in the last 7 days
    const recentOrders = orders.filter(order => {
      const updatedAt = new Date(order.updated_at);
      return updatedAt >= last7Days;
    });

    // Sort by most recently updated
    const sortedOrders = recentOrders.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );

    // Take top 10 and add update type and time info
    return sortedOrders.slice(0, 10).map(order => {
      const updatedAt = new Date(order.updated_at);
      const createdAt = new Date(order.created_at);
      
      // Determine update type based on timing and content
      let updateType: 'status' | 'items' | 'general' = 'general';
      
      // If updated very recently after creation, likely status change
      const timeDiff = updatedAt.getTime() - createdAt.getTime();
      if (timeDiff > 60000) { // More than 1 minute after creation
        if (order.order_status.name.toLowerCase().includes('process') || 
            order.order_status.name.toLowerCase().includes('ship') ||
            order.order_status.name.toLowerCase().includes('complete')) {
          updateType = 'status';
        } else if (order.items.length > 0) {
          updateType = 'items';
        }
      }

      // Calculate time since update
      const timeSinceUpdate = getTimeSinceUpdate(updatedAt, now);

      return {
        ...order,
        updateType,
        timeSinceUpdate
      } as UpdatedOrder;
    });
  }, [orders]);

  const getUpdateIcon = (updateType: string) => {
    switch (updateType) {
      case 'status':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'items':
        return <Edit3 className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUpdateDescription = (updateType: string) => {
    switch (updateType) {
      case 'status':
        return 'Status updated';
      case 'items':
        return 'Items modified';
      default:
        return 'Order updated';
    }
  };

  if (recentlyUpdatedOrders.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Recently Updated Orders</h2>
          <Clock className="text-gray-400 dark:text-gray-500" size={20} />
        </div>
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500 dark:text-gray-400 text-sm">No recent updates in the last 7 days</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Recently Updated Orders</h2>
        <Clock className="text-blue-500 dark:text-blue-400" size={20} />
      </div>
      <div className="max-h-96 overflow-y-auto">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentlyUpdatedOrders.map((order) => (
            <li key={order.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getUpdateIcon(order.updateType)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        to={`/orders/${order.id}`}
                        className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                      >
                        {order.invoice_number}
                      </Link>
                      <StatusBadge 
                        status={order.cancelled ? 'Cancelled' : order.order_status.name}
                        type={order.cancelled ? 'cancelled' : undefined}
                      />
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>{getUpdateDescription(order.updateType)}</span>
                      <span>•</span>
                      <span>{order.buyer.name}</span>
                      <span>•</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {order.timeSinceUpdate}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDateTime(order.updated_at)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <Link 
          to="/orders" 
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-medium"
        >
          View All Orders →
        </Link>
      </div>
    </div>
  );
};

export default RecentlyUpdatedOrders;