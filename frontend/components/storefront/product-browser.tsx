"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/storefront/product-card";
import type { Category, Product } from "@/types";

export function ProductBrowser({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<number | "all">("all");
  const [stockOnly, setStockOnly] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.description ?? "").toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || product.category_id === category;
      const matchesStock = !stockOnly || product.in_stock;
      return matchesQuery && matchesCategory && matchesStock;
    });
  }, [category, products, query, stockOnly]);

  return (
    <section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-black uppercase tracking-wide text-mint"
          >
            Live catalogue
          </motion.p>
          <h2 className="mt-2 text-3xl font-black text-ink sm:text-4xl">Products customers can order now</h2>
        </div>
        <div className="glass flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center">
          <label className="relative block min-w-0 sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="h-11 w-full rounded-full border border-ink/10 bg-white pl-10 pr-4 text-sm font-semibold outline-none ring-mint/20 transition focus:ring-4"
            />
          </label>
          <button
            onClick={() => setStockOnly((value) => !value)}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold transition ${
              stockOnly ? "bg-mint text-white" : "bg-white text-ink ring-1 ring-ink/10"
            }`}
          >
            <SlidersHorizontal className="size-4" />
            In stock
          </button>
        </div>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setCategory("all")}
          className={`shrink-0 rounded-full px-5 py-2 text-sm font-black transition ${
            category === "all" ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10 hover:ring-ink/20"
          }`}
        >
          All
        </button>
        {categories.map((item) => (
          <button
            key={item.id}
            onClick={() => setCategory(item.id)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-black transition ${
              category === item.id ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-ink/10 hover:ring-ink/20"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState title="No products found" message="Try another search term or category filter." />
      )}
    </section>
  );
}

