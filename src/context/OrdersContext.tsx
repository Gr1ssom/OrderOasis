import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, ApiResponse } from '../types/apex';
import { fetchAllOrders } from '../services/api';

interface OrdersContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
  cancelledOrders: number;
  refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [activeOrders, setActiveOrders] = useState<number>(0);
  const [cancelledOrders, setCancelledOrders] = useState<number>(0);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting to fetch all orders...');
      const response: ApiResponse = await fetchAllOrders();
      const orderData = response.orders;
      
      console.log(`Successfully loaded ${orderData.length} orders`);
      setOrders(orderData);
      setTotalOrders(orderData.length);
      
      // Calculate metrics
      const revenue = orderData.reduce((sum, order) => sum + parseFloat(order.total), 0);
      setTotalRevenue(revenue);
      
      const active = orderData.filter(order => !order.cancelled).length;
      setActiveOrders(active);
      
      const cancelled = orderData.filter(order => order.cancelled).length;
      setCancelledOrders(cancelled);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const refreshOrders = async () => {
    await loadOrders();
  };

  return (
    <OrdersContext.Provider value={{
      orders,
      loading,
      error,
      totalOrders,
      totalRevenue,
      activeOrders,
      cancelledOrders,
      refreshOrders
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = (): OrdersContextType => {
  const context = useContext(OrdersContext);
  
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  
  return context;
};