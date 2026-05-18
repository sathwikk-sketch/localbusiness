"use client";

import { motion } from "framer-motion";
import { BadgePercent, Sparkles } from "lucide-react";

import type { Offer } from "@/types";

export function OffersSection({ offers }: { offers: Offer[] }) {
  if (!offers.length) return null;

  return (
    <section id="offers" className="bg-ink px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-saffron">Offers</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Promotions that move stock faster</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white/80">
            <Sparkles className="size-4 text-saffron" />
            Festival, weekend, and clearance campaigns
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {offers.map((offer, index) => (
            <motion.article
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-lg border border-white/15 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
            >
              <div className="mb-5 grid size-12 place-items-center rounded-lg bg-saffron text-ink">
                <BadgePercent className="size-6" />
              </div>
              <div className="text-4xl font-black">{Number(offer.percentage).toFixed(0)}%</div>
              <h3 className="mt-3 text-xl font-black">{offer.title}</h3>
              {offer.description && <p className="mt-3 text-sm leading-6 text-white/70">{offer.description}</p>}
              {offer.highlight_text && <div className="mt-5 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black text-ink">{offer.highlight_text}</div>}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

