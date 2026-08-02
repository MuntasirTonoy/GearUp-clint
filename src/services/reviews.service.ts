import api from "@/lib/axios";
import type { APIResponse } from "@/types";

const createReview = async (payload: {
  gearId: string;
  rating: number;
  comment: string;
}) => {
  const { data } = await api.post<APIResponse<unknown>>("/reviews", payload);
  return data;
};

export const ReviewService = {
  createReview,
};
