import React, { useState } from 'react';
import { useOrders } from '../context/OrdersContext';
import OrdersTable from '../components/dashboard/OrdersTable';
import PickSheet from '../components/orders/PickSheet';
import { X, Filter } from 'lucide-react';

function Orders() {
  const { orders, loading, refreshOrders } = useOrders();
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPaymentStatuses, setSelectedPaymentStatuses] = useState<string[]>([]);
  const [selectedShippingMethods, setSelectedShippingMethods] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique statuses from orders
  const availableStatuses = React.useMemo(() => {
    const statusSet = new Set<string>();
    orders.forEach(order => {
      statusSet.add(order.cancelled ? 'Cancelled' : order.order_status.name);
    });
    return Array.from(statusSet).sort();
  }, [orders]);

  // Get unique payment statuses
  const availablePaymentStatuses = React.useMemo(() => {
    const statusSet = new Set<string>();
    orders.forEach(order => {
      statusSet.add(order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1));
    });
    return Array.from(statusSet).sort();
  }, [orders]);

  // Get unique shipping methods
  const availableShippingMethods = React.useMemo(() => {
    const methodSet = new Set<string>();
    orders.forEach(order => {
      if (order.shipping_method) {
        methodSet.add(order.shipping_method);
      }
    });
    return Array.from(methodSet).sort();
  }, [orders]);

  // Filter orders based on all selected filters
  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      const orderStatus = order.cancelled ? 'Cancelled' : order.order_status.name;
      const paymentStatus = order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1);
      
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(orderStatus);
      const matchesPayment = selectedPaymentStatuses.length === 0 || selectedPaymentStatuses.includes(paymentStatus);
      const matchesShipping = selectedShippingMethods.length === 0 || 
        (order.shipping_method && selectedShippingMethods.includes(order.shipping_method));

      return matchesStatus && matchesPayment && matchesShipping;
    });
  }, [orders, selectedStatuses, selectedPaymentStatuses, selectedShippingMethods]);

  const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const togglePaymentStatus = (status: string) => {
    setSelectedPaymentStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const toggleShippingMethod = (method: string) => {
    setSelectedShippingMethods(prev => 
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const clearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedPaymentStatuses([]);
    setSelectedShippingMethods([]);
  };

  const getStatusColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('submit')) return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700';
    if (lowerStatus.includes('process')) return 'bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700';
    if (lowerStatus.includes('ship')) return 'bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-700';
    if (lowerStatus.includes('deliver')) return 'bg-teal-100 text-teal-800 border border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-700';
    if (lowerStatus.includes('complet')) return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
    if (lowerStatus.includes('cancel')) return 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    if (lowerStatus.includes('reject')) return 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
    if (lowerStatus.includes('paid')) return 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700';
    if (lowerStatus.includes('unpaid')) return 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700';
    if (lowerStatus.includes('partial')) return 'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
    return 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
  };

  const hasActiveFilters = selectedStatuses.length > 0 || 
    selectedPaymentStatuses.length > 0 || 
    selectedShippingMethods.length > 0;

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 min-h-full transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear all filters
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="space-y-6">
            {/* Order Status Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Status</h3>
              <div className="flex flex-wrap gap-2">
                {availableStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`
                      inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                      transition-all duration-200 hover:shadow-sm
                      ${getStatusColor(status)}
                      ${selectedStatuses.includes(status) 
                        ? 'shadow-sm ring-2 ring-blue-200 dark:ring-blue-700' 
                        : 'opacity-70 hover:opacity-100'
                      }
                    `}
                  >
                    {status}
                    {selectedStatuses.includes(status) && (
                      <X className="ml-1.5 h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Status Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Payment Status</h3>
              <div className="flex flex-wrap gap-2">
                {availablePaymentStatuses.map(status => (
                  <button
                    key={status}
                    onClick={() => togglePaymentStatus(status)}
                    className={`
                      inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                      transition-all duration-200 hover:shadow-sm
                      ${getStatusColor(status)}
                      ${selectedPaymentStatuses.includes(status) 
                        ? 'shadow-sm ring-2 ring-blue-200 dark:ring-blue-700' 
                        : 'opacity-70 hover:opacity-100'
                      }
                    `}
                  >
                    {status}
                    {selectedPaymentStatuses.includes(status) && (
                      <X className="ml-1.5 h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping Method Filters */}
            {availableShippingMethods.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Shipping Method</h3>
                <div className="flex flex-wrap gap-2">
                  {availableShippingMethods.map(method => (
                    <button
                      key={method}
                      onClick={() => toggleShippingMethod(method)}
                      className={`
                        inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                        transition-all duration-200 hover:shadow-sm
                        bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700
                        ${selectedShippingMethods.includes(method) 
                          ? 'shadow-sm ring-2 ring-blue-200 dark:ring-blue-700' 
                          : 'opacity-70 hover:opacity-100'
                        }
                      `}
                    >
                      {method}
                      {selectedShippingMethods.includes(method) && (
                        <X className="ml-1.5 h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing orders with:
              {selectedStatuses.length > 0 && (
                <span className="font-medium"> Status: {selectedStatuses.join(', ')}</span>
              )}
              {selectedPaymentStatuses.length > 0 && (
                <span className="font-medium">{selectedStatuses.length > 0 ? ' |' : ''} Payment: {selectedPaymentStatuses.join(', ')}</span>
              )}
              {selectedShippingMethods.length > 0 && (
                <span className="font-medium">{(selectedStatuses.length > 0 || selectedPaymentStatuses.length > 0) ? ' |' : ''} Shipping: {selectedShippingMethods.join(', ')}</span>
              )}
            </p>
          </div>
        )}
      </div>

      {selectedOrders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center justify-between transition-colors duration-200">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedOrders.length} orders selected
          </span>
          <PickSheet orders={selectedOrdersData} />
        </div>
      )}

      <OrdersTable 
        orders={filteredOrders} 
        loading={loading}
        selectable
        selectedOrders={selectedOrders}
        onSelectionChange={setSelectedOrders}
        onRefresh={refreshOrders}
      />
    </div>
  );
}

export default Orders;