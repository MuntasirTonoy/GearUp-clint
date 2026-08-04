import { GearService } from "@/services/gear.service";
import type { GearQueryParams } from "@/types";
import GearCard from "@/components/shared/GearCard";
import GearPagination from "./GearPagination";

type SearchParams = Record<string, string | string[] | undefined>;

function buildQuery(searchParams: SearchParams): GearQueryParams {
  const get = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const query: GearQueryParams = { limit: 6 };

  const searchTerm = get("searchTerm");
  const categoryId = get("categoryId");
  const minPrice = get("minPrice");
  const maxPrice = get("maxPrice");
  const page = get("page");

  if (searchTerm) query.searchTerm = searchTerm;
  if (categoryId) query.categoryId = categoryId;
  if (minPrice) query.minPrice = Number(minPrice);
  if (maxPrice) query.maxPrice = Number(maxPrice);
  if (page) query.page = Number(page);

  return query;
}

export default async function GearGridSection({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = buildQuery(searchParams);

  let gears;
  let meta;
  try {
    const result = await GearService.getGears(query);
    gears = result.gears;
    meta = result.meta;
  } catch {
    return (
      <div className="rounded-xl border border-border bg-muted/50 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          We couldn&apos;t load gear right now. Please try again later.
        </p>
      </div>
    );
  }

  if (!gears.length) {
    return (
      <div className="rounded-xl border border-border bg-muted/50 p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No gear matches your filters. Try adjusting them.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {meta?.total ?? gears.length} item
        {(meta?.total ?? gears.length) === 1 ? "" : "s"} found
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
        {gears.map((gear, index) => (
          <div
            key={gear.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 75}ms` }}
          >
            <GearCard gear={gear} />
          </div>
        ))}
      </div>
      {meta && <GearPagination meta={meta} searchParams={searchParams} />}
    </>
  );
}
