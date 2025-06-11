import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Order, ApiResponse } from '../types/apex';
import { optimizedApiService } from '../services/apiOptimized';

interface OptimizedOrdersContextType {
  orders: Order[];
  ordersSummary: Order[];
  loading: boolean;
  loadingDetails: boolean;
  error: string | null;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  cancelledOrders: number;
  refreshOrders: () => Promise<void>;
  loadOrderDetails: (orderIds: number[]) => Promise<void>;
  getOrderById: (id: number) => Order | undefined;
  cacheStats: { size: number; keys: string[] };
}

const OptimizedOrdersContext = createContext<OptimizedOrdersContextType | undefined>(undefined);

export const OptimizedOrdersProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [ordersSummary, setOrdersSummary] = useState<Order[]>([]);
  const [ordersWithDetails, setOrdersWithDetails] = useState<Map<number, Order>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheStats, setCacheStats] = useState({ size: 0, keys: [] });

  // Computed values
  const orders = React.useMemo(() => {
    return ordersSummary.map(summary => {
      const detailed = ordersWithDetails.get(summary.id);
      return detailed || summary;
    });
  }, [ordersSummary, ordersWithDetails]);

  const totalOrders = ordersSummary.length;
  const totalRevenue = ordersSummary.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const activeOrders = ordersSummary.filter(order => !order.cancelled).length;
  const cancelledOrders = ordersSummary.filter(order => order.cancelled).length;

  // Load orders summary (fast initial load) - now fetches ALL orders
  const loadOrdersSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting to fetch all orders summary...');
      const response: ApiResponse = await optimizedApiService.fetchOrdersSummary({ 
        fetchAll: true // Fetch all orders with pagination
      });
      
      console.log(`Successfully loaded ${response.orders.length} orders`);
      setOrdersSummary(response.orders);
      setCacheStats(optimizedApiService.getCacheStats());
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load detailed order data progressively
  const loadOrderDetails = useCallback(async (orderIds: number[]) => {
    // Filter out orders we already have details for
    const missingIds = orderIds.filter(id => !ordersWithDetails.has(id));
    
    if (missingIds.length === 0) return;

    try {
      setLoadingDetails(true);
      const detailedOrders = await optimizedApiService.fetchOrdersWithItems(missingIds);
      
      setOrdersWithDetails(prev => {
        const newMap = new Map(prev);
        detailedOrders.forEach(order => {
          newMap.set(order.id, order);
        });
        return newMap;
      });
      
      setCacheStats(optimizedApiService.getCacheStats());
      
    } catch (err) {
      console.error('Error loading order details:', err);
    } finally {
      setLoadingDetails(false);
    }
  }, [ordersWithDetails]);

  // Get order by ID (with automatic detail loading)
  const getOrderById = useCallback(async (id: number): Promise<Order | undefined> => {
    const existing = ordersWithDetails.get(id);
    if (existing) return existing;

    // Load details if not available
    await loadOrderDetails([id]);
    return ordersWithDetails.get(id);
  }, [ordersWithDetails, loadOrderDetails]);

  // Refresh all data
  const refreshOrders = useCallback(async () => {
    optimizedApiService.clearCache();
    setOrdersWithDetails(new Map());
    await loadOrdersSummary();
  }, [loadOrdersSummary]);

  // Initial load
  useEffect(() => {
    loadOrdersSummary();
  }, [loadOrdersSummary]);

  // Auto-load details for visible orders (first 50 now that we have more orders)
  useEffect(() => {
    if (ordersSummary.length > 0) {
      const visibleOrderIds = ordersSummary.slice(0, 50).map(order => order.id);
      loadOrderDetails(visibleOrderIds);
    }
  }, [ordersSummary, loadOrderDetails]);

  return (
    <OptimizedOrdersContext.Provider value={{
      orders,
      ordersSummary,
      loading,
      loadingDetails,
      error,
      totalOrders,
      totalRevenue,
      activeOrders,
      cancelledOrders,
      refreshOrders,
      loadOrderDetails,
      getOrderById,
      cacheStats
    }}>
      {children}
    </OptimizedOrdersContext.Provider>
  );
};

export const useOptimizedOrders = (): OptimizedOrdersContextType => {
  const context = useContext(OptimizedOrdersContext);
  
  if (context === undefined) {
    throw new Error('useOptimizedOrders must be used within an OptimizedOrdersProvider');
  }
  
  return context;
};