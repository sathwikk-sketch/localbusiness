import { PackageSearch } from "lucide-react";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200/40 bg-gradient-to-br from-ink-50/30 to-white/50 p-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-ink-100/50 text-ink-400 mb-5">
        <PackageSearch className="size-7 stroke-[1.5]" />
      </div>
      <h3 className="text-lg font-semibold text-ink-900 mb-2">{title}</h3>
      <p className="max-w-sm text-sm text-ink-500 leading-relaxed">{message}</p>
    </div>
  );
}
