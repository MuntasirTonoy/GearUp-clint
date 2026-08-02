import { Metadata } from "next";
import PublicShell from "@/components/shared/PublicShell";
import { Mountain, Users, Shield, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | GearUp",
  description: "Learn more about GearUp, the premier sports and outdoor equipment rental platform.",
};

export default function AboutPage() {
  return (
    <PublicShell>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-muted/30 py-20">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 mb-6">
            <Mountain className="h-8 w-8 text-orange-500" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">GearUp</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            We're on a mission to make outdoor and sports equipment accessible to everyone, everywhere. 
            By connecting local gear owners with enthusiasts, we're building a sustainable, community-driven rental economy.
          </p>
        </div>
      </div>

      {/* Mission & Values */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 mb-6">
              <Users className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Community First</h3>
            <p className="mt-4 text-muted-foreground">
              We believe in the power of sharing. GearUp connects neighbors, athletes, and adventurers, fostering a community built on trust and mutual passion for the outdoors.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 mb-6">
              <Shield className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Safe & Secure</h3>
            <p className="mt-4 text-muted-foreground">
              Every transaction, item, and user is verified. Our secure payment system and comprehensive rating framework ensure peace of mind for both renters and providers.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 mb-6">
              <Target className="h-6 w-6 text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">Sustainability</h3>
            <p className="mt-4 text-muted-foreground">
              Renting instead of buying reduces waste and maximizes the lifespan of high-quality gear. We're committed to promoting circular economy principles in sports.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-muted/30 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            GearUp was born from a simple realization: high-quality outdoor and sports equipment is expensive, takes up too much storage space, and often sits unused for months at a time. Meanwhile, countless people want to try new activities but are deterred by the high upfront costs of buying gear.
            <br /><br />
            We created this platform to bridge that gap. Today, GearUp is the fastest-growing peer-to-peer equipment rental network, helping thousands of people get outside, stay active, and explore without limits.
          </p>
        </div>
      </div>
    </PublicShell>
  );
}
