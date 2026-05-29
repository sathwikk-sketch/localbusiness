"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader as Loader2, Minus, Plus, Send, ShoppingBag, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useCart } from "@/lib/cart-store";
import { buildWhatsAppUrl, money } from "@/lib/utils";
import type { BusinessProfile } from "@/types";

export function CartDrawer({
  open,
  onClose,
  profile
}: {
  open: boolean;
  onClose: () => void;
  profile: BusinessProfile;
}) {
  const { lines, total, updateQuantity, remove, clear } = useCart();
  const [submitting, setSubmitting] = useState(false);

  async function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length) {
      toast.error("Add at least one product first");
      return;
    }
    const form = new FormData(event.currentTarget);
    const payload = {
      customer_name: String(form.get("name") ?? ""),
      customer_phone: String(form.get("phone") ?? ""),
      customer_address: String(form.get("address") ?? ""),
      notes: String(form.get("notes") ?? ""),
      items: lines.map((line) => ({ product_id: line.product.id, quantity: line.quantity }))
    };

    setSubmitting(true);
    try {
      const confirmation = await api.createOrder(payload);
      clear();
      toast.success(`Order ${confirmation.order.order_number} created`);
      const url =
        confirmation.whatsapp_url ??
        buildWhatsAppUrl(profile.whatsapp_number, confirmation.whatsapp_message);
      window.open(url, "_blank", "noopener,noreferrer");
      onClose();
    } catch {
      const message = [
        "Hello, I want to order:",
        "",
        ...lines.map((line) => `* ${line.quantity} ${line.product.name}`),
        `Total: ${money(total)}`
      ].join("\n");
      window.open(buildWhatsAppUrl(profile.whatsapp_number, message), "_blank", "noopener,noreferrer");
      toast.message("API unavailable, WhatsApp order message opened");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-ink-900/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.9 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-premium"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ink-100 p-5">
              <div className="flex items-center gap-3.5">
                <div className="flex size-11 items-center justify-center rounded-xl bg-ink-900 text-white shadow-soft">
                  <ShoppingBag className="size-5 stroke-[2]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-ink-900">Your Cart</h2>
                  <p className="text-sm text-ink-500">{lines.length} {lines.length === 1 ? 'item' : 'items'}</p>
                </div>
              </div>
              <button
                aria-label="Close cart"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-xl text-ink-400 hover:bg-ink-50 hover:text-ink-600 transition-colors duration-200"
              >
                <X className="size-5 stroke-[2]" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto bg-ink-50/30 p-4">
              {lines.length ? (
                <div className="space-y-3">
                  {lines.map((line) => (
                    <div
                      key={line.product.id}
                      className="rounded-xl bg-white p-4 shadow-subtle ring-1 ring-ink-100/50"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-ink-900 leading-snug">{line.product.name}</h3>
                          <p className="mt-0.5 text-sm text-ink-500">
                            {money(line.product.discount_price ?? line.product.price)}
                          </p>
                        </div>
                        <button
                          aria-label="Remove item"
                          onClick={() => remove(line.product.id)}
                          className="flex size-8 items-center justify-center rounded-lg text-ink-300 hover:bg-rose-50 hover:text-rose-500 transition-colors duration-200"
                        >
                          <Trash2 className="size-4 stroke-[2]" />
                        </button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center rounded-xl bg-ink-900 p-0.5 shadow-soft">
                          <button
                            aria-label="Decrease quantity"
                            className="flex size-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 transition-colors duration-200 active:scale-95"
                            onClick={() => updateQuantity(line.product.id, line.quantity - 1)}
                          >
                            <Minus className="size-3.5 stroke-[2.5]" />
                          </button>
                          <span className="min-w-[2.5rem] text-center text-sm font-semibold text-white">
                            {line.quantity}
                          </span>
                          <button
                            aria-label="Increase quantity"
                            className="flex size-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 transition-colors duration-200 active:scale-95"
                            onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                          >
                            <Plus className="size-3.5 stroke-[2.5]" />
                          </button>
                        </div>

                        {/* Line total */}
                        <span className="text-lg font-semibold text-ink-900">
                          {money(Number(line.product.discount_price ?? line.product.price) * line.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-ink-200/40 bg-white/60 p-10 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-ink-100/50 text-ink-400 mb-4">
                    <ShoppingBag className="size-7 stroke-[1.5]" />
                  </div>
                  <h3 className="font-semibold text-ink-900 mb-1.5">Your cart is empty</h3>
                  <p className="text-sm text-ink-500 max-w-[240px]">
                    Browse products and add items to place an order via WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {/* Checkout form */}
            <form onSubmit={placeOrder} className="border-t border-ink-100 bg-white p-5">
              {/* Total */}
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium text-ink-500">Order total</span>
                <span className="text-2xl font-semibold text-ink-900 tracking-[-0.02em]">{money(total)}</span>
              </div>

              {/* Form fields */}
              <div className="grid gap-2.5">
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="premium-input w-full"
                />
                <input
                  required
                  name="phone"
                  placeholder="Phone number"
                  type="tel"
                  className="premium-input w-full"
                />
                <textarea
                  name="address"
                  placeholder="Delivery address or pickup note"
                  rows={2}
                  className="premium-input w-full resize-none"
                />
                <input
                  name="notes"
                  placeholder="Special instructions (optional)"
                  className="premium-input w-full"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="mt-4 w-full h-12"
                disabled={submitting || !lines.length}
              >
                {submitting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <Send className="size-5 stroke-[2]" />
                )}
                <span>Place order via WhatsApp</span>
              </Button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
