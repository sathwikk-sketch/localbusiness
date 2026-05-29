"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Clock, Search } from "lucide-react";
import { useState, useMemo } from "react";

import type { BusinessProfile, Product, Category } from "@/types";

export function HeroSection({
  profile,
  products,
  categories
}: {
  profile: BusinessProfile;
  products: Product[];
  categories: Category[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search - simplified for demo
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products.slice(0, 2);
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 2);
  }, [searchQuery, products]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 size-[600px] bg-mint-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/3 right-1/4 size-[500px] bg-saffron-500/6 blur-[80px] rounded-full" />
      </div>

      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-ink-50/10 to-white pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-ink-200/50 bg-white/80 px-4 py-2 backdrop-blur-sm shadow-subtle">
            <span className="size-2 rounded-full bg-mint-500" />
            <span className="text-sm text-ink-600 font-medium">
              Discover {profile.business_name}
            </span>
          </div>
        </motion.div>

        {/* Main headline - Editorial serif */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-5xl mx-auto text-center mb-6 sm:mb-10 lg:mb-12"
        >
          <h1 className="headline-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-ink-900 leading-[1.1] sm:leading-[1.05] tracking-[-0.03em] mb-4 sm:mb-6">
            The quiet directory
            <br />
            <span className="font-light italic text-ink-400">of places</span>
            <br />
            <span className="font-light italic text-ink-500">worth knowing.</span>
          </h1>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base sm:text-lg text-ink-500 max-w-2xl mx-auto leading-relaxed font-light"
          >
            A curated guide to exceptional offerings from {profile.business_name} — handpicked by people who know quality when they see it.
          </motion.p>
        </motion.div>

        {/* Search interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto mb-16 sm:mb-20 lg:mb-24"
        >
          <div className="relative group">
            <div className="flex items-center gap-3 rounded-2xl border border-ink-200/40 bg-white/95 backdrop-blur-sm p-3 sm:p-4 shadow-soft group-hover:shadow-elevated group-focus-within:shadow-elevated transition-all duration-350 group-focus-within:border-ink-300">
              <Search className="size-5 text-ink-400 ml-1 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search products, categories, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-ink-900 placeholder:text-ink-400 outline-none text-base sm:text-lg"
              />
              <button className="flex items-center gap-2.5 rounded-xl bg-ink-900 text-white px-6 py-3 font-semibold text-sm hover:bg-ink-800 active:scale-95 transition-all duration-250 whitespace-nowrap">
                <span>Search</span>
                <span className="text-ink-300 text-xs">⌘K</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured product showcase - Discovery cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 + index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative"
            >
              <a href="#products" className="block h-full">
                <div className="relative h-full rounded-2xl bg-white border border-ink-100/60 p-6 sm:p-7 shadow-soft hover:shadow-elevated hover:border-ink-200 transition-all duration-350 overflow-hidden">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-mint-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none" />

                  <div className="relative">
                    {/* Category badge */}
                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-ink-50 text-ink-600 text-[11px] font-semibold uppercase tracking-[0.05em]">
                        {product.category?.name || "Premium"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-semibold text-ink-900 mb-2 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-ink-600 line-clamp-2 mb-5 leading-relaxed">
                        {product.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t border-ink-100/60">
                      <div className="flex items-center gap-2.5">
                        {product.is_featured && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-50">
                            <Star className="size-4 text-saffron-500 fill-current" />
                            <span className="text-xs font-semibold text-saffron-700">Popular</span>
                          </div>
                        )}
                        {product.in_stock && (
                          <div className="flex items-center gap-1.5 text-sm text-mint-600">
                            <span className="size-2 rounded-full bg-mint-500" />
                            <span className="font-medium">In stock</span>
                          </div>
                        )}
                      </div>
                      <span className="text-lg font-semibold text-ink-900">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Category tags */}
        {categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap gap-2.5 justify-center pt-4 sm:pt-6 border-t border-ink-100/50"
          >
            <span className="text-xs text-ink-400 font-medium uppercase tracking-[0.06em]">Explore</span>
            {categories.slice(0, 6).map((cat) => (
              <a
                key={cat.id}
                href="#products"
                className="px-3.5 py-1.5 rounded-full bg-white border border-ink-100 text-ink-700 hover:border-ink-200 hover:bg-ink-50 transition-all duration-250 text-xs font-medium"
              >
                {cat.name}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
