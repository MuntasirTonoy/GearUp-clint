import type { Metadata } from "next";
import Script from "next/script";
import { Raleway } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GearUp",
    template: "%s | GearUp",
  },
  description:
    "Rent sports and outdoor gear on demand from trusted local providers.",
  icons: {
    icon: "/favicon.png",
  },
};

import Navbar from "@/components/shared/Navbar";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className={cn("min-h-full flex flex-col font-sans", raleway.variable, raleway.className)}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var stored = localStorage.getItem("gearup-theme");
                var dark = stored === "dark";
                if (!stored) {
                  dark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                  ).matches;
                }
                if (dark) {
                  document.documentElement.classList.add("dark");
                }
              } catch (e) {}
            })();
          `}
        </Script>
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: `
            .reveal-fade-up, .reveal-scale-in {
              opacity: 1 !important;
              transform: none !important;
              transition: none !important;
            }
          `}} />
        </noscript>
        <Navbar />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
