import { api } from "../../lib/api";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = { access_token: string; token_type: string };

export async function login(payload: LoginPayload) {
  const res = await api.post<LoginResponse>("/auth/login", payload);
  return res.data;
}

export async function getMe() {
  const res = await api.get<{ id: number; email: string }>("/me");
  return res.data;
}