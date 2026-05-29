"use client";

import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { ProductCard } from "@/components/storefront/product-card";
import type { Category, Product } from "@/types";

export function ProductBrowser({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<number | "all">("all");
  const [stockOnly, setStockOnly] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

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

  const hasFilters = query || category !== "all" || stockOnly;

  return (
    <section id="products" className="mx-auto max-w-7xl px-5 pt-20 pb-16 sm:px-8 lg:px-12 lg:pt-28">
      {/* Header with refined typography */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mint-600 mb-3"
          >
            Live Catalogue
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-display-sm sm:text-heading-xl text-ink-900 font-semibold leading-tight"
          >
            Curated products ready to order
          </motion.h2>
        </div>

        {/* Premium search bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <div className={`flex flex-col gap-3 rounded-2xl p-3 transition-all duration-350 ${
            searchFocused
              ? 'bg-white shadow-elevated ring-2 ring-mint-500/20'
              : 'bg-white/70 shadow-soft hover:bg-white/90'
          }`}>
            <label className="relative block min-w-0 sm:w-80">
              <Search className={`pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 transition-colors duration-250 ${
                searchFocused ? 'text-mint-600' : 'text-ink-400'
              }`} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search products..."
                className="h-12 w-full rounded-xl bg-ink-50/50 pl-11 pr-10 text-sm font-medium text-ink-800 placeholder:text-ink-400 outline-none transition-colors duration-250 focus:bg-ink-50/100"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full text-ink-400 hover:text-ink-600 hover:bg-ink-100/50 transition-all duration-200"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </label>

            {/* Stock toggle button */}
            <button
              onClick={() => setStockOnly((value) => !value)}
              className={`inline-flex h-12 items-center justify-center gap-2.5 rounded-xl px-5 text-sm font-semibold transition-all duration-250 ${
                stockOnly
                  ? "bg-mint-500 text-white shadow-sm hover:bg-mint-600"
                  : "bg-ink-50/50 text-ink-600 ring-1 ring-ink-100 hover:bg-ink-100/50"
              }`}
            >
              <SlidersHorizontal className="size-[18px]" />
              <span>{stockOnly ? "In stock only" : "Filter in stock"}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Category filters with refined design */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          onClick={() => setCategory("all")}
          className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-250 ${
            category === "all"
              ? "bg-ink-900 text-white shadow-soft"
              : "bg-white text-ink-600 ring-1 ring-ink-100 hover:ring-ink-200 hover:text-ink-700"
          }`}
        >
          All Products
        </motion.button>
        {categories.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.18 + index * 0.025 }}
            onClick={() => setCategory(item.id)}
            className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-250 ${
              category === item.id
                ? "bg-ink-900 text-white shadow-soft"
                : "bg-white text-ink-600 ring-1 ring-ink-100 hover:ring-ink-200 hover:text-ink-700"
            }`}
          >
            {item.name}
          </motion.button>
        ))}
      </div>

      {/* Results count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center justify-between"
      >
        <p className="text-sm text-ink-500">
          {filtered.length === products.length
            ? `${products.length} products`
            : `${filtered.length} of ${products.length} products`}
        </p>
        {hasFilters && (
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
              setStockOnly(false);
            }}
            className="text-sm font-medium text-mint-600 hover:text-mint-700 transition-colors duration-200"
          >
            Clear filters
          </button>
        )}
      </motion.div>

      {/* Product grid with refined spacing */}
      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products found"
          message="Try adjusting your search or filters to discover more products."
        />
      )}
    </section>
  );
}
