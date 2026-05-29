"use client";

import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import { absoluteAssetUrl, money } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { add, lines, updateQuantity, remove } = useCart();
  const line = lines.find((item) => item.product.id === product.id);
  const image = absoluteAssetUrl(product.image_url);
  const price = product.discount_price ?? product.price;
  const hasDiscount = Boolean(product.discount_price);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.25), ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative"
    >
      {/* Card container with refined aesthetics */}
      <article className="surface-card rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Image Section - Clean and minimal */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-50/40 via-white to-saffron-50/30">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-600 ease-out group-hover:scale-[1.03]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-medium text-ink-200">
              {product.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          {/* Soft gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/20 via-transparent to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

          {/* Stock indicator - Minimal badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md transition-opacity duration-250 ${
                product.in_stock
                  ? "bg-white/80 text-ink-600 border border-white/40"
                  : "bg-ink-900/80 text-white border border-white/20"
              }`}
            >
              <span className={`size-1.5 rounded-full ${product.in_stock ? "bg-mint-500" : "bg-ink-400"}`} />
              {product.in_stock ? `${product.stock_count} available` : "Out of stock"}
            </span>
          </div>

          {/* Discount badge - Only visible when applicable */}
          {hasDiscount && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center rounded-full bg-mint-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                {Math.round(((Number(product.price) - Number(product.discount_price!)) / Number(product.price)) * 100)}% off
              </span>
            </div>
          )}

          {/* Add to cart button - Reveals on hover (desktop) */}
          <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 transition-all duration-350 group-hover:opacity-100 group-hover:translate-y-0 sm:block hidden">
            {line ? (
              <div className="flex items-center gap-0.5 rounded-full bg-ink-900 p-1 shadow-elevated">
                <button
                  aria-label="Decrease quantity"
                  onClick={() => (line.quantity <= 1 ? remove(product.id) : updateQuantity(product.id, line.quantity - 1))}
                  className="flex size-8 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200"
                >
                  <Minus className="size-4 stroke-[2]" />
                </button>
                <span className="min-w-[2rem] text-center text-sm font-semibold text-white">
                  {line.quantity}
                </span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => updateQuantity(product.id, line.quantity + 1)}
                  className="flex size-8 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-200"
                >
                  <Plus className="size-4 stroke-[2]" />
                </button>
              </div>
            ) : (
              <button
                aria-label={`Add ${product.name} to cart`}
                disabled={!product.in_stock}
                onClick={() => add(product)}
                className="flex size-11 items-center justify-center rounded-full bg-ink-900 text-white shadow-elevated hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink-900 transition-all duration-250"
              >
                <ShoppingBag className="size-[18px] stroke-[2]" />
              </button>
            )}
          </div>
        </div>

        {/* Content Section - Refined typography */}
        <div className="flex flex-1 flex-col p-4 lg:p-5">
          {/* Category */}
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-400 mb-1.5">
            {product.category?.name ?? "General"}
          </span>

          {/* Name */}
          <h3 className="text-base sm:text-heading-md font-semibold text-ink-900 tracking-[-0.01em] leading-snug">
            {product.name}
          </h3>

          {/* Description - Minimal */}
          {product.description && (
            <p className="mt-1.5 line-clamp-2 text-sm text-ink-500 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Price section with refined hierarchy */}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-ink-900 tracking-[-0.02em]">
                {money(price)}
              </span>
              {hasDiscount && (
                <span className="text-sm text-ink-400 line-through">
                  {money(product.price)}
                </span>
              )}
            </div>

            {/* Mobile add to cart */}
            <div className="sm:hidden">
              {line ? (
                <div className="flex items-center gap-0.5 rounded-full bg-ink-900 p-0.5">
                  <button
                    aria-label="Decrease quantity"
                    onClick={() => (line.quantity <= 1 ? remove(product.id) : updateQuantity(product.id, line.quantity - 1))}
                    className="flex size-7 items-center justify-center rounded-full text-white/80 hover:bg-white/10 active:scale-95 transition-all duration-150"
                  >
                    <Minus className="size-3.5 stroke-[2]" />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-xs font-semibold text-white">
                    {line.quantity}
                  </span>
                  <button
                    aria-label="Increase quantity"
                    onClick={() => updateQuantity(product.id, line.quantity + 1)}
                    className="flex size-7 items-center justify-center rounded-full text-white/80 hover:bg-white/10 active:scale-95 transition-all duration-150"
                  >
                    <Plus className="size-3.5 stroke-[2]" />
                  </button>
                </div>
              ) : (
                <button
                  aria-label={`Add ${product.name} to cart`}
                  disabled={!product.in_stock}
                  onClick={() => add(product)}
                  className="flex size-9 items-center justify-center rounded-full bg-ink-900 text-white hover:bg-ink-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
                >
                  <ShoppingBag className="size-4 stroke-[2]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Ambient glow on hover - Subtle focus effect */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-mint-500/10 via-transparent to-saffron-500/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 pointer-events-none z-[-1]" />
    </motion.article>
  );
}
