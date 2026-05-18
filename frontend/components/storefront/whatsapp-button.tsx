"use client";

import { MessageCircle } from "lucide-react";

import { buildWhatsAppUrl } from "@/lib/utils";

export function WhatsAppButton({ number, businessName }: { number?: string | null; businessName: string }) {
  return (
    <a
      href={buildWhatsAppUrl(number, `Hello, I want to order from ${businessName}.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Open WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-mint text-white shadow-glass transition hover:-translate-y-1 hover:bg-mint/90"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}

