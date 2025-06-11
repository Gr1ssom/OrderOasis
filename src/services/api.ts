import { ApiResponse } from '../types/apex';

const API_URL = '/api/v1';
const TOKEN = '135|FUDNsfiF8QuB7vMTvRWMwBn0sOCyiF5EftWmczTI';

const headers = {
  'Authorization': `Bearer ${TOKEN}`,
  'Accept': 'application/json'
};

export const fetchOrders = async (
  updatedAtFrom: string = '1970-04-20T22:04:50Z',
  updatedAtTo: string = new Date().toISOString(),
  withItems: boolean = true,
  perPage: number = 500, // Increased from 100 to 500
  page: number = 1
): Promise<ApiResponse> => {
  const url = new URL(`${API_URL}/shipping-orders`, window.location.origin);
  
  // Add query parameters
  url.searchParams.append('updated_at_from', updatedAtFrom);
  url.searchParams.append('updated_at_to', updatedAtTo);
  url.searchParams.append('with_items', withItems.toString());
  url.searchParams.append('per_page', perPage.toString());
  url.searchParams.append('page', page.toString());
  
  try {
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// New function to fetch all orders with pagination
export const fetchAllOrders = async (
  updatedAtFrom: string = '1970-04-20T22:04:50Z',
  updatedAtTo: string = new Date().toISOString(),
  withItems: boolean = true
): Promise<ApiResponse> => {
  let allOrders: any[] = [];
  let currentPage = 1;
  let hasMorePages = true;
  const perPage = 500; // Fetch 500 orders per page

  while (hasMorePages) {
    try {
      const response = await fetchOrders(updatedAtFrom, updatedAtTo, withItems, perPage, currentPage);
      
      allOrders = [...allOrders, ...response.orders];
      
      // Check if there are more pages
      hasMorePages = response.meta.current_page < response.meta.last_page;
      currentPage++;
      
      console.log(`Fetched page ${response.meta.current_page} of ${response.meta.last_page} (${allOrders.length} total orders)`);
      
    } catch (error) {
      console.error(`Error fetching page ${currentPage}:`, error);
      break;
    }
  }

  // Return the combined result in the same format as the original API
  return {
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
};

export const fetchOrderById = async (id: number): Promise<ApiResponse> => {
  const url = new URL(`${API_URL}/shipping-orders`, window.location.origin);
  url.searchParams.append('ids[]', id.toString());
  url.searchParams.append('with_items', 'true');
  
  try {
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching order #${id}:`, error);
    throw error;
  }
};

export const fetchOrdersByInvoiceNumber = async (invoiceNumber: string): Promise<ApiResponse> => {
  const url = new URL(`${API_URL}/shipping-orders`, window.location.origin);
  url.searchParams.append('invoice_number', invoiceNumber);
  url.searchParams.append('with_items', 'true');
  
  try {
    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching order ${invoiceNumber}:`, error);
    throw error;
  }
};