import api from "@/lib/axios";
import type {
  APIResponse,
  AuthPayload,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types";

const register = async (payload: RegisterPayload): Promise<AuthPayload> => {
  const { data } = await api.post<APIResponse<AuthPayload>>(
    "/auth/register",
    payload
  );
  return data.data;
};

const login = async (payload: LoginPayload): Promise<AuthPayload> => {
  const { data } = await api.post<APIResponse<AuthPayload>>(
    "/auth/login",
    payload
  );
  return data.data;
};

const logout = async (): Promise<void> => {
  await api.post<APIResponse<null>>("/auth/logout");
};

const getMe = async (): Promise<User> => {
  const { data } = await api.get<APIResponse<User>>("/users/me", {
    skipAuthRefresh: true,
  });
  return data.data;
};

const updateMe = async (payload: FormData): Promise<User> => {
  const { data } = await api.patch<APIResponse<User>>("/users/me", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

export const AuthService = {
  register,
  login,
  logout,
  getMe,
  updateMe,
};
