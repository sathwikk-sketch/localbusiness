"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "sonner";

import type { Product } from "@/types";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  total: number;
  count: number;
  add: (product: Product) => void;
  remove: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const total = lines.reduce((sum, line) => {
      const price = Number(line.product.discount_price ?? line.product.price);
      return sum + price * line.quantity;
    }, 0);
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);

    return {
      lines,
      total,
      count,
      add(product) {
        if (!product.in_stock) {
          toast.error("This product is out of stock");
          return;
        }
        setLines((current) => {
          const existing = current.find((line) => line.product.id === product.id);
          if (existing) {
            return current.map((line) =>
              line.product.id === product.id
                ? { ...line, quantity: Math.min(line.quantity + 1, product.stock_count) }
                : line
            );
          }
          return [...current, { product, quantity: 1 }];
        });
        toast.success(`${product.name} added to cart`);
      },
      remove(productId) {
        setLines((current) => current.filter((line) => line.product.id !== productId));
      },
      updateQuantity(productId, quantity) {
        if (quantity <= 0) {
          setLines((current) => current.filter((line) => line.product.id !== productId));
          return;
        }
        setLines((current) =>
          current
            .map((line) =>
              line.product.id === productId
                ? { ...line, quantity: Math.max(1, Math.min(quantity, line.product.stock_count || 1)) }
                : line
            )
            .filter((line) => line.quantity > 0)
        );
      },
      clear() {
        setLines([]);
      }
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
