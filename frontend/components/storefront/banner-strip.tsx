"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type { Banner } from "@/types";

export function BannerStrip({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null;

  return (
    <section className="mx-auto -mt-6 max-w-7xl px-5 sm:px-8 lg:px-12 relative z-10">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {banners.slice(0, 2).map((banner, index) => (
          <motion.a
            key={banner.id}
            href={banner.cta_href ?? "#products"}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 shadow-soft border border-ink-50/50 hover:shadow-elevated hover:border-transparent transition-all duration-350"
          >
            {/* Subtle gradient accent */}
            <div className="absolute top-0 right-0 size-32 bg-gradient-to-bl from-saffron-100/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-350" />

            <div className="relative flex items-center gap-4">
              {/* Icon container */}
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-500 text-white shadow-sm">
                <div className="size-5 rounded bg-white/30" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-semibold text-ink-900 tracking-[-0.01em]">
                  {banner.title}
                </h4>
                {banner.subtitle && (
                  <p className="mt-1 line-clamp-1 text-sm text-ink-500 leading-snug">
                    {banner.subtitle}
                  </p>
                )}
              </div>

              {/* CTA Arrow */}
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-350">
                <ArrowRight className="size-4 stroke-[2]" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
