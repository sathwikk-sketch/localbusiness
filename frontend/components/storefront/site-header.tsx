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
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-3 py-3 md:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-mint to-saffron text-sm font-black text-ink">
            {profile.business_name.slice(0, 2).toUpperCase()}
          </span>
          <span className="truncate text-sm font-black tracking-wide text-ink sm:text-base">
            {profile.business_name}
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="rounded-full px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/5 hover:text-ink">
              {label}
            </a>
          ))}
          <Link href="/admin" className="rounded-full px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-ink/5 hover:text-ink">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" aria-label="Open cart" onClick={onCartOpen} className="relative">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-rose text-[11px] text-white">
                {count}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="glass mx-auto mt-2 grid max-w-7xl gap-1 rounded-lg p-3 md:hidden">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-4 py-3 text-sm font-semibold text-ink/75 hover:bg-white">
              {label}
            </a>
          ))}
          <Link href="/admin" className="rounded-md px-4 py-3 text-sm font-semibold text-ink/75 hover:bg-white">
            Admin
          </Link>
        </div>
      )}
    </header>
  );
}

