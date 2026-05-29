"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { buildWhatsAppUrl } from "@/lib/utils";
import type { BusinessProfile } from "@/types";

export function ContactSection({ profile }: { profile: BusinessProfile }) {
  const map = profile.maps_embed_url || "https://www.google.com/maps?q=India&output=embed";
  const whatsapp = buildWhatsAppUrl(profile.whatsapp_number, `Hello, I want to know more about ${profile.business_name}.`);

  const contactItems = [
    ...(profile.address ? [{ icon: MapPin, label: "Location", value: profile.address }] : []),
    ...(profile.phone ? [{ icon: Phone, label: "Phone", value: profile.phone, href: `tel:${profile.phone}` }] : []),
    ...(profile.email ? [{ icon: Mail, label: "Email", value: profile.email, href: `mailto:${profile.email}` }] : []),
  ];

  return (
    <section id="contact" className="relative mx-auto max-w-7xl overflow-hidden px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      {/* Ambient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 size-[400px] bg-mint-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 size-[300px] bg-saffron-500/6 blur-[80px] rounded-full" />
      </div>

      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-8">
        {/* About/Contact Card */}
        <motion.div
          id="about"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-tawny-brown/5 via-transparent to-saffron-50/40"
        >
          {/* Glass overlay */}
          <div className="absolute inset-0 backdrop-blur-xl" />

          {/* Content */}
          <div className="relative glass-strong rounded-2xl p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mint-600 mb-3">
                About Us
              </p>
              <h2 className="text-display-sm sm:text-heading-xl text-ink-900 font-semibold leading-tight">
                {profile.business_name}
              </h2>
            </div>

            {/* Description */}
            <p className="text-body-md sm:text-body-lg text-ink-600 leading-relaxed mb-8">
              {profile.about}
            </p>

            {/* Contact Items */}
            {contactItems.length > 0 && (
              <div className="space-y-3 mb-6">
                {contactItems.map((item, index) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="group flex items-start gap-3 rounded-xl bg-white/60 p-4 transition-all duration-250 hover:bg-white/80">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-600 transition-colors duration-250 group-hover:bg-mint-50 group-hover:text-mint-600">
                        <Icon className="size-[18px] stroke-[2]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-ink-400 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-medium text-ink-700 leading-relaxed">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a key={index} href={item.href} className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={index}>{content}</div>
                  );
                })}
              </div>
            )}

            {/* WhatsApp CTA */}
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-mint-500 px-6 py-3.5 text-white font-semibold shadow-soft transition-all duration-300 hover:bg-mint-600 hover:shadow-elevated"
            >
              <MessageCircle className="size-5 stroke-[2]" />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-ink-100/50"
        >
          <iframe
            title={`${profile.business_name} map`}
            src={map}
            loading="lazy"
            className="h-[400px] w-full border-0 lg:h-full min-h-[320px]"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>
    </section>
  );
}
