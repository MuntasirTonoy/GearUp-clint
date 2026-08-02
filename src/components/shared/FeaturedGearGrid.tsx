import { GearService } from "@/services/gear.service";
import GearCard from "./GearCard";

export default async function FeaturedGearGrid() {
  let gears;

  try {
    const result = await GearService.getGears({ limit: 4 });
    gears = result.gears;
  } catch {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center">
        <p className="text-sm text-zinc-500">
          We couldn&apos;t load featured gear right now. Please try again later.
        </p>
      </div>
    );
  }

  if (!gears.length) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-10 text-center">
        <p className="text-sm text-zinc-500">
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
