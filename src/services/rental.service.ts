import api from "@/lib/axios";
import type {
  APIResponse,
  CreateRentalPayload,
  Meta,
  PaginationParams,
  Rental,
} from "@/types";

const createRental = async (payload: CreateRentalPayload): Promise<Rental> => {
  const { data } = await api.post<APIResponse<Rental>>("/rentals", payload);
  return data.data;
};

export interface RentalsResult {
  rentals: Rental[];
  meta?: Meta;
}

const getMyRentals = async (params?: PaginationParams): Promise<RentalsResult> => {
  const { data } = await api.get<APIResponse<Rental[]>>("/rentals/my-rentals", {
    params,
  });
  return { rentals: data.data, meta: data.meta };
};

const getRental = async (id: string): Promise<Rental> => {
  const { data } = await api.get<APIResponse<Rental>>(`/rentals/${id}`);
  return data.data;
};

export const RentalService = {
  createRental,
  getMyRentals,
  getRental,
};
