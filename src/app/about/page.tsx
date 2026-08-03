import { Metadata } from "next";
import Link from "next/link";
import PublicShell from "@/components/shared/PublicShell";
import { 
  Mountain, 
  Users, 
  Shield, 
  Target, 
  CheckCircle, 
  TrendingUp, 
  Globe, 
  ArrowRight, 
  Search, 
  CalendarRange, 
  CreditCard, 
  Smile 
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us | GearUp",
  description: "Learn more about GearUp, the premier sports and outdoor equipment rental platform.",
};

export default function AboutPage() {
  return (
    <PublicShell>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-orange-500/10 via-muted/30 to-background py-24 sm:py-32">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 mb-6 animate-pulse">
            <Mountain className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">GearUp</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            We are on a mission to democratize outdoor adventure and active lifestyles. By connecting gear owners with enthusiasts, we build a community-powered, sustainable rental economy.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-orange-500">10,000+</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Adventurers</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-500">5,000+</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Gear Listings</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-500">৳1.5M+</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Saved by Renters</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-extrabold text-violet-500">99.8%</p>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Core Principles</h2>
          <p className="mt-3 text-muted-foreground">The values that drive us forward every single day.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 mb-6">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Community First</h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We connect like-minded neighbor adventurers, athletes, and explorers. We foster relationships built on trust, verified profiles, and shared outdoor passions.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 mb-6">
              <Shield className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Safe & Insured</h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Security is in our DNA. We secure payments natively via Stripe, require strict customer/provider rating feedback loops, and enforce stock safety thresholds.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-2xl hover:shadow-md transition-shadow">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 mb-6">
              <Target className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Ecological Circularity</h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Renting maximizes gear utilization, directly offsets industrial manufacturing footprint, and keeps premium sporting goods out of waste storage.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="bg-muted/30 py-20 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How GearUp Works</h2>
            <p className="mt-3 text-muted-foreground">A simple, four-step journey to getting outdoors.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="relative p-6 bg-card border border-border rounded-2xl">
              <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm">1</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 mb-4 mt-2">
                <Search className="size-5" />
              </div>
              <h4 className="font-bold text-base">Find Your Gear</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">Browse thousands of local equipment listings filtered by price in BDT, category, and date availability.</p>
            </div>

            <div className="relative p-6 bg-card border border-border rounded-2xl">
              <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm">2</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 mb-4 mt-2">
                <CalendarRange className="size-5" />
              </div>
              <h4 className="font-bold text-base">Book the Dates</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">Select rental start and end dates and confirm available stock quantity limits instantly.</p>
            </div>

            <div className="relative p-6 bg-card border border-border rounded-2xl">
              <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm">3</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 mb-4 mt-2">
                <CreditCard className="size-5" />
              </div>
              <h4 className="font-bold text-base">Secure Checkout</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">Pay safely via Stripe cards using BDT or proceed to bulk pay your cart in a single click.</p>
            </div>

            <div className="relative p-6 bg-card border border-border rounded-2xl">
              <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm">4</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 mb-4 mt-2">
                <Smile className="size-5" />
              </div>
              <h4 className="font-bold text-base">Pick Up & Enjoy</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">Confirm pickup with the provider, complete your sports activity, and return when done.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6 tracking-tight">Our Story</h2>
        <div className="text-muted-foreground leading-relaxed space-y-6 text-base sm:text-lg">
          <p>
            GearUp was born from a simple realization: high-quality outdoor and sports equipment is expensive, takes up too much storage space, and sits idle for most of the year. Meanwhile, countless people want to try new sports or adventures but are deterred by the steep upfront costs of buying gear.
          </p>
          <p>
            We created this platform to bridge that gap. By empowering providers to generate passive earnings from their idle equipment and allowing customers to rent premium gear affordably, we build a smarter way to consume sports gear.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to get started?</h2>
          <p className="mx-auto max-w-xl text-orange-100 text-sm sm:text-base leading-relaxed">
            Join the community today. Rent the gear you need, or start list your equipment and monetize your closet.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="/gear"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-white text-orange-600 hover:bg-orange-50 font-bold flex items-center gap-2 shadow-lg"
              )}
            >
              Browse Gear Listings
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dashboard/provider/gear/new"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white text-white hover:bg-white/10 font-bold"
              )}
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
