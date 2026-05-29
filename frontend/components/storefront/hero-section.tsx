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
    <section className="relative min-h-[92svh] overflow-hidden">
      {/* Editorial background with sophisticated layering */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-[1.02]"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ink-950/95 via-ink-900/85 to-ink-800/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
        {/* Ambient glow accents */}
        <div className="absolute top-0 left-0 w-[60%] h-[60%] bg-mint/5 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-saffron/6 blur-[100px] rounded-full opacity-50" />
      </div>

      {/* Main content */}
      <div className="relative mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-end px-5 pb-14 pt-36 sm:px-8 lg:px-12 lg:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-[680px]"
        >
          {/* Overline */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/6 px-4 py-1.5 backdrop-blur-sm border border-white/10"
          >
            <span className="size-1.5 rounded-full bg-mint-400 animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
              {profile.tagline}
            </span>
          </motion.div>

          {/* Serif headline - Editorial */}
          <h1 className="headline-serif text-display-lg sm:text-display-xl text-white leading-[1.05] tracking-[-0.02em]">
            {profile.business_name}
          </h1>

          {/* Subtitle with refined typography */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 max-w-xl text-body-lg sm:text-body-xl text-white/65 font-normal leading-relaxed"
          >
            {profile.hero_subtitle}
          </motion.p>

          {/* CTAs with clear hierarchy */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <a href="#products" className="group">
              <Button
                size="lg"
                className="w-full bg-white text-ink-900 hover:bg-white/95 shadow-elevated rounded-xl px-7 h-12 sm:w-auto group-hover:shadow-premium transition-all duration-350"
              >
                <ShoppingCart className="size-[18px] stroke-[2]" />
                <span className="font-semibold tracking-[-0.01em]">Browse products</span>
              </Button>
            </a>
            <a
              href={buildWhatsAppUrl(profile.whatsapp_number, message)}
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              <Button
                size="lg"
                variant="secondary"
                className="w-full bg-white/8 text-white border-white/15 hover:bg-white/12 hover:border-white/20 shadow-none rounded-xl px-7 h-12 sm:w-auto backdrop-blur-sm transition-all duration-350"
              >
                <MessageCircle className="size-[18px] stroke-[2]" />
                <span className="font-semibold tracking-[-0.01em]">Order via WhatsApp</span>
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Stats with refined presentation */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-14 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl"
        >
          {[
            { value: `${products.length}+`, label: "Curated products" },
            { value: `${products.filter((p) => p.in_stock).length}`, label: "Ready to order" },
            { value: "24h", label: "Quick delivery" }
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="group relative rounded-xl bg-white/5 border border-white/8 backdrop-blur-sm p-4 sm:p-5 transition-all duration-350 hover:bg-white/8 hover:border-white/12"
            >
              <div className="text-xl sm:text-2xl font-semibold text-white tracking-[-0.02em]">
                {stat.value}
              </div>
              <div className="mt-1 text-[11px] sm:text-xs font-medium text-white/45 uppercase tracking-[0.06em]">
                {stat.label}
              </div>
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-mint/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 pointer-events-none" />
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#products"
          aria-label="Scroll to products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 right-8 group flex flex-col items-center gap-2.5 transition-opacity duration-350 hover:opacity-100"
        >
          <div className="size-11 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/8 group-hover:border-white/25 transition-all duration-350">
            <ArrowDown className="size-4 text-white/70 group-hover:text-white transition-colors duration-350" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.12em] text-white/35 font-medium hidden sm:block">
            Explore
          </span>
        </motion.a>
      </div>
    </section>
  );
}
