"use client";

import { motion } from "framer-motion";
import { Loader2, LockKeyhole, Store } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    try {
      const result = await api.login(String(form.get("email")), String(form.get("password")));
      localStorage.setItem("localbiz_token", result.access_token);
      toast.success("Welcome back");
      router.push("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-lg p-6 sm:p-8"
      >
        <Link href="/" className="mb-8 inline-flex items-center gap-3 text-sm font-black text-ink">
          <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-mint to-saffron">
            <Store className="size-5" />
          </span>
          LocalBiz Commerce
        </Link>
        <div className="mb-6">
          <div className="mb-4 grid size-12 place-items-center rounded-lg bg-ink text-white">
            <LockKeyhole className="size-6" />
          </div>
          <h1 className="text-3xl font-black text-ink">Admin login</h1>
          <p className="mt-2 text-sm leading-6 text-ink/60">Manage products, orders, offers, banners, and homepage content.</p>
        </div>
        <div className="grid gap-3">
          <input
            required
            type="email"
            name="email"
            defaultValue="owner@example.com"
            placeholder="Email"
            className="h-12 rounded-lg border border-ink/10 bg-white px-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20"
          />
          <input
            required
            type="password"
            name="password"
            defaultValue="password123"
            placeholder="Password"
            className="h-12 rounded-lg border border-ink/10 bg-white px-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-mint/20"
          />
        </div>
        <Button className="mt-5 w-full" disabled={loading}>
          {loading ? <Loader2 className="size-5 animate-spin" /> : <LockKeyhole className="size-5" />}
          Sign in
        </Button>
      </motion.form>
    </main>
  );
}

