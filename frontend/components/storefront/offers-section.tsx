"use client";

import { motion } from "framer-motion";
import { BadgePercent, Clock } from "lucide-react";

import type { Offer } from "@/types";

export function OffersSection({ offers }: { offers: Offer[] }) {
  if (!offers.length) return null;

  return (
    <section id="offers" className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-ink-900 px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      {/* Ambient background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 size-[500px] bg-mint-500/8 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 size-[400px] bg-saffron-500/10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-semibold uppercase tracking-[0.15em] text-mint-400 mb-3"
            >
              Limited Time Offers
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-display-sm sm:text-heading-xl text-white font-semibold leading-tight"
            >
              Exclusive savings waiting for you
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-sm"
          >
            <Clock className="size-4 text-saffron-400" />
            <span className="text-sm text-white/70">Limited availability</span>
          </motion.div>
        </div>

        {/* Offers Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer, index) => (
            <motion.article
              key={offer.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.12 + index * 0.06 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-350 hover:bg-white/8 hover:border-white/15"
            >
              {/* Accent gradient */}
              <div className="absolute -top-12 -right-12 size-40 bg-gradient-radial from-mint-500/15 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-350" />

              <div className="relative">
                {/* Icon */}
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-500 shadow-lg">
                  <BadgePercent className="size-6 text-white stroke-[2.5]" />
                </div>

                {/* Discount */}
                <div className="text-5xl font-semibold text-white tracking-[-0.03em] mb-3">
                  {Number(offer.percentage).toFixed(0)}%
                  <span className="ml-1 text-2xl text-white/60">off</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {offer.title}
                </h3>

                {/* Description */}
                {offer.description && (
                  <p className="text-sm text-white/60 leading-relaxed">
                    {offer.description}
                  </p>
                )}

                {/* Highlight badge */}
                {offer.highlight_text && (
                  <div className="mt-5 inline-flex items-center rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-saffron-300">
                      {offer.highlight_text}
                    </span>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
