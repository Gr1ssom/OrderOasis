export interface ApiResponse {
  orders: Order[];
  links: Links;
  meta: Meta;
}

export interface Links {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface Meta {
  current_page: number;
  from: number;
  last_page: number;
  links: Link[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface Link {
  url: string | null;
  label: string;
  active: boolean;
}

export interface Order {
  id: number;
  uuid: string;
  invoice_number: string;
  subtotal: string;
  total: string;
  excise_tax: string;
  excise_tax_percentage: string | null;
  additional_discount: string;
  delivery_cost: string;
  cultivation_tax: string;
  cultivation_tax_percentage: string | null;
  order_date: string;
  created_by: string;
  operation_id: number | null;
  order_status_id: number;
  cancelled: boolean;
  deal_flow_id: number;
  net_terms_id: number | null;
  pricing_tier_id: number | null;
  delivery_date: string | null;
  due_date: string | null;
  estimated_departure_date: string | null;
  estimated_arrival_date: string | null;
  manifest_number: string | null;
  invoice_note: string | null;
  shipping_method: string | null;
  ship_name: string;
  ship_line_one: string;
  ship_line_two: string | null;
  ship_city: string;
  ship_state: string;
  ship_zip: string;
  ship_country: string;
  ship_from_name: string;
  ship_from_line_one: string;
  ship_from_line_two: string | null;
  ship_from_city: string;
  ship_from_state: string;
  ship_from_zip: string;
  ship_from_country: string;
  turnaround_time: string | null;
  ship_tracking_number: string | null;
  ship_receiving_details: string | null;
  total_payments: string;
  total_credits: string;
  payment_status: string;
  payments_currently_due: string;
  total_write_offs: string;
  total_trades: string;
  backorder: boolean;
  backorder_status: string | null;
  buyer_note: string | null;
  seller_company_id: number;
  buyer_id: number;
  buyer_company_id: number | null;
  buyer_contact_name: string | null;
  buyer_contact_phone: string | null;
  buyer_contact_email: string | null;
  buyer_state_license: string;
  buyer_location_id: number;
  created_at: string;
  updated_at: string;
  transporters: any[];
  buyer: Buyer;
  term: Term | null;
  order_status: OrderStatus;
  sales_reps: SalesRep[];
  items: OrderItem[];
}

export interface Buyer {
  id: number;
  name: string;
}

export interface Term {
  name: string;
}

export interface OrderStatus {
  id: number;
  name: string;
  payment_percentage: number;
  archived: boolean;
  position: number;
  parent_status: ParentStatus;
}

export interface ParentStatus {
  id: number;
  name: string;
}

export interface SalesRep {
  name: string;
  phone: string;
  email: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  operation_id: number;
  brand_id: number;
  product_category_id: number;
  order_quantity: number;
  order_price: string;
  listing_price: string;
  product_type_id: number;
  product_id: number;
  batch_id: number;
  order_sample: number;
  sample_quantity_label: string | null;
  sample_quantity_pulled_from_inventory: number;
  sample_size: number;
  bulk_discounts_enabled: boolean;
  note: string | null;
  tiered_surcharge: string | null;
  metrc_package_label: string | null;
  operation_license: string;
  product_sku: string;
  description: string;
  ingredients: string;
  product_cultivar_id: number | null;
  product_cultivar_type_id: number | null;
  predominate_canabinoid_id: number;
  predominate_canabinoid_min_or_only: number;
  predominate_canabinoid_max: number | null;
  predominate_canabinoid_unit: string;
  thc_limit: boolean;
  product_name: string;
  batch_name: string;
  created_at: string;
  updated_at: string;
  unit_price: {
    packagePrice: string;
    singlesPrice: string;
    unitSizePrice?: string;
    prerollGramsPrice?: string;
  };
  operation: {
    id: number;
    name: string;
    industry: string | null;
    state_license: string;
  };
  product_category: {
    id: number;
    name: string;
    short_display_name: string;
    long_display_name: string;
  };
  brand: {
    id: number;
    name: string;
  };
  product_type: {
    id: number;
    name: string;
    product_category_id: number;
    company_id: number | null;
  };
  modifiers: OrderItemModifier[];
  cultivar?: {
    id: number;
    name: string;
  };
  cultivar_type?: {
    id: number;
    name: string;
  };
  images: ItemImage[];
  additional_cannabinoids: Cannabinoid[];
  terpenes: Terpene[];
}

export interface OrderItemModifier {
  amount: string;
  type: string;
  bulk_discount: boolean;
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface ItemImage {
  id: number;
  sort_order: number;
  link: string;
  created_at: string;
}

export interface Cannabinoid {
  id: number;
  batch_cannabinoid_id: number;
  batch_id: number;
  product_id: number;
  name: string;
  abbreviation: string;
  display_name: string;
  measurement: string;
  measurement_type: string;
}

export interface Terpene {
  id: number;
  batch_terpene_id: number;
  batch_id: number;
  product_id: number;
  name: string;
  display_name: string;
  measurement: string;
  measurement_type: string;
}