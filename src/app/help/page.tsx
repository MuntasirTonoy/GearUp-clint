import { Metadata } from "next";
import PublicShell from "@/components/shared/PublicShell";
import { HelpCircle, MessageCircle, FileText, Settings, ShieldQuestion } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/shared/Reveal";

export const metadata: Metadata = {
  title: "Help Center | GearUp",
  description: "Get support, read FAQs, and learn how to use the GearUp platform.",
};

const FAQ_ITEMS = [
  {
    question: "How do I rent an item?",
    answer: "Simply browse our catalog, select the gear you want, choose your dates, and click 'Request Rental'. Once the provider approves, you'll be prompted to complete the payment.",
  },
  {
    question: "Is there a deposit required?",
    answer: "Some high-value items may require a refundable security deposit. This will be clearly stated on the item's detail page before you confirm your request.",
  },
  {
    question: "How do I become a provider?",
    answer: "You can register as a Provider during sign-up, or upgrade your account from your dashboard. Once approved, you can start listing your gear and earning money.",
  },
  {
    question: "What happens if an item gets damaged?",
    answer: "We offer an optional damage protection plan during checkout. If an item is returned damaged without coverage, the renter is responsible for repair or replacement costs as per our Terms of Service.",
  },
  {
    question: "How are payments handled?",
    answer: "All payments are securely processed through our platform using Stripe. Providers receive payouts automatically after a successful rental period concludes.",
  },
];

export default function HelpPage() {
  return (
    <PublicShell>
      {/* Header */}
      <div className="bg-orange-500/5 py-16 border-b border-border">
        <Reveal className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 mb-6 shadow-lg shadow-orange-500/20 animate-pulse">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
            How can we help?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Search our knowledge base or browse categories below to find the answers you need.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          
          {/* Quick Links / Categories */}
          <div className="lg:col-span-4 space-y-6">
            <Reveal className="space-y-6">
              <h2 className="text-2xl font-bold tracking-tight">Support Categories</h2>
              <div className="grid gap-4">
                <Link href="#" className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-orange-500/50 hover:shadow-md transition-all">
                  <div className="bg-orange-500/10 p-3 rounded-lg"><FileText className="size-5 text-orange-500" /></div>
                  <div>
                    <h3 className="font-semibold">Getting Started</h3>
                    <p className="text-sm text-muted-foreground">Guides for new users</p>
                  </div>
                </Link>
                <Link href="#" className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-orange-500/50 hover:shadow-md transition-all">
                  <div className="bg-orange-500/10 p-3 rounded-lg"><Settings className="size-5 text-orange-500" /></div>
                  <div>
                    <h3 className="font-semibold">Account & Settings</h3>
                    <p className="text-sm text-muted-foreground">Manage your profile</p>
                  </div>
                </Link>
                <Link href="#" className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-orange-500/50 hover:shadow-md transition-all">
                  <div className="bg-orange-500/10 p-3 rounded-lg"><ShieldQuestion className="size-5 text-orange-500" /></div>
                  <div>
                    <h3 className="font-semibold">Trust & Safety</h3>
                    <p className="text-sm text-muted-foreground">Policies and protection</p>
                  </div>
                </Link>
              </div>
            </Reveal>
            
            <Reveal delay={150} className="mt-8 p-6 bg-muted/50 rounded-2xl border border-border text-center">
              <MessageCircle className="mx-auto size-8 text-muted-foreground mb-3" />
              <h3 className="font-semibold mb-2">Still need help?</h3>
              <p className="text-sm text-muted-foreground mb-4">Our support team is always ready to assist you.</p>
              <button className="w-full py-2.5 bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors">
                Contact Support
              </button>
            </Reveal>
          </div>

          {/* FAQs */}
          <div className="lg:col-span-8">
            <Reveal className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
            </Reveal>
            <div className="space-y-6">
              {FAQ_ITEMS.map((item, i) => (
                <Reveal key={i} delay={i * 100} className="h-full">
                  <div className="p-6 rounded-2xl border border-border bg-card">
                    <h3 className="text-lg font-bold text-foreground mb-2 flex items-start gap-3">
                      <span className="text-orange-500 shrink-0">Q.</span>
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed pl-7">
                      {item.answer}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PublicShell>
  );
}
