import Link from "next/link";
import { Mountain } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const FOOTER_LINKS = {
  Explore: [
    { href: "/gear", label: "Browse Gear" },
    { href: "/", label: "Categories" },
  ],
  Company: [
    { href: "/", label: "About" },
    { href: "/", label: "Contact" },
  ],
  Legal: [
    { href: "/", label: "Terms" },
    { href: "/", label: "Privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold tracking-tight"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Mountain className="size-4" />
              </span>
              GearUp
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Rent sports and outdoor gear on demand. Borrow the gear you need,
              when you need it.
            </p>
            <Link
              href="/register"
              className={cn(buttonVariants({ variant: "default" }), "mt-4")}
            >
              Become a Provider
            </Link>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold">{title}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GearUp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
