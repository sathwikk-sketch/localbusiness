"use client";

import { motion } from "framer-motion";
import { ArrowDown, MessageCircle, ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { absoluteAssetUrl, buildWhatsAppUrl } from "@/lib/utils";
import type { Banner, BusinessProfile, Product } from "@/types";

export function HeroSection({
  profile,
  banner,
  products
}: {
  profile: BusinessProfile;
  banner?: Banner;
  products: Product[];
}) {
  const image =
    absoluteAssetUrl(banner?.image_url) ??
    absoluteAssetUrl(products.find((product) => product.image_url)?.image_url) ??
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80";
  const message = `Hello, I want to order from ${profile.business_name}.`;

  return (
    <section className="relative min-h-[86svh] overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-br from-ink/90 via-ink/70 to-rose/40" />
      <div className="relative mx-auto flex min-h-[86svh] max-w-7xl flex-col justify-end px-4 pb-12 pt-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            {profile.tagline}
          </div>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl lg:text-7xl">{profile.business_name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">{profile.hero_subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#products">
              <Button size="lg" className="w-full bg-white text-ink hover:bg-white/90 sm:w-auto">
                <ShoppingCart className="size-5" />
                Shop products
              </Button>
            </a>
            <a href={buildWhatsAppUrl(profile.whatsapp_number, message)} target="_blank" rel="noreferrer">
              <Button size="lg" variant="secondary" className="w-full border-white/30 bg-white/10 text-white ring-white/25 hover:bg-white/20 sm:w-auto">
                <MessageCircle className="size-5" />
                WhatsApp store
              </Button>
            </a>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {[
            [`${products.length}+`, "Products listed"],
            [`${products.filter((product) => product.in_stock).length}`, "In stock now"],
            ["4", "Order statuses"]
          ].map(([value, label]) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="rounded-lg border border-white/20 bg-white/10 p-4 backdrop-blur"
            >
              <div className="text-2xl font-black">{value}</div>
              <div className="text-sm font-semibold text-white/70">{label}</div>
            </motion.div>
          ))}
        </div>

        <a href="#products" aria-label="Scroll to products" className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full border border-white/25 bg-white/10 backdrop-blur transition hover:bg-white/20">
          <ArrowDown className="size-5" />
        </a>
      </div>
    </section>
  );
}
