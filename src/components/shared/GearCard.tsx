import Image from "next/image";
import Link from "next/link";
import { Mountain } from "lucide-react";
import type { Gear } from "@/types";
import { formatCurrency } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const IMAGE_SIZES =
  "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

export default function GearCard({ gear }: { gear: Gear }) {
  const image = gear.images?.[0] ?? null;
  const providerName = gear.provider?.businessName;
  const isAvailable = gear.status === "AVAILABLE";

  return (
    <Link
      href={`/gears/${gear.id}`}
      className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full gap-0 overflow-hidden p-0 transition-shadow group-hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {image ? (
            <Image
              src={image}
              alt={gear.name}
              fill
              sizes={IMAGE_SIZES}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Mountain className="size-10 text-muted-foreground/50" />
            </div>
          )}
          <Badge
            variant={isAvailable ? "default" : "secondary"}
            className={
              isAvailable
                ? "absolute left-3 top-3 bg-emerald-500 text-white"
                : "absolute left-3 top-3"
            }
          >
            {isAvailable ? "Available" : gear.status}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <h3 className="text-base font-semibold text-foreground">
            {gear.name}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {gear.description}
          </p>
          <div className="mt-auto flex items-end justify-between pt-2">
            <div>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(gear.dailyRentalPrice)}
              </span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
            {providerName && (
              <span className="text-xs font-medium text-muted-foreground">
                {providerName}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
