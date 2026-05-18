import { SearchX } from "lucide-react";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-ink/15 bg-white/60 p-8 text-center">
      <SearchX className="mb-4 size-10 text-ink/30" />
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-ink/60">{message}</p>
    </div>
  );
}

