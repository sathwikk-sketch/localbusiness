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
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-ink/20 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-ink text-white shadow-soft hover:-translate-y-0.5 hover:bg-ink/90",
        variant === "secondary" && "bg-white text-ink shadow-sm ring-1 ring-ink/10 hover:-translate-y-0.5 hover:ring-ink/20",
        variant === "ghost" && "text-ink hover:bg-ink/5",
        variant === "danger" && "bg-rose text-white hover:bg-rose/90",
        size === "sm" && "h-9 px-4 text-sm",
        size === "md" && "h-11 px-5 text-sm",
        size === "lg" && "h-12 px-7 text-base",
        size === "icon" && "size-10 p-0",
        className
      )}
      {...props}
    />
  );
}
