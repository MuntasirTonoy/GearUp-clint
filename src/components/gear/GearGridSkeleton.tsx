import GearCardSkeleton from "@/components/shared/GearCardSkeleton";

export default function GearGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
      role="status"
      aria-label="Loading gear"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <GearCardSkeleton key={index} />
      ))}
    </div>
  );
}
