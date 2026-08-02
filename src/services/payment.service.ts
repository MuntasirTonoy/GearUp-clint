import api from "@/lib/axios";
import type { APIResponse, PaymentSession, Payment } from "@/types";

const initiatePayment = async (rentalId: string): Promise<PaymentSession> => {
  const { data } = await api.post<APIResponse<PaymentSession>>(
    "/payments/initiate",
    { rentalId }
  );
  return data.data;
};

const getMyPayments = async (): Promise<Payment[]> => {
  const { data } = await api.get<APIResponse<Payment[]>>("/payments/my-payments");
  return data.data;
};

export const PaymentService = {
  initiatePayment,
  getMyPayments,
};
