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

const getProviderEarnings = async (): Promise<{ payments: Payment[]; totalEarnings: number }> => {
  const { data } = await api.get<APIResponse<{ payments: Payment[]; totalEarnings: number }>>(
    "/payments/provider-earnings"
  );
  return data.data;
};

const initiateBulkPayment = async (rentalIds: string[]): Promise<PaymentSession> => {
  const { data } = await api.post<APIResponse<PaymentSession>>(
    "/payments/initiate-bulk",
    { rentalIds }
  );
  return data.data;
};

const confirmPaymentSession = async (sessionId: string): Promise<{ success: boolean; rentalIds?: string[] }> => {
  const { data } = await api.post<APIResponse<{ success: boolean; rentalIds?: string[] }>>(
    "/payments/confirm-session",
    { sessionId }
  );
  return data.data;
};

export const PaymentService = {
  initiatePayment,
  getMyPayments,
  getProviderEarnings,
  initiateBulkPayment,
  confirmPaymentSession,
};
