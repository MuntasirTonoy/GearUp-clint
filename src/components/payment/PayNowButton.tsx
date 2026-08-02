"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { PaymentService } from "@/services/payment.service";
import { getApiErrorMessage } from "@/utils/api";
import { Button } from "@/components/ui/button";

export default function PayNowButton({ rentalId }: { rentalId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePay = async () => {
    setIsSubmitting(true);
    try {
      const session = await PaymentService.initiatePayment(rentalId);
      window.location.assign(session.url);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      type="button"
      className="w-full bg-emerald-500 text-white hover:bg-emerald-400"
      onClick={handlePay}
      disabled={isSubmitting}
    >
      <CreditCard />
      {isSubmitting ? "Redirecting to Stripe..." : "Pay with Stripe"}
    </Button>
  );
}
