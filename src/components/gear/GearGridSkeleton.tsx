import GearCardSkeleton from "@/components/shared/GearCardSkeleton";

export default function GearGridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3"
      role="status"
      aria-label="Loading gear"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <GearCardSkeleton key={index} />
      ))}
    </div>
  );
}
