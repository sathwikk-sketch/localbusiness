export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_active: boolean;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: string;
  discount_price?: string | null;
  category_id?: number | null;
  stock_count: number;
  image_url?: string | null;
  is_featured: boolean;
  is_active: boolean;
  in_stock: boolean;
  category?: Category | null;
};

export type Offer = {
  id: number;
  title: string;
  description?: string | null;
  percentage: string;
  banner_image_url?: string | null;
  highlight_text?: string | null;
  product_id?: number | null;
  category_id?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active: boolean;
};

export type Banner = {
  id: number;
  title: string;
  subtitle?: string | null;
  image_url?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  sort_order: number;
  is_active: boolean;
};

export type BusinessProfile = {
  id: number;
  business_name: string;
  tagline: string;
  about: string;
  logo_url?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  whatsapp_number?: string | null;
  maps_embed_url?: string | null;
  hero_title: string;
  hero_subtitle: string;
  currency: string;
};

export type OrderStatus = "pending" | "confirmed" | "ready" | "delivered";

export type OrderItem = {
  id: number;
  product_id?: number | null;
  product_name: string;
  unit_price: string;
  quantity: number;
  line_total: string;
};

export type Order = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address?: string | null;
  notes?: string | null;
  subtotal: string;
  discount_total: string;
  total: string;
  status: OrderStatus;
  source: string;
  created_at: string;
  updated_at: string;
  delivered_at?: string | null;
  items: OrderItem[];
};

export type DashboardStats = {
  total_orders: number;
  pending_orders: number;
  delivered_orders: number;
  total_revenue: string;
  active_products: number;
  low_stock_products: number;
  recent_orders: Order[];
  low_stock: Product[];
};

export type StorefrontData = {
  profile: BusinessProfile;
  products: Product[];
  categories: Category[];
  offers: Offer[];
  banners: Banner[];
};

