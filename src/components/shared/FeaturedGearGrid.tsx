import { GearService } from "@/services/gear.service";
import GearCard from "./GearCard";

export default async function FeaturedGearGrid() {
  let gears;

  try {
    const result = await GearService.getGears({ limit: 4 });
    gears = result.gears;
  } catch {
    return (
      <div className="rounded-xl border border-border bg-muted/50 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load featured gear right now. Please try again later.
        </p>
      </div>
    );
  }

  if (!gears.length) {
    return (
      <div className="rounded-xl border border-border bg-muted/50 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No gear is listed yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {gears.map((gear) => (
        <GearCard key={gear.id} gear={gear} />
      ))}
    </div>
  );
}
