"use client";

import { Mail, MapPin, Phone } from "lucide-react";

import { buildWhatsAppUrl } from "@/lib/utils";
import type { BusinessProfile } from "@/types";

export function ContactSection({ profile }: { profile: BusinessProfile }) {
  const map = profile.maps_embed_url || "https://www.google.com/maps?q=India&output=embed";
  const whatsapp = buildWhatsAppUrl(profile.whatsapp_number, `Hello, I want to know more about ${profile.business_name}.`);

  return (
    <section id="contact" className="mx-auto grid max-w-7xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div id="about" className="glass rounded-lg p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-mint">About</p>
        <h2 className="mt-2 text-3xl font-black text-ink">{profile.business_name}</h2>
        <p className="mt-4 leading-8 text-ink/70">{profile.about}</p>
        <div className="mt-8 grid gap-3">
          {profile.address && (
            <div className="flex items-start gap-3 rounded-lg bg-white/70 p-4">
              <MapPin className="mt-1 size-5 shrink-0 text-rose" />
              <span className="text-sm font-semibold leading-6 text-ink/70">{profile.address}</span>
            </div>
          )}
          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="flex items-center gap-3 rounded-lg bg-white/70 p-4 text-sm font-semibold text-ink/70 transition hover:bg-white">
              <Phone className="size-5 text-mint" />
              {profile.phone}
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="flex items-center gap-3 rounded-lg bg-white/70 p-4 text-sm font-semibold text-ink/70 transition hover:bg-white">
              <Mail className="size-5 text-saffron" />
              {profile.email}
            </a>
          )}
          <a href={whatsapp} target="_blank" rel="noreferrer" className="rounded-lg bg-mint px-5 py-4 text-center text-sm font-black text-white transition hover:bg-mint/90">
            Message on WhatsApp
          </a>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg bg-white shadow-soft ring-1 ring-ink/10">
        <iframe
          title={`${profile.business_name} map`}
          src={map}
          loading="lazy"
          className="h-[420px] w-full border-0 lg:h-full"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

