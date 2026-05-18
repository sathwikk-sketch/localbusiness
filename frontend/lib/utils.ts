import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function money(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2
  }).format(amount);
}

export function absoluteAssetUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}${url}`;
}

export function buildWhatsAppUrl(number: string | null | undefined, message: string) {
  const cleaned = (number ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  if (!cleaned) return "#contact";
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

