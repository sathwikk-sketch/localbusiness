"use client";

import { Toaster } from "sonner";

import { CartProvider } from "@/lib/cart-store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster richColors position="top-right" />
    </CartProvider>
  );
}
