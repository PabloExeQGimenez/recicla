import { apiFetch } from "../lib/api";
import { authStorage, type AuthUser } from "./authStorage";

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export async function login(email: string, password: string) {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  authStorage.setSession(data.token, data.user);
  window.dispatchEvent(new Event("auth:login"));

  return data;
}

export function logout() {
  authStorage.clearSession();
  window.dispatchEvent(new Event("auth:logout"));
}
