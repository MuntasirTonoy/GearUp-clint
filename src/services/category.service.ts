import api from "@/lib/axios";
import type { APIResponse, Category } from "@/types";

const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<APIResponse<Category[]>>("/categories");
  return data.data;
};

const createCategory = async (payload: { name: string; description: string }): Promise<Category> => {
  const { data } = await api.post<APIResponse<Category>>("/categories", payload);
  return data.data;
};

const updateCategory = async (id: string, payload: { name: string; description: string }): Promise<Category> => {
  const { data } = await api.patch<APIResponse<Category>>(`/categories/${id}`, payload);
  return data.data;
};

const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};

export const CategoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
