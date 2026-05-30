"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  // Hero pinning and zoom transition
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);
  const heroOpacity = useTransform(scrollY, [400, 700], [1, 0]);
  const heroZIndex = useTransform(scrollY, [400, 401], [40, 0]);

  // Content reveal phases with staggered entrance
  const bannerOpacity = useTransform(scrollY, [600, 800], [0, 1]);
  const bannerY = useTransform(scrollY, [600, 800], [50, 0]);
  const bannerBlur = useTransform(scrollY, [600, 800], [20, 0]);

  const productsOpacity = useTransform(scrollY, [1000, 1200], [0, 1]);
  const productsY = useTransform(scrollY, [1000, 1200], [60, 0]);
  const productsBlur = useTransform(scrollY, [1000, 1200], [25, 0]);

  const offersOpacity = useTransform(scrollY, [1800, 2000], [0, 1]);
  const offersY = useTransform(scrollY, [1800, 2000], [80, 0]);
  const offersBlur = useTransform(scrollY, [1800, 2000], [30, 0]);

  const contactOpacity = useTransform(scrollY, [2600, 2800], [0, 1]);
  const contactY = useTransform(scrollY, [2600, 2800], [100, 0]);
  const contactBlur = useTransform(scrollY, [2600, 2800], [35, 0]);

  // Cursor-reactive lighting
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Cursor-reactive light position
  const lightX = mousePosition.x;
  const lightY = mousePosition.y;

  return (
    <main ref={containerRef} className="relative overflow-hidden bg-white">
      {/* Fixed cursor-reactive lighting */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          background: `radial-gradient(
            600px at ${lightX}px ${lightY}px,
            rgba(13, 148, 136, 0.08),
            transparent 80%
          )`,
        }}
        transition={{ type: "tween", duration: 0.2 }}
      />

      {/* Ambient background effects - fixed */}
      <div className="pointer-events-none fixed inset-0 z-[-10]">
        <div className="absolute top-0 left-[20%] size-[800px] bg-mint-500/4 blur-[150px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] size-[600px] bg-saffron-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Pinned Hero Section - stays on screen during scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-white">
        <SiteHeader profile={data.profile} onCartOpen={() => setCartOpen(true)} />

        <motion.div
          ref={heroRef}
          style={{
            scale: heroScale,
            opacity: heroOpacity,
            zIndex: heroZIndex,
          }}
          className="relative h-full w-full origin-center"
        >
          <HeroSection profile={data.profile} products={data.products} categories={data.categories} />
        </motion.div>

        {/* Hero exit blur fade */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-white pointer-events-none"
        />
      </div>

      {/* Scroll spacer for hero pinning */}
      <div className="relative h-[400px] bg-white" />

      {/* Immersive content sections - enter with staggered reveals and blur fade */}
      <motion.div
        style={{
          opacity: bannerOpacity,
          y: bannerY,
        }}
        className="relative bg-white"
      >
        <BannerStrip banners={data.banners} />
      </motion.div>

      <motion.div
        style={{
          opacity: productsOpacity,
          y: productsY,
        }}
        className="relative bg-white"
      >
        <ProductBrowser products={data.products} categories={data.categories} />
      </motion.div>

      <motion.div
        style={{
          opacity: offersOpacity,
          y: offersY,
        }}
        className="relative bg-white"
      >
        <OffersSection offers={data.offers} />
      </motion.div>

      <motion.div
        style={{
          opacity: contactOpacity,
          y: contactY,
        }}
        className="relative bg-white"
      >
        <ContactSection profile={data.profile} />
      </motion.div>

      {/* Footer */}
      <footer className="relative border-t border-ink-100/50 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-ink-500">
              &copy; {new Date().getFullYear()} {data.profile.business_name}
            </p>
            <p className="text-sm text-ink-400">
              Crafted for local discovery
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppButton number={data.profile.whatsapp_number} businessName={data.profile.business_name} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} profile={data.profile} />
    </main>
  );
}
