import api from "@/lib/axios";
import type { APIResponse, PaymentSession } from "@/types";

const initiatePayment = async (rentalId: string): Promise<PaymentSession> => {
  const { data } = await api.post<APIResponse<PaymentSession>>(
    "/payments/initiate",
    { rentalId }
  );
  return data.data;
};

export const PaymentService = {
  initiatePayment,
};
