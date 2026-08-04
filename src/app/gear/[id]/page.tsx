import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import PublicShell from "@/components/shared/PublicShell";
import GearGallery from "@/components/gear/GearGallery";
import RentNowWidget from "@/components/gear/RentNowWidget";
import GearReviews from "@/components/gear/GearReviews";
import { GearService } from "@/services/gear.service";
import { formatCurrency } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Gear details",
};

export const dynamic = "force-dynamic";

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let gear;
  try {
    gear = await GearService.getGear(id);
  } catch {
    notFound();
  }

  const isAvailable = gear.status === "AVAILABLE";
  const providerUser = gear.provider?.user;
  const providerLabel =
    providerUser?.name ?? gear.provider?.businessName ?? "Provider";
  const providerInitials = providerLabel
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <PublicShell>
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/gear"
            className="transition-colors hover:text-foreground"
          >
            Browse gear
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">{gear.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-8 animate-fade-up">
            <GearGallery images={gear.images} name={gear.name} />

            <section>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={
                        isAvailable ? "bg-emerald-500 text-white" : undefined
                      }
                    >
                      {isAvailable ? "Available" : gear.status}
                    </Badge>
                    {gear.category?.name && (
                      <span className="text-sm text-muted-foreground">
                        {gear.category.name}
                      </span>
                    )}
                  </div>
                  <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {gear.name}
                  </h1>
                </div>
                <div className="mt-1 sm:mt-0">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(gear.dailyRentalPrice)}
                    <span className="text-sm font-normal text-muted-foreground">
                      {" "}/day
                    </span>
                  </p>
                </div>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground text-sm sm:text-base">
                {gear.description}
              </p>
            </section>

            {/* Mobile / Tablet RentNowWidget (hidden on desktop) */}
            <div className="block lg:hidden animate-scale-in">
              <RentNowWidget gear={gear} />
            </div>

            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold">Specifications</h2>
              <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Daily rental price
                  </dt>
                  <dd className="mt-1 font-semibold">
                    {formatCurrency(gear.dailyRentalPrice)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">
                    Quantity available
                  </dt>
                  <dd className="mt-1 font-semibold">{gear.quantity}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Category</dt>
                  <dd className="mt-1 font-semibold">
                    {gear.category?.name ?? "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Status</dt>
                  <dd className="mt-1 font-semibold">{gear.status}</dd>
                </div>
              </dl>
            </section>

            {gear.provider && (
            <section className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-lg font-bold">Provider</h2>
                <div className="mt-4 flex items-start gap-3">
                  <Avatar className="size-11">
                    {providerUser?.profilePhoto ? (
                      <AvatarImage
                        src={providerUser.profilePhoto}
                        alt={providerLabel}
                      />
                    ) : null}
                    <AvatarFallback>{providerInitials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 space-y-1">
                    <p className="font-semibold">{providerLabel}</p>
                    {gear.provider.businessName && gear.provider.businessName !== providerLabel && (
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {gear.provider.businessName}
                      </p>
                    )}
                    {gear.provider.address && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 shrink-0" />
                        {gear.provider.address}
                      </p>
                    )}
                    {providerUser?.email && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="size-4 shrink-0" />
                        {providerUser.email}
                      </p>
                    )}
                    {providerUser?.phone && (
                      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Phone className="size-4 shrink-0" />
                        {providerUser.phone}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          <aside className="hidden lg:block min-w-0">
            <RentNowWidget gear={gear} />
          </aside>
        </div>

        <GearReviews reviews={gear.reviews ?? []} />
      </div>
    </PublicShell>
  );
}
