"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-store";
import type { BusinessProfile } from "@/types";

export function SiteHeader({
  profile,
  onCartOpen
}: {
  profile: BusinessProfile;
  onCartOpen: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const links = [
    ["Products", "#products"],
    ["Offers", "#offers"],
    ["About", "#about"],
    ["Contact", "#contact"]
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-5 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <nav className="glass-strong flex items-center justify-between rounded-2xl px-3.5 py-2.5 sm:px-5 lg:px-6 lg:py-3 transition-all duration-350">
          {/* Logo */}
          <Link href="/" className="group flex min-w-0 items-center gap-3">
            <div className="relative flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-mint-500 to-mint-600 transition-transform duration-350 group-hover:scale-105">
              <span className="text-sm font-bold text-white">
                {profile.business_name.slice(0, 2).toUpperCase()}
              </span>
              <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
            </div>
            <span className="hidden truncate text-sm font-semibold tracking-[-0.01em] text-ink-700 sm:block lg:text-base">
              {profile.business_name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="relative rounded-lg px-4 py-2 text-sm font-medium text-ink-600 transition-colors duration-250 hover:text-ink-900 hover:bg-ink-50/60"
              >
                {label}
              </a>
            ))}
            <div className="mx-2 h-5 w-px bg-ink-200/50" />
            <Link
              href="/admin"
              className="rounded-lg px-4 py-2 text-sm font-medium text-ink-500 transition-colors duration-250 hover:text-ink-700 hover:bg-ink-50/40"
            >
              Admin
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <Button
              variant="secondary"
              size="sm"
              aria-label="Open cart"
              onClick={onCartOpen}
              className="relative h-10 min-w-10 rounded-xl bg-ink-50/80 hover:bg-ink-100/80 border-0 transition-all duration-250"
            >
              <ShoppingBag className="size-[18px] text-ink-600" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-mint-500 text-[11px] font-semibold text-white shadow-sm">
                  {count}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-xl lg:hidden hover:bg-ink-50/80 transition-colors duration-250"
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? (
                <X className="size-[18px] text-ink-600" />
              ) : (
                <Menu className="size-[18px] text-ink-600" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {open && (
          <div className="glass-strong mt-2.5 rounded-2xl p-2 lg:hidden animate-fade-in">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-ink-700 transition-colors duration-200 hover:bg-ink-50/60"
              >
                {label}
              </a>
            ))}
            <div className="my-1.5 h-px bg-ink-100/60" />
            <Link
              href="/admin"
              className="block rounded-lg px-4 py-3 text-sm font-medium text-ink-500 transition-colors duration-200 hover:bg-ink-50/40"
            >
              Admin Dashboard
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
