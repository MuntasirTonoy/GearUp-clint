import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Meta } from "@/types";

type SearchParams = Record<string, string | string[] | undefined>;

function getQueryString(searchParams: SearchParams, page: number) {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value !== undefined) {
      params.set(key, value);
    }
  });
  params.set("page", String(page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

function getPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const pages: (number | "...")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

export default function GearPagination({
  meta,
  searchParams,
}: {
  meta: Meta;
  searchParams: SearchParams;
}) {
  const totalPages =
    meta.totalPages ?? Math.max(1, Math.ceil(meta.total / meta.limit));

  if (totalPages <= 1) return null;

  const current = meta.page;
  const pages = getPageList(current, totalPages);

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      {current > 1 ? (
        <Link
          href={`/gear${getQueryString(searchParams, current - 1)}`}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "pointer-events-none opacity-50"
          )}
        >
          <ChevronLeft className="size-4" />
        </span>
      )}

      {pages.map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm text-muted-foreground"
          >
            &hellip;
          </span>
        ) : (
          <Link
            key={page}
            href={`/gear${getQueryString(searchParams, page)}`}
            aria-current={page === current ? "page" : undefined}
            className={cn(
              buttonVariants({
                variant: page === current ? "default" : "outline",
                size: "icon",
              }),
              page === current &&
                "bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"
            )}
          >
            {page}
          </Link>
        )
      )}

      {current < totalPages ? (
        <Link
          href={`/gear${getQueryString(searchParams, current + 1)}`}
          className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "pointer-events-none opacity-50"
          )}
        >
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
