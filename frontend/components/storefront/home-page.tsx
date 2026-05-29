"use client";

import { useState } from "react";

import { BannerStrip } from "@/components/storefront/banner-strip";
import { CartDrawer } from "@/components/storefront/cart-drawer";
import { ContactSection } from "@/components/storefront/contact-section";
import { HeroSection } from "@/components/storefront/hero-section";
import { OffersSection } from "@/components/storefront/offers-section";
import { ProductBrowser } from "@/components/storefront/product-browser";
import { SiteHeader } from "@/components/storefront/site-header";
import { WhatsAppButton } from "@/components/storefront/whatsapp-button";
import type { StorefrontData } from "@/types";

export function HomePage({ data }: { data: StorefrontData }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <main className="relative min-h-screen">
      {/* Ambient background atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-[-10]">
        <div className="absolute top-0 left-[20%] size-[800px] bg-mint-500/3 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] size-[600px] bg-saffron-500/4 blur-[120px] rounded-full" />
      </div>

      <SiteHeader profile={data.profile} onCartOpen={() => setCartOpen(true)} />
      <HeroSection profile={data.profile} products={data.products} categories={data.categories} />
      <BannerStrip banners={data.banners} />
      <ProductBrowser products={data.products} categories={data.categories} />
      <OffersSection offers={data.offers} />
      <ContactSection profile={data.profile} />

      {/* Footer */}
      <footer className="relative border-t border-ink-100/50 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-ink-500">
              &copy; {new Date().getFullYear()} {data.profile.business_name}
            </p>
            <p className="text-sm text-ink-400">
              Crafted for local commerce
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppButton number={data.profile.whatsapp_number} businessName={data.profile.business_name} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} profile={data.profile} />
    </main>
  );
}
