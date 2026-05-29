"use client";

import { MessageCircle } from "lucide-react";

import { buildWhatsAppUrl } from "@/lib/utils";

export function WhatsAppButton({ number, businessName }: { number?: string | null; businessName: string }) {
  return (
    <a
      href={buildWhatsAppUrl(number, `Hello, I want to order from ${businessName}.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Contact on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-mint-500 text-white shadow-elevated transition-all duration-350 hover:bg-mint-600 hover:shadow-premium hover:-translate-y-0.5 active:scale-95"
    >
      <MessageCircle className="size-6 stroke-[2] transition-transform duration-300 group-hover:scale-110" />

      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-mint-500 opacity-50 animate-ping" style={{ animationDuration: '2s' }} />
    </a>
  );
}
