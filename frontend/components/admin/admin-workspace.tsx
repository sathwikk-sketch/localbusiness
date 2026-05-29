"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BadgePercent, Boxes, CircleCheck as CheckCircle2, CircleDollarSign, CreditCard as Edit3, Hop as Home, ImageUp, LayoutDashboard, Loader as Loader2, LogOut, PackagePlus, RefreshCw, Save, Search, ShoppingBag, Store, Upload, Circle as XCircle } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { absoluteAssetUrl, money } from "@/lib/utils";
import type { Banner, BusinessProfile, Category, DashboardStats, Offer, Order, OrderStatus, Product } from "@/types";

type Tab = "overview" | "products" | "orders" | "offers" | "content";

const statuses: OrderStatus[] = ["pending", "confirmed", "ready", "delivered"];

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  discount_price: "",
  category_id: "",
  stock_count: 0,
  image_url: "",
  is_featured: false,
  is_active: true
};

const emptyOffer = {
  title: "",
  description: "",
  percentage: "10",
  highlight_text: "",
  banner_image_url: "",
  is_active: true
};

const emptyBanner = {
  title: "",
  subtitle: "",
  image_url: "",
  cta_label: "Shop now",
  cta_href: "#products",
  sort_order: 1,
  is_active: true
};

export function AdminWorkspace() {
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("localbiz_token");
    setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function refresh() {
    if (!token) return;
    setLoading(true);
    try {
      const [dashboard, productList, categoryList, orderList, offerList, currentProfile, bannerList] = await Promise.all([
        api.dashboard(token),
        api.products(token),
        api.categories(token),
        api.orders(token),
        api.offers(token),
        api.profile(token),
        api.banners(token)
      ]);
      setStats(dashboard);
      setProducts(productList);
      setCategories(categoryList);
      setOrders(orderList);
      setOffers(offerList);
      setProfile(currentProfile);
      setBanners(bannerList);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("localbiz_token");
    setToken(null);
  }

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="glass max-w-md rounded-lg p-8 text-center">
          <Store className="mx-auto mb-4 size-11 text-mint" />
          <h1 className="text-2xl font-black text-ink">Admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-ink/60">Sign in to manage inventory, orders, offers, banners, and homepage content.</p>
          <Link href="/admin/login">
            <Button className="mt-6 w-full">Go to login</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-grid min-h-screen bg-paper">
      <aside className="fixed inset-x-0 top-0 z-30 border-b border-ink/10 bg-white/80 backdrop-blur-xl lg:inset-y-0 lg:left-0 lg:right-auto lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 p-4 lg:p-6">
            <Link href="/" className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-mint to-saffron text-ink">
                <Store className="size-5" />
              </span>
              <span className="font-black text-ink">LocalBiz Admin</span>
            </Link>
            <Button variant="ghost" size="icon" aria-label="Refresh" onClick={refresh} className="lg:hidden">
              <RefreshCw className="size-5" />
            </Button>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:grid lg:overflow-visible lg:px-6">
            {(
              [
                ["overview", LayoutDashboard, "Overview"],
                ["products", Boxes, "Products"],
                ["orders", ShoppingBag, "Orders"],
                ["offers", BadgePercent, "Offers"],
                ["content", Home, "Content"]
              ] as const
            ).map(([key, Icon, label]) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`inline-flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-black transition ${
                    active ? "bg-ink text-white shadow-soft" : "text-ink/60 hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  <Icon className="size-5" />
                  {label}
                </button>
              );
            })}
          </nav>
          <div className="mt-auto hidden p-6 lg:block">
            <Button variant="secondary" className="w-full justify-start" onClick={logout}>
              <LogOut className="size-5" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      <section className="px-4 pb-10 pt-28 sm:px-6 lg:ml-72 lg:px-8 lg:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-mint">Business workspace</p>
              <h1 className="mt-2 text-3xl font-black text-ink sm:text-4xl">
                {profile?.business_name ?? "Local business dashboard"}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={refresh} disabled={loading}>
                {loading ? <Loader2 className="size-5 animate-spin" /> : <RefreshCw className="size-5" />}
                Refresh
              </Button>
              <Button variant="ghost" onClick={logout} className="lg:hidden">
                <LogOut className="size-5" />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid min-h-96 place-items-center rounded-lg bg-white/70">
              <Loader2 className="size-8 animate-spin text-mint" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {tab === "overview" && <Overview stats={stats} orders={orders} />}
              {tab === "products" && (
                <ProductsPanel token={token} products={products} categories={categories} onSaved={refresh} />
              )}
              {tab === "orders" && <OrdersPanel token={token} initialOrders={orders} onChanged={refresh} />}
              {tab === "offers" && <OffersPanel token={token} offers={offers} onSaved={refresh} />}
              {tab === "content" && (
                <ContentPanel token={token} profile={profile} banners={banners} onSaved={refresh} />
              )}
            </AnimatePresence>
          )}
        </div>
      </section>
    </main>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
    >
      {children}
    </motion.div>
  );
}

function Overview({ stats, orders }: { stats: DashboardStats | null; orders: Order[] }) {
  const cards = [
    ["Revenue", money(stats?.total_revenue ?? 0), CircleDollarSign, "Delivered orders"],
    ["Orders", String(stats?.total_orders ?? orders.length), ShoppingBag, `${stats?.pending_orders ?? 0} pending`],
    ["Products", String(stats?.active_products ?? 0), Boxes, `${stats?.low_stock_products ?? 0} low stock`],
    ["Delivered", String(stats?.delivered_orders ?? 0), CheckCircle2, "Completed sales"]
  ];

  return (
    <Panel>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon, note]) => {
          const TypedIcon = Icon as typeof CircleDollarSign;
          return (
            <div key={label as string} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-ink/60">{label as string}</span>
                <span className="grid size-10 place-items-center rounded-lg bg-mint/10 text-mint">
                  <TypedIcon className="size-5" />
                </span>
              </div>
              <div className="mt-4 text-3xl font-black text-ink">{value as string}</div>
              <div className="mt-1 text-sm font-semibold text-ink/50">{note as string}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
          <h2 className="mb-4 text-xl font-black text-ink">Recent orders</h2>
          <div className="space-y-3">
            {(stats?.recent_orders ?? orders).slice(0, 6).map((order) => (
              <OrderRow key={order.id} order={order} compact />
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
          <h2 className="mb-4 text-xl font-black text-ink">Low stock</h2>
          <div className="space-y-3">
            {(stats?.low_stock ?? []).map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg bg-paper p-3">
                <div>
                  <div className="font-black text-ink">{product.name}</div>
                  <div className="text-sm font-semibold text-ink/50">{product.category?.name ?? "General"}</div>
                </div>
                <span className="rounded-full bg-rose/10 px-3 py-1 text-sm font-black text-rose">{product.stock_count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function ProductsPanel({
  token,
  products,
  categories,
  onSaved
}: {
  token: string;
  products: Product[];
  categories: Category[];
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState<(typeof emptyProduct & { id?: number })>(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const filtered = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await api.saveProduct(token, {
        id: editing.id,
        name: editing.name,
        description: editing.description,
        price: Number(editing.price),
        discount_price: editing.discount_price ? Number(editing.discount_price) : null,
        category_id: editing.category_id ? Number(editing.category_id) : null,
        stock_count: Number(editing.stock_count),
        image_url: editing.image_url || null,
        is_featured: editing.is_featured,
        is_active: editing.is_active
      });
      toast.success(editing.id ? "Product updated" : "Product added");
      setEditing(emptyProduct);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const uploaded = await api.upload(token, file);
    setEditing((current) => ({ ...current, image_url: uploaded.url }));
    toast.success("Image uploaded");
  }

  async function addCategory() {
    if (!newCategory.trim()) return;
    try {
      await api.saveCategory(token, { name: newCategory.trim() });
      toast.success("Category added");
      setNewCategory("");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add category");
    }
  }

  return (
    <Panel>
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
            <h2 className="mb-3 text-lg font-black text-ink">Add category</h2>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <Input value={newCategory} onChange={setNewCategory} placeholder="Category name" />
              <Button type="button" variant="secondary" onClick={addCategory}>
                <PackagePlus className="size-4" />
                Add
              </Button>
            </div>
          </div>

          <form onSubmit={submit} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-ink">{editing.id ? "Edit product" : "Add product"}</h2>
              {editing.id && (
                <Button type="button" variant="ghost" size="icon" onClick={() => setEditing(emptyProduct)} aria-label="Cancel edit">
                  <XCircle className="size-5" />
                </Button>
              )}
            </div>
            <div className="grid gap-3">
              <Input value={editing.name} onChange={(value) => setEditing({ ...editing, name: value })} placeholder="Product name" required />
              <Textarea value={editing.description} onChange={(value) => setEditing({ ...editing, description: value })} placeholder="Description" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={String(editing.price)} onChange={(value) => setEditing({ ...editing, price: value })} placeholder="Price" type="number" required />
                <Input value={String(editing.discount_price)} onChange={(value) => setEditing({ ...editing, discount_price: value })} placeholder="Discount price" type="number" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={editing.category_id}
                  onChange={(event) => setEditing({ ...editing, category_id: event.target.value })}
                  className="h-12 rounded-lg border border-ink/10 bg-white px-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20"
                >
                  <option value="">Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <Input value={String(editing.stock_count)} onChange={(value) => setEditing({ ...editing, stock_count: Number(value) })} placeholder="Stock" type="number" />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input value={editing.image_url} onChange={(value) => setEditing({ ...editing, image_url: value })} placeholder="Image URL" />
                <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink/10 px-4 text-sm font-black text-ink hover:bg-ink/5">
                  <Upload className="size-4" />
                  Upload
                  <input type="file" accept="image/*" className="hidden" onChange={upload} />
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Toggle label="Featured" checked={editing.is_featured} onChange={(checked) => setEditing({ ...editing, is_featured: checked })} />
                <Toggle label="Active" checked={editing.is_active} onChange={(checked) => setEditing({ ...editing, is_active: checked })} />
              </div>
            </div>
            <Button className="mt-5 w-full" disabled={saving}>
              {saving ? <Loader2 className="size-5 animate-spin" /> : <PackagePlus className="size-5" />}
              Save product
            </Button>
          </form>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-black text-ink">Inventory</h2>
            <label className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search inventory" className="h-11 w-full rounded-full border border-ink/10 pl-10 pr-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20 sm:w-72" />
            </label>
          </div>
          <div className="grid gap-3">
            {filtered.map((product) => (
              <div key={product.id} className="grid gap-3 rounded-lg bg-paper p-3 md:grid-cols-[1fr_auto] md:items-center">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-mint/10">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={absoluteAssetUrl(product.image_url) ?? ""} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-black text-ink">{product.name}</div>
                    <div className="text-sm font-semibold text-ink/60">
                      {money(product.discount_price ?? product.price)} · {product.category?.name ?? "General"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <span className={`rounded-full px-3 py-1 text-sm font-black ${product.stock_count <= 5 ? "bg-rose/10 text-rose" : "bg-mint/10 text-mint"}`}>
                    {product.stock_count} stock
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setEditing({
                        id: product.id,
                        name: product.name,
                        description: product.description ?? "",
                        price: product.price,
                        discount_price: product.discount_price ?? "",
                        category_id: product.category_id ? String(product.category_id) : "",
                        stock_count: product.stock_count,
                        image_url: product.image_url ?? "",
                        is_featured: product.is_featured,
                        is_active: product.is_active
                      })
                    }
                  >
                    <Edit3 className="size-4" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}

function OrdersPanel({ token, initialOrders, onChanged }: { token: string; initialOrders: Order[]; onChanged: () => void }) {
  const [orders, setOrders] = useState(initialOrders);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [search, setSearch] = useState("");

  useEffect(() => setOrders(initialOrders), [initialOrders]);

  async function load() {
    const list = await api.orders(token, status || undefined, search);
    setOrders(list);
  }

  async function changeStatus(order: Order, nextStatus: OrderStatus) {
    try {
      await api.updateOrderStatus(token, order.id, nextStatus);
      toast.success(`Order ${order.order_number} moved to ${nextStatus}`);
      await load();
      onChanged();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update order");
    }
  }

  return (
    <Panel>
      <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-xl font-black text-ink">Orders</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders" className="h-11 rounded-full border border-ink/10 pl-10 pr-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20" />
            </label>
            <select value={status} onChange={(event) => setStatus(event.target.value as OrderStatus | "")} className="h-11 rounded-full border border-ink/10 bg-white px-4 text-sm font-bold outline-none focus:ring-4 focus:ring-mint/20">
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <Button variant="secondary" onClick={load}>
              <Search className="size-4" />
              Filter
            </Button>
          </div>
        </div>
        <div className="grid gap-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg bg-paper p-4">
              <OrderRow order={order} />
              <div className="mt-4 flex flex-wrap gap-2">
                {statuses.map((item) => (
                  <button
                    key={item}
                    onClick={() => changeStatus(order, item)}
                    className={`rounded-full px-4 py-2 text-xs font-black capitalize transition ${
                      order.status === item ? "bg-ink text-white" : "bg-white text-ink/60 ring-1 ring-ink/10 hover:text-ink"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function OffersPanel({ token, offers, onSaved }: { token: string; offers: Offer[]; onSaved: () => void }) {
  const [editing, setEditing] = useState<(typeof emptyOffer & { id?: number })>(emptyOffer);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await api.saveOffer(token, {
        id: editing.id,
        title: editing.title,
        description: editing.description,
        percentage: Number(editing.percentage),
        highlight_text: editing.highlight_text,
        banner_image_url: editing.banner_image_url,
        is_active: editing.is_active
      });
      toast.success("Offer saved");
      setEditing(emptyOffer);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save offer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Panel>
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
          <h2 className="mb-5 text-xl font-black text-ink">Festival offer</h2>
          <div className="grid gap-3">
            <Input value={editing.title} onChange={(value) => setEditing({ ...editing, title: value })} placeholder="Offer title" required />
            <Textarea value={editing.description} onChange={(value) => setEditing({ ...editing, description: value })} placeholder="Offer description" />
            <Input value={String(editing.percentage)} onChange={(value) => setEditing({ ...editing, percentage: value })} placeholder="Discount percentage" type="number" />
            <Input value={editing.highlight_text} onChange={(value) => setEditing({ ...editing, highlight_text: value })} placeholder="Highlight text" />
            <Input value={editing.banner_image_url} onChange={(value) => setEditing({ ...editing, banner_image_url: value })} placeholder="Banner image URL" />
            <Toggle label="Active" checked={editing.is_active} onChange={(checked) => setEditing({ ...editing, is_active: checked })} />
          </div>
          <Button className="mt-5 w-full" disabled={saving}>
            {saving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Save offer
          </Button>
        </form>
        <div className="grid gap-3">
          {offers.map((offer) => (
            <button
              key={offer.id}
              onClick={() =>
                setEditing({
                  id: offer.id,
                  title: offer.title,
                  description: offer.description ?? "",
                  percentage: offer.percentage,
                  highlight_text: offer.highlight_text ?? "",
                  banner_image_url: offer.banner_image_url ?? "",
                  is_active: offer.is_active
                })
              }
              className="rounded-lg bg-white p-5 text-left shadow-sm ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xl font-black text-ink">{offer.title}</div>
                  <p className="mt-2 text-sm leading-6 text-ink/60">{offer.description}</p>
                </div>
                <span className="rounded-full bg-saffron px-3 py-1 text-sm font-black text-ink">
                  {Number(offer.percentage).toFixed(0)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function ContentPanel({
  token,
  profile,
  banners,
  onSaved
}: {
  token: string;
  profile: BusinessProfile | null;
  banners: Banner[];
  onSaved: () => void;
}) {
  const [draft, setDraft] = useState<Partial<BusinessProfile>>(profile ?? {});
  const [banner, setBanner] = useState<(typeof emptyBanner & { id?: number })>(emptyBanner);
  const [saving, setSaving] = useState(false);

  useEffect(() => setDraft(profile ?? {}), [profile]);

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(token, nullEmptyStrings(draft));
      toast.success("Homepage content updated");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save content");
    } finally {
      setSaving(false);
    }
  }

  async function saveBanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api.saveBanner(token, banner);
      toast.success("Banner saved");
      setBanner(emptyBanner);
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save banner");
    }
  }

  async function uploadBanner(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const uploaded = await api.upload(token, file);
    setBanner((current) => ({ ...current, image_url: uploaded.url }));
    toast.success("Banner image uploaded");
  }

  return (
    <Panel>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <form onSubmit={saveProfile} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
          <h2 className="mb-5 text-xl font-black text-ink">Homepage content</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Input value={draft.business_name ?? ""} onChange={(value) => setDraft({ ...draft, business_name: value })} placeholder="Business name" />
            <Input value={draft.tagline ?? ""} onChange={(value) => setDraft({ ...draft, tagline: value })} placeholder="Tagline" />
            <Input value={draft.hero_title ?? ""} onChange={(value) => setDraft({ ...draft, hero_title: value })} placeholder="Hero title" />
            <Input value={draft.logo_url ?? ""} onChange={(value) => setDraft({ ...draft, logo_url: value })} placeholder="Logo URL" />
            <Input value={draft.phone ?? ""} onChange={(value) => setDraft({ ...draft, phone: value })} placeholder="Phone" />
            <Input value={draft.whatsapp_number ?? ""} onChange={(value) => setDraft({ ...draft, whatsapp_number: value })} placeholder="WhatsApp number" />
            <Input value={draft.email ?? ""} onChange={(value) => setDraft({ ...draft, email: value })} placeholder="Email" />
            <Input value={draft.maps_embed_url ?? ""} onChange={(value) => setDraft({ ...draft, maps_embed_url: value })} placeholder="Google Maps embed URL" />
            <div className="md:col-span-2">
              <Textarea value={draft.hero_subtitle ?? ""} onChange={(value) => setDraft({ ...draft, hero_subtitle: value })} placeholder="Hero subtitle" />
            </div>
            <div className="md:col-span-2">
              <Textarea value={draft.about ?? ""} onChange={(value) => setDraft({ ...draft, about: value })} placeholder="About business" />
            </div>
            <div className="md:col-span-2">
              <Textarea value={draft.address ?? ""} onChange={(value) => setDraft({ ...draft, address: value })} placeholder="Address" />
            </div>
          </div>
          <Button className="mt-5" disabled={saving}>
            {saving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
            Save homepage
          </Button>
        </form>

        <div className="space-y-6">
          <form onSubmit={saveBanner} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
            <h2 className="mb-5 text-xl font-black text-ink">Promotional banner</h2>
            <div className="grid gap-3">
              <Input value={banner.title} onChange={(value) => setBanner({ ...banner, title: value })} placeholder="Banner title" required />
              <Textarea value={banner.subtitle} onChange={(value) => setBanner({ ...banner, subtitle: value })} placeholder="Subtitle" />
              <Input value={banner.image_url} onChange={(value) => setBanner({ ...banner, image_url: value })} placeholder="Image URL" />
              <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-ink/10 px-4 text-sm font-black text-ink hover:bg-ink/5">
                <ImageUp className="size-4" />
                Upload banner image
                <input type="file" accept="image/*" className="hidden" onChange={uploadBanner} />
              </label>
              <Input value={banner.cta_label} onChange={(value) => setBanner({ ...banner, cta_label: value })} placeholder="CTA label" />
              <Input value={banner.cta_href} onChange={(value) => setBanner({ ...banner, cta_href: value })} placeholder="CTA link" />
              <Toggle label="Active" checked={banner.is_active} onChange={(checked) => setBanner({ ...banner, is_active: checked })} />
            </div>
            <Button className="mt-5 w-full">
              <Save className="size-5" />
              Save banner
            </Button>
          </form>
          <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-ink/10">
            <h3 className="mb-3 font-black text-ink">Live banners</h3>
            <div className="space-y-2">
              {banners.map((item) => (
                <button
                  key={item.id}
                  className="w-full rounded-lg bg-paper p-3 text-left"
                  onClick={() =>
                    setBanner({
                      id: item.id,
                      title: item.title,
                      subtitle: item.subtitle ?? "",
                      image_url: item.image_url ?? "",
                      cta_label: item.cta_label ?? "",
                      cta_href: item.cta_href ?? "",
                      sort_order: item.sort_order,
                      is_active: item.is_active
                    })
                  }
                >
                  <div className="font-black text-ink">{item.title}</div>
                  <div className="line-clamp-2 text-sm text-ink/60">{item.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function OrderRow({ order, compact = false }: { order: Order; compact?: boolean }) {
  return (
    <div className={compact ? "flex items-center justify-between gap-3 rounded-lg bg-paper p-3" : ""}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-black text-ink">{order.order_number}</span>
          <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusClass(order.status)}`}>{order.status}</span>
        </div>
        <div className="mt-1 text-sm font-semibold text-ink/60">
          {order.customer_name} · {order.customer_phone}
        </div>
        {!compact && (
          <div className="mt-2 text-sm leading-6 text-ink/60">
            {order.items.map((item) => `${item.quantity} ${item.product_name}`).join(", ")}
          </div>
        )}
      </div>
      <div className="text-right font-black text-ink">{money(order.total)}</div>
    </div>
  );
}

function statusClass(status: OrderStatus) {
  if (status === "pending") return "bg-saffron/20 text-ink";
  if (status === "confirmed") return "bg-mint/15 text-mint";
  if (status === "ready") return "bg-rose/10 text-rose";
  return "bg-ink text-white";
}

function nullEmptyStrings<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, item === "" ? null : item])
  ) as T;
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  required
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      required={required}
      className="h-12 rounded-lg border border-ink/10 bg-white px-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full resize-none rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20"
    />
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex h-12 cursor-pointer items-center justify-between rounded-lg border border-ink/10 bg-white px-4 text-sm font-black text-ink">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-5 accent-mint" />
    </label>
  );
}
