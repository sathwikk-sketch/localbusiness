export function ProductSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-lg bg-white/70 shadow-sm" />
      ))}
    </div>
  );
}

