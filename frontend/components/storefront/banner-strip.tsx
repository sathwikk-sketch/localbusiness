"use client";

import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";

import type { Banner } from "@/types";

export function BannerStrip({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null;

  return (
    <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-2">
        {banners.slice(0, 2).map((banner, index) => (
          <motion.a
            key={banner.id}
            href={banner.cta_href ?? "#products"}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="glass group flex items-center gap-4 rounded-lg p-4"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-saffron/25 text-ink">
              <Megaphone className="size-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-black text-ink">{banner.title}</span>
              {banner.subtitle && <span className="line-clamp-2 text-sm leading-6 text-ink/60">{banner.subtitle}</span>}
            </span>
            <span className="ml-auto hidden rounded-full bg-ink px-4 py-2 text-sm font-bold text-white transition group-hover:bg-mint sm:inline-flex">
              {banner.cta_label ?? "View"}
            </span>
          </motion.a>
        ))}
      </div>
    </section>
  );
}

