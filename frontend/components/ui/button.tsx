"use client";

import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
};

export function Button({ className, variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-250 focus:outline-none focus-visible:ring-2 focus-visible:ring-mint-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.97]",
        variant === "primary" && "bg-ink-900 text-white shadow-soft hover:bg-ink-800 hover:shadow-elevated",
        variant === "secondary" && "bg-white text-ink-700 shadow-subtle ring-1 ring-ink-100 hover:bg-ink-50 hover:ring-ink-200",
        variant === "ghost" && "text-ink-600 hover:bg-ink-50 active:bg-ink-100",
        variant === "danger" && "bg-rose-500 text-white hover:bg-rose-600",
        size === "sm" && "h-9 px-4 text-sm font-medium",
        size === "md" && "h-11 px-5 text-sm font-medium",
        size === "lg" && "h-12 px-7 text-base font-medium",
        size === "icon" && "size-11 p-0",
        className
      )}
      {...props}
    />
  );
}
