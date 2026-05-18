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

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.035, 0.2) }}
      className="group overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-ink/10 transition duration-200 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-mint/20 via-white to-saffron/20">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-3xl font-black text-ink/40">{product.name.slice(0, 2).toUpperCase()}</div>
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.discount_price && (
            <span className="rounded-full bg-rose px-3 py-1 text-xs font-black text-white">
              Save {Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)}%
            </span>
          )}
          <span className={`rounded-full px-3 py-1 text-xs font-black ${product.in_stock ? "bg-mint text-white" : "bg-ink/80 text-white"}`}>
            {product.in_stock ? `${product.stock_count} left` : "Out of stock"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-mint">{product.category?.name ?? "General"}</div>
        <h3 className="text-lg font-black text-ink">{product.name}</h3>
        {product.description && <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-ink/60">{product.description}</p>}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className="text-xl font-black text-ink">{money(price)}</div>
            {product.discount_price && <div className="text-sm font-semibold text-ink/40 line-through">{money(product.price)}</div>}
          </div>
          {line ? (
            <div className="flex items-center rounded-full bg-ink p-1 text-white">
              <button aria-label="Decrease quantity" className="grid size-8 place-items-center rounded-full hover:bg-white/15" onClick={() => (line.quantity <= 1 ? remove(product.id) : updateQuantity(product.id, line.quantity - 1))}>
                <Minus className="size-4" />
              </button>
              <span className="w-8 text-center text-sm font-black">{line.quantity}</span>
              <button aria-label="Increase quantity" className="grid size-8 place-items-center rounded-full hover:bg-white/15" onClick={() => updateQuantity(product.id, line.quantity + 1)}>
                <Plus className="size-4" />
              </button>
            </div>
          ) : (
            <Button size="icon" aria-label={`Add ${product.name} to cart`} disabled={!product.in_stock} onClick={() => add(product)}>
              <ShoppingBag className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.article>
  );
}

