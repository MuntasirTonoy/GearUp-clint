import GearCardSkeleton from "./GearCardSkeleton";

export default function FeaturedGearSkeleton() {
  return (
    <div
      className="grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      role="status"
      aria-label="Loading featured gear"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <GearCardSkeleton key={index} />
      ))}
    </div>
  );
}
