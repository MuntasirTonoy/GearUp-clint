"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown, RotateCcw, Search } from "lucide-react";
import { CategoryService } from "@/services/category.service";
import type { Category } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PRICE_MIN = 0;
const PRICE_MAX = 1000;
const PRICE_STEP = 10;

export default function GearFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState(false);

  const [searchInput, setSearchInput] = useState(
    searchParams.get("searchTerm") ?? ""
  );
  const debouncedSearch = useDebounce(searchInput, 400);

  const [localMin, setLocalMin] = useState(
    Number(searchParams.get("minPrice") ?? PRICE_MIN)
  );
  const [localMax, setLocalMax] = useState(
    Number(searchParams.get("maxPrice") ?? PRICE_MAX)
  );
  const debouncedMin = useDebounce(localMin, 300);
  const debouncedMax = useDebounce(localMax, 300);

  const categoryId = searchParams.get("categoryId") ?? "";

  useEffect(() => {
    let active = true;
    CategoryService.getCategories()
      .then((list) => {
        if (active) setCategories(list);
      })
      .catch(() => {
        if (active) setCategoriesError(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  useEffect(() => {
    const current = searchParams.get("searchTerm") ?? "";
    if (debouncedSearch !== current) {
      updateParams({ searchTerm: debouncedSearch || undefined });
    }
  }, [debouncedSearch, searchParams, updateParams]);

  useEffect(() => {
    const currentMin = Number(searchParams.get("minPrice") ?? PRICE_MIN);
    const currentMax = Number(searchParams.get("maxPrice") ?? PRICE_MAX);
    if (debouncedMin === currentMin && debouncedMax === currentMax) return;
    updateParams({
      minPrice:
        debouncedMin > PRICE_MIN ? String(debouncedMin) : undefined,
      maxPrice:
        debouncedMax < PRICE_MAX ? String(debouncedMax) : undefined,
    });
  }, [debouncedMin, debouncedMax, searchParams, updateParams]);

  const toggleCategory = (id: string) => {
    updateParams({ categoryId: id === categoryId ? undefined : id || undefined });
  };

  const reset = () => {
    setSearchInput("");
    setLocalMin(PRICE_MIN);
    setLocalMax(PRICE_MAX);
    updateParams({
      searchTerm: undefined,
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  const hasActiveFilters =
    searchInput !== "" ||
    categoryId !== "" ||
    localMin !== PRICE_MIN ||
    localMax !== PRICE_MAX;

  const selectedCategory = categories.find((cat) => cat.id === categoryId);

  const handleMinChange = (value: number) => {
    setLocalMin(Math.min(value, localMax - PRICE_STEP));
  };

  const handleMaxChange = (value: number) => {
    setLocalMax(Math.max(value, localMin + PRICE_STEP));
  };

  const thumbClass = cn(
    "pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent",
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow",
    "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-emerald-500 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow"
  );

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile Toggle Button */}
      <div className="flex items-center justify-between lg:hidden">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <span className="flex items-center gap-2 text-base font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            Filters
            {hasActiveFilters && (
              <span className="ml-1 flex h-2 w-2 rounded-full bg-orange-500" />
            )}
          </span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              isMobileOpen && "rotate-180"
            )}
          />
        </Button>
      </div>

      <div
        className={cn(
          "flex-col gap-6 lg:flex lg:sticky lg:top-24",
          isMobileOpen ? "flex" : "hidden"
        )}
      >
        <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold tracking-tight">Filters</h2>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-muted-foreground"
            onClick={reset}
          >
            <RotateCcw className="size-3.5" />
            Reset
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="gear-search" className="text-sm font-medium">
          Search
        </label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="gear-search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Tents, bikes, skis..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Category</span>
        {categoriesError ? (
          <p className="text-xs text-muted-foreground">
            Couldn&apos;t load categories.
          </p>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  {selectedCategory?.name ?? "All categories"}
                  <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
              }
            />
            <DropdownMenuContent align="start" className="max-h-72 w-56 overflow-y-auto">
              <DropdownMenuItem onClick={() => toggleCategory("")}>
                <span className="flex-1">All categories</span>
                {categoryId === "" && (
                  <Check className="size-4 text-emerald-500" />
                )}
              </DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                >
                  <span className="flex-1">{category.name}</span>
                  {categoryId === category.id && (
                    <Check className="size-4 text-emerald-500" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Price range</span>
        <div className="mb-1 flex items-center justify-between text-sm tabular-nums">
          <span>${localMin}</span>
          <span>${localMax}</span>
        </div>
        <div className="relative h-5">
          <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-emerald-500"
            style={{
              left: `${(localMin / PRICE_MAX) * 100}%`,
              right: `${100 - (localMax / PRICE_MAX) * 100}%`,
            }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={localMin}
            onChange={(event) => handleMinChange(Number(event.target.value))}
            aria-label="Minimum price"
            className={thumbClass}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={localMax}
            onChange={(event) => handleMaxChange(Number(event.target.value))}
            aria-label="Maximum price"
            className={thumbClass}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>${PRICE_MIN}</span>
          <span>${PRICE_MAX}</span>
        </div>
      </div>
      </div>
    </div>
  );
}
