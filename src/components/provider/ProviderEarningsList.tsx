"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Copy, Check, Search, TrendingUp, ReceiptText, Banknote } from "lucide-react";
import { PaymentService } from "@/services/payment.service";
import { formatCurrency } from "@/utils/format";
import type { Payment } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy transaction ID"
      className="ml-1.5 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-500" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

export default function ProviderEarningsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    PaymentService.getProviderEarnings()
      .then(({ payments: data, totalEarnings: total }) => {
        if (active) {
          setPayments(data);
          setTotalEarnings(total);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payments;
    return payments.filter(
      (p) =>
        p.transactionId?.toLowerCase().includes(q) ||
        p.rental?.gear?.name?.toLowerCase().includes(q) ||
        (p.rental as any)?.customer?.name?.toLowerCase().includes(q) ||
        (p.rental as any)?.customer?.email?.toLowerCase().includes(q)
    );
  }, [payments, search]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
        </div>
        <Skeleton className="h-10 w-full" />
        {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  const totalTransactions = payments.length;
  const avgEarning = totalTransactions > 0 ? totalEarnings / totalTransactions : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <Banknote className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalEarnings)}</p>
            <p className="text-xs text-muted-foreground mt-1">From {totalTransactions} completed payment{totalTransactions !== 1 ? "s" : ""}</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            <ReceiptText className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTransactions}</p>
            <p className="text-xs text-muted-foreground mt-1">Successful payments received</p>
          </CardContent>
        </Card>

        <Card className="border-violet-500/20 bg-violet-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Per Rental</CardTitle>
            <TrendingUp className="size-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-violet-600">{formatCurrency(avgEarning)}</p>
            <p className="text-xs text-muted-foreground mt-1">Average earning per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          id="earnings-search"
          type="text"
          placeholder="Search by transaction ID, gear name, or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Empty State */}
      {payments.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card py-16 text-center">
          <Banknote className="size-10 text-muted-foreground" />
          <div className="space-y-1">
            <p className="font-semibold">No earnings yet</p>
            <p className="text-sm text-muted-foreground">
              Payments from your rental orders will appear here once received.
            </p>
          </div>
        </div>
      )}

      {/* No Search Results */}
      {payments.length > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card py-10 text-center">
          <Search className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No results found for &ldquo;{search}&rdquo;</p>
        </div>
      )}

      {/* Transactions Table */}
      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[600px] table-auto">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Gear</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Transaction ID</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => {
                const rental = payment.rental as any;
                return (
                  <tr key={payment.id} className="border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors">
                    {/* Gear */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {rental?.gear?.images?.[0] && (
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md border border-border">
                            <Image
                              src={rental.gear.images[0]}
                              alt={rental.gear.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium truncate max-w-[140px]">
                          {rental?.gear?.name ?? "—"}
                        </span>
                        {rental?.orderedQuantity && (
                          <Badge variant="secondary" className="rounded-full px-1.5 py-0 text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
                            {rental.orderedQuantity}
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium">{rental?.customer?.name ?? "—"}</p>
                      <p className="text-xs text-muted-foreground">{rental?.customer?.email ?? ""}</p>
                    </td>

                    {/* Transaction ID */}
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded select-all max-w-[200px] truncate block">
                          {payment.transactionId}
                        </code>
                        <CopyButton text={payment.transactionId} />
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                      {formatCurrency(payment.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          Showing {filtered.length} of {totalTransactions} transaction{totalTransactions !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
