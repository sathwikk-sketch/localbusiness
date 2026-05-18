import type { Metadata } from "next";

import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalBiz Commerce",
  description: "Modern local business management platform for products, stock, orders, offers, and WhatsApp selling.",
  keywords: ["local business", "grocery store", "restaurant", "pharmacy", "inventory", "orders", "WhatsApp commerce"]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
