import { ApiResponse, Order } from '../types/apex';

// Enhanced API service with caching and optimization
class OptimizedApiService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly API_URL = '/api/v1';
  private readonly TOKEN = '135|FUDNsfiF8QuB7vMTvRWMwBn0sOCyiF5EftWmczTI';
  
  private readonly headers = {
    'Authorization': `Bearer ${this.TOKEN}`,
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br'
  };

  // Cache management
  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}_${JSON.stringify(params)}`;
  }

  private isValidCache(cacheEntry: any): boolean {
    return Date.now() - cacheEntry.timestamp < cacheEntry.ttl;
  }

  private setCache(key: string, data: any, ttl: number = this.CACHE_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private getCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (entry && this.isValidCache(entry)) {
      return entry.data;
    }
    if (entry) {
      this.cache.delete(key);
    }
    return null;
  }

  // Optimized order fetching with progressive loading and pagination
  async fetchOrdersSummary(params: {
    updatedAtFrom?: string;
    updatedAtTo?: string;
    perPage?: number;
    page?: number;
    fetchAll?: boolean;
  } = {}): Promise<ApiResponse> {
    const defaultParams = {
      updated_at_from: '1970-04-20T22:04:50Z',
      updated_at_to: new Date().toISOString(),
      with_items: 'false', // Load summary first
      per_page: 500, // Increased from 100 to 500
      page: 1,
      fetchAll: false,
      ...params
    };

    // If fetchAll is true, get all orders with pagination
    if (defaultParams.fetchAll) {
      return this.fetchAllOrdersSummary(defaultParams);
    }

    const cacheKey = this.getCacheKey('orders-summary', defaultParams);
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const url = new URL(`${this.API_URL}/shipping-orders`, window.location.origin);
    Object.entries(defaultParams).forEach(([key, value]) => {
      if (key !== 'fetchAll') {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString(), { 
        headers: this.headers,
        signal: AbortSignal.timeout(60000) // Increased timeout for larger datasets
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching orders summary:', error);
      throw error;
    }
  }

  // Fetch all orders with pagination
  private async fetchAllOrdersSummary(params: any): Promise<ApiResponse> {
    const cacheKey = this.getCacheKey('all-orders-summary', { 
      updatedAtFrom: params.updated_at_from,
      updatedAtTo: params.updated_at_to 
    });
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    let allOrders: any[] = [];
    let currentPage = 1;
    let hasMorePages = true;
    let totalMeta: any = null;

    while (hasMorePages) {
      try {
        const pageParams = { ...params, page: currentPage, fetchAll: false };
        const response = await this.fetchOrdersSummary(pageParams);
        
        allOrders = [...allOrders, ...response.orders];
        totalMeta = response.meta;
        
        // Check if there are more pages
        hasMorePages = response.meta.current_page < response.meta.last_page;
        currentPage++;
        
        console.log(`Fetched page ${response.meta.current_page} of ${response.meta.last_page} (${allOrders.length} total orders)`);
        
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error);
        break;
      }
    }

    // Create combined response
    const combinedResponse: ApiResponse = {
      orders: allOrders,
      links: {
        first: '',
        last: '',
        prev: null,
        next: null
      },
      meta: {
        current_page: 1,
        from: 1,
        last_page: 1,
        links: [],
        path: '',
        per_page: allOrders.length,
        to: allOrders.length,
        total: allOrders.length
      }
    };

    // Cache the combined result for longer
    this.setCache(cacheKey, combinedResponse, this.CACHE_TTL * 2);
    return combinedResponse;
  }

  // Fetch detailed order data in batches
  async fetchOrdersWithItems(orderIds: number[]): Promise<Order[]> {
    const batchSize = 50; // Increased batch size from 20 to 50
    const batches = [];
    
    for (let i = 0; i < orderIds.length; i += batchSize) {
      batches.push(orderIds.slice(i, i + batchSize));
    }

    const results = await Promise.allSettled(
      batches.map(batch => this.fetchOrderBatch(batch))
    );

    const orders: Order[] = [];
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        orders.push(...result.value);
      }
    });

    return orders;
  }

  private async fetchOrderBatch(orderIds: number[]): Promise<Order[]> {
    const cacheKey = this.getCacheKey('orders-batch', { ids: orderIds });
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const url = new URL(`${this.API_URL}/shipping-orders`, window.location.origin);
    orderIds.forEach(id => url.searchParams.append('ids[]', id.toString()));
    url.searchParams.append('with_items', 'true');

    try {
      const response = await fetch(url.toString(), { 
        headers: this.headers,
        signal: AbortSignal.timeout(120000) // Increased timeout for larger batches
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      this.setCache(cacheKey, data.orders, this.CACHE_TTL * 2); // Cache detailed data longer
      return data.orders;
    } catch (error) {
      console.error('Error fetching order batch:', error);
      throw error;
    }
  }

  // Fetch single order with caching
  async fetchOrderById(id: number): Promise<Order | null> {
    const cacheKey = this.getCacheKey('order-detail', { id });
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const url = new URL(`${this.API_URL}/shipping-orders`, window.location.origin);
    url.searchParams.append('ids[]', id.toString());
    url.searchParams.append('with_items', 'true');

    try {
      const response = await fetch(url.toString(), { headers: this.headers });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      const order = data.orders[0] || null;
      this.setCache(cacheKey, order);
      return order;
    } catch (error) {
      console.error(`Error fetching order #${id}:`, error);
      throw error;
    }
  }

  // Clear cache manually
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const optimizedApiService = new OptimizedApiService();

// Backward compatibility exports with increased limits
export const fetchOrders = (
  updatedAtFrom?: string,
  updatedAtTo?: string,
  withItems?: boolean,
  perPage?: number,
  page?: number
) => optimizedApiService.fetchOrdersSummary({
  updatedAtFrom,
  updatedAtTo,
  perPage: perPage || 500, // Default to 500 instead of 100
  page,
  fetchAll: false
});

// New export for fetching all orders
export const fetchAllOrders = (
  updatedAtFrom?: string,
  updatedAtTo?: string,
  withItems?: boolean
) => optimizedApiService.fetchOrdersSummary({
  updatedAtFrom,
  updatedAtTo,
  fetchAll: true
});

export const fetchOrderById = async (id: number) => {
  const order = await optimizedApiService.fetchOrderById(id);
  return { orders: order ? [order] : [] };
};