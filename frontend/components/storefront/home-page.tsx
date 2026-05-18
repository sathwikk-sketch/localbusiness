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
    <main>
      <SiteHeader profile={data.profile} onCartOpen={() => setCartOpen(true)} />
      <HeroSection profile={data.profile} banner={data.banners[0]} products={data.products} />
      <BannerStrip banners={data.banners} />
      <ProductBrowser products={data.products} categories={data.categories} />
      <OffersSection offers={data.offers} />
      <ContactSection profile={data.profile} />
      <footer className="border-t border-ink/10 px-4 py-8 text-center text-sm font-semibold text-ink/60">
        © {new Date().getFullYear()} {data.profile.business_name}. Built for local commerce.
      </footer>
      <WhatsAppButton number={data.profile.whatsapp_number} businessName={data.profile.business_name} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} profile={data.profile} />
    </main>
  );
}

