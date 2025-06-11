import React, { useState, useEffect, useCallback } from 'react';
import { Order } from '../../types/apex';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StatusBadge from '../ui/StatusBadge';
import { Search, ChevronDown, ChevronUp, Filter, RefreshCw, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import CopyOrderButton from '../orders/CopyOrderButton';
import PickSheet from '../orders/PickSheet';
import { useOptimizedOrders } from '../../context/OptimizedOrdersContext';

interface OptimizedOrdersTableProps {
  orders: Order[];
  loading?: boolean;
  selectable?: boolean;
  selectedOrders?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
  onRefresh?: () => void;
  showLoadingIndicator?: boolean;
}

const OptimizedOrdersTable: React.FC<OptimizedOrdersTableProps> = ({ 
  orders, 
  loading = false,
  selectable = false,
  selectedOrders = [],
  onSelectionChange,
  onRefresh,
  showLoadingIndicator = true
}) => {
  const { loadOrderDetails, loadingDetails } = useOptimizedOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Order>('order_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleOrderIds, setVisibleOrderIds] = useState<Set<number>>(new Set());
  
  // Filter orders based on search term
  const filteredOrders = orders.filter(order => 
    order.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.ship_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort orders based on sort field and direction
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortField === 'order_date' || sortField === 'created_at' || sortField === 'updated_at') {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    
    if (sortField === 'subtotal' || sortField === 'total') {
      const numA = parseFloat(a[sortField]);
      const numB = parseFloat(b[sortField]);
      return sortDirection === 'asc' ? numA - numB : numB - numA;
    }
    
    const valueA = String(a[sortField]).toLowerCase();
    const valueB = String(b[sortField]).toLowerCase();
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Load details for visible orders when they come into view
  const handleOrderVisible = useCallback((orderId: number) => {
    if (!visibleOrderIds.has(orderId)) {
      setVisibleOrderIds(prev => new Set([...prev, orderId]));
      loadOrderDetails([orderId]);
    }
  }, [visibleOrderIds, loadOrderDetails]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const orderId = parseInt(entry.target.getAttribute('data-order-id') || '0');
            if (orderId) {
              handleOrderVisible(orderId);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all order rows
    const orderRows = document.querySelectorAll('[data-order-id]');
    orderRows.forEach(row => observer.observe(row));

    return () => observer.disconnect();
  }, [sortedOrders, handleOrderVisible]);
  
  const handleSort = (field: keyof Order) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectOrder = (orderId: number) => {
    if (!onSelectionChange) return;
    
    const newSelection = selectedOrders.includes(orderId)
      ? selectedOrders.filter(id => id !== orderId)
      : [...selectedOrders, orderId];
    
    onSelectionChange(newSelection);
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };
  
  const SortIcon = ({ field }: { field: keyof Order }) => {
    if (field !== sortField) return <ChevronDown className="w-4 h-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-indigo-500" /> : 
      <ChevronDown className="w-4 h-4 text-indigo-500" />;
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
          {showLoadingIndicator && loadingDetails && (
            <div className="flex items-center gap-1 text-sm text-indigo-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading details...
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2 border rounded-lg text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 border rounded-lg flex items-center gap-1 text-sm ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
            }`}
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          <button className="p-2 border rounded-lg flex items-center gap-1 text-sm">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Select</span>
                </th>
              )}
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('invoice_number')}
              >
                <div className="flex items-center gap-1">
                  Order #
                  <SortIcon field="invoice_number" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('order_date')}
              >
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon field="order_date" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('buyer_id')}
              >
                <div className="flex items-center gap-1">
                  Buyer
                  <SortIcon field="buyer_id" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center gap-1">
                  Total
                  <SortIcon field="total" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={selectable ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading orders...
                  </div>
                </td>
              </tr>
            ) : sortedOrders.length === 0 ? (
              <tr>
                <td colSpan={selectable ? 7 : 6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              sortedOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className={`${order.cancelled ? 'bg-gray-50' : ''} hover:bg-gray-50`}
                  data-order-id={order.id}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link 
                      to={`/orders/${order.id}`} 
                      className="hover:text-indigo-600 hover:underline"
                    >
                      {order.invoice_number}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.order_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.buyer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.cancelled ? (
                      <StatusBadge status="Cancelled" type="cancelled" />
                    ) : (
                      <StatusBadge status={order.order_status.name} />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {order.items && order.items.length > 0 ? (
                      <>
                        <CopyOrderButton order={order} className="mr-2" />
                        <PickSheet orders={[order]} />
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Loading...
                      </div>
                    )}
                    <Link 
                      to={`/orders/${order.id}`} 
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OptimizedOrdersTable;