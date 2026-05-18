import type {
  Banner,
  BusinessProfile,
  Category,
  DashboardStats,
  Offer,
  Order,
  OrderStatus,
  Product,
  StorefrontData
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit & { token?: string }) {
  const headers = new Headers(init?.headers);
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: init?.cache ?? "no-store"
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(detail.detail ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }
  return response.json() as Promise<T>;
}

export const api = {
  async storefront(): Promise<StorefrontData> {
    const fallback = demoStorefront;
    try {
      const [profile, products, categories, offers, banners] = await Promise.all([
        request<BusinessProfile>("/api/content/profile"),
        request<Product[]>("/api/products?limit=100"),
        request<Category[]>("/api/categories"),
        request<Offer[]>("/api/offers"),
        request<Banner[]>("/api/content/banners")
      ]);
      return { profile, products, categories, offers, banners };
    } catch {
      return fallback;
    }
  },
  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set("username", email);
    body.set("password", password);
    return request<{ access_token: string; token_type: string }>("/api/auth/login", {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
  },
  products(token: string) {
    return request<Product[]>("/api/products?include_inactive=true&limit=200", { token });
  },
  saveProduct(
    token: string,
    product: {
      id?: number;
      name: string;
      description?: string | null;
      price: string | number;
      discount_price?: string | number | null;
      category_id?: number | null;
      stock_count: number;
      image_url?: string | null;
      is_featured?: boolean;
      is_active?: boolean;
    }
  ) {
    const body = JSON.stringify(product);
    if (product.id) {
      return request<Product>(`/api/products/${product.id}`, { method: "PUT", body, token });
    }
    return request<Product>("/api/products", { method: "POST", body, token });
  },
  categories(token?: string) {
    return request<Category[]>("/api/categories", token ? { token } : undefined);
  },
  saveCategory(token: string, category: { name: string; description?: string | null; image_url?: string | null; is_active?: boolean }) {
    return request<Category>("/api/categories", {
      method: "POST",
      token,
      body: JSON.stringify(category)
    });
  },
  orders(token: string, status?: OrderStatus, search?: string) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    return request<Order[]>(`/api/orders?${params.toString()}`, { token });
  },
  updateOrderStatus(token: string, id: number, status: OrderStatus) {
    return request<Order>(`/api/orders/${id}/status`, {
      method: "PATCH",
      token,
      body: JSON.stringify({ status })
    });
  },
  offers(token: string) {
    return request<Offer[]>("/api/offers?active_only=false", { token });
  },
  banners(token: string) {
    return request<Banner[]>("/api/content/banners?active_only=false", { token });
  },
  saveBanner(token: string, banner: Partial<Banner> & { title: string }) {
    const body = JSON.stringify(banner);
    if (banner.id) {
      return request<Banner>(`/api/content/banners/${banner.id}`, { method: "PUT", body, token });
    }
    return request<Banner>("/api/content/banners", { method: "POST", body, token });
  },
  saveOffer(
    token: string,
    offer: {
      id?: number;
      title: string;
      description?: string | null;
      percentage: string | number;
      highlight_text?: string | null;
      banner_image_url?: string | null;
      is_active?: boolean;
    }
  ) {
    const body = JSON.stringify(offer);
    if (offer.id) {
      return request<Offer>(`/api/offers/${offer.id}`, { method: "PUT", body, token });
    }
    return request<Offer>("/api/offers", { method: "POST", body, token });
  },
  profile(token: string) {
    return request<BusinessProfile>("/api/content/profile", { token });
  },
  updateProfile(token: string, profile: Partial<BusinessProfile>) {
    return request<BusinessProfile>("/api/content/profile", {
      method: "PUT",
      token,
      body: JSON.stringify(profile)
    });
  },
  dashboard(token: string) {
    return request<DashboardStats>("/api/dashboard/stats", { token });
  },
  upload(token: string, file: File) {
    const body = new FormData();
    body.set("file", file);
    return request<{ url: string }>("/api/content/uploads", {
      method: "POST",
      token,
      body
    });
  },
  createOrder(payload: unknown) {
    return request<{ order: Order; whatsapp_url?: string | null; whatsapp_message: string }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};

export const demoStorefront: StorefrontData = {
  profile: {
    id: 1,
    business_name: "FreshMart Local",
    tagline: "Fresh products, local service, fast WhatsApp ordering.",
    about:
      "FreshMart Local is a modern neighborhood store for groceries, bakery essentials, personal care, and seasonal items. Customers can browse live stock, discover offers, and send orders directly to WhatsApp.",
    phone: "+91 98765 43210",
    email: "hello@freshmart.local",
    address: "Market Road, Your City",
    whatsapp_number: "919876543210",
    maps_embed_url: "https://www.google.com/maps?q=India&output=embed",
    hero_title: "Your neighborhood store, ready online",
    hero_subtitle:
      "Browse products, check stock, add items to cart, and send your order to WhatsApp in seconds.",
    currency: "INR"
  },
  categories: [
    { id: 1, name: "Groceries", slug: "groceries", is_active: true },
    { id: 2, name: "Bakery", slug: "bakery", is_active: true },
    { id: 3, name: "Pharmacy", slug: "pharmacy", is_active: true },
    { id: 4, name: "Fashion", slug: "fashion", is_active: true }
  ],
  products: [
    {
      id: 1,
      name: "Organic Milk 1L",
      slug: "organic-milk-1l",
      description: "Fresh toned milk delivered every morning.",
      price: "72",
      discount_price: "65",
      category_id: 1,
      stock_count: 42,
      image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",
      is_featured: true,
      is_active: true,
      in_stock: true,
      category: { id: 1, name: "Groceries", slug: "groceries", is_active: true }
    },
    {
      id: 2,
      name: "Whole Wheat Bread",
      slug: "whole-wheat-bread",
      description: "Soft bakery loaf with whole wheat flour.",
      price: "55",
      category_id: 2,
      stock_count: 24,
      image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
      is_featured: true,
      is_active: true,
      in_stock: true,
      category: { id: 2, name: "Bakery", slug: "bakery", is_active: true }
    },
    {
      id: 3,
      name: "Vitamin C Tablets",
      slug: "vitamin-c-tablets",
      description: "Immunity support pack of 30 tablets.",
      price: "180",
      discount_price: "149",
      category_id: 3,
      stock_count: 12,
      image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
      is_featured: false,
      is_active: true,
      in_stock: true,
      category: { id: 3, name: "Pharmacy", slug: "pharmacy", is_active: true }
    },
    {
      id: 4,
      name: "Cotton T-Shirt",
      slug: "cotton-t-shirt",
      description: "Breathable everyday cotton tee.",
      price: "499",
      discount_price: "399",
      category_id: 4,
      stock_count: 18,
      image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
      is_featured: true,
      is_active: true,
      in_stock: true,
      category: { id: 4, name: "Fashion", slug: "fashion", is_active: true }
    }
  ],
  offers: [
    {
      id: 1,
      title: "Weekend Essentials",
      description: "Save more on milk, bread, snacks, and daily staples.",
      percentage: "12",
      highlight_text: "This weekend only",
      is_active: true
    }
  ],
  banners: [
    {
      id: 1,
      title: "Festival combos are live",
      subtitle: "Curated grocery, bakery, and gifting bundles for nearby customers.",
      image_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
      cta_label: "Shop offers",
      cta_href: "#offers",
      sort_order: 1,
      is_active: true
    }
  ]
};
