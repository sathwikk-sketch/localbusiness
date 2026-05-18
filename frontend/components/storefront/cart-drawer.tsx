"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Minus, Plus, Send, ShoppingBag, Trash2, X } from "lucide-react";
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
        `Total: ₹${total}`
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper shadow-glass"
          >
            <div className="flex items-center justify-between border-b border-ink/10 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-ink text-white">
                  <ShoppingBag className="size-5" />
                </span>
                <div>
                  <h2 className="font-black text-ink">Cart</h2>
                  <p className="text-sm font-semibold text-ink/60">{lines.length} items</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" aria-label="Close cart" onClick={onClose}>
                <X className="size-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {lines.length ? (
                <div className="space-y-3">
                  {lines.map((line) => (
                    <div key={line.product.id} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-ink/10">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black text-ink">{line.product.name}</h3>
                          <p className="text-sm font-semibold text-ink/60">{money(line.product.discount_price ?? line.product.price)}</p>
                        </div>
                        <button aria-label="Remove item" onClick={() => remove(line.product.id)} className="grid size-9 place-items-center rounded-full text-ink/40 hover:bg-rose/10 hover:text-rose">
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full bg-ink text-white">
                          <button aria-label="Decrease quantity" className="grid size-9 place-items-center rounded-full hover:bg-white/15" onClick={() => updateQuantity(line.product.id, line.quantity - 1)}>
                            <Minus className="size-4" />
                          </button>
                          <span className="w-9 text-center text-sm font-black">{line.quantity}</span>
                          <button aria-label="Increase quantity" className="grid size-9 place-items-center rounded-full hover:bg-white/15" onClick={() => updateQuantity(line.product.id, line.quantity + 1)}>
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <span className="font-black text-ink">{money(Number(line.product.discount_price ?? line.product.price) * line.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid h-full place-items-center rounded-lg border border-dashed border-ink/15 bg-white/60 p-8 text-center">
                  <div>
                    <ShoppingBag className="mx-auto mb-4 size-10 text-ink/30" />
                    <h3 className="font-black text-ink">Cart is empty</h3>
                    <p className="mt-2 text-sm text-ink/60">Add products to send an order on WhatsApp.</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={placeOrder} className="border-t border-ink/10 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-black text-ink">Total</span>
                <span className="text-2xl font-black text-ink">{money(total)}</span>
              </div>
              <div className="grid gap-2">
                <input required name="name" placeholder="Your name" className="h-11 rounded-lg border border-ink/10 px-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20" />
                <input required name="phone" placeholder="Phone number" className="h-11 rounded-lg border border-ink/10 px-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20" />
                <textarea name="address" placeholder="Address or pickup note" rows={2} className="resize-none rounded-lg border border-ink/10 px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20" />
                <input name="notes" placeholder="Special instructions" className="h-11 rounded-lg border border-ink/10 px-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20" />
              </div>
              <Button className="mt-4 w-full" disabled={submitting || !lines.length}>
                {submitting ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
                Place order
              </Button>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

